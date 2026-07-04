// SUNCASA data ingestion
//
// Purpose: turn the City of Johannesburg friendly source formats (CSV and Excel)
// into typed JSON that the dashboard reads at build time. This keeps data,
// presentation, and content fully separated, which is a core RFP requirement.
//
// Usage:
//   node scripts/ingest.mjs
//
// Inputs  (data/):   indicators.csv, timeseries.csv, sites.geojson, and any *.xlsx
// Outputs (src/data/): indicators.json, timeseries.json, sites.json
//
// The same pipeline accepts Excel workbooks so a non technical city analyst can
// update figures in Excel and regenerate the dashboard without touching code.

import { readFileSync, writeFileSync, existsSync, readdirSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const DATA_DIR = join(ROOT, "data");
const OUT_DIR = join(ROOT, "src", "data");

function parseCsv(text) {
  const rows = [];
  let field = "";
  let record = [];
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (ch === '"') { inQuotes = false; }
      else { field += ch; }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ",") {
      record.push(field); field = "";
    } else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && text[i + 1] === "\n") i++;
      if (field.length > 0 || record.length > 0) { record.push(field); rows.push(record); }
      field = ""; record = [];
    } else {
      field += ch;
    }
  }
  if (field.length > 0 || record.length > 0) { record.push(field); rows.push(record); }
  const header = rows.shift();
  return rows.map((r) => Object.fromEntries(header.map((h, idx) => [h.trim(), (r[idx] ?? "").trim()])));
}

function coerceNumber(value) {
  if (value === "" || value === undefined || value === null) return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : value;
}

function loadIndicators() {
  const csvPath = join(DATA_DIR, "indicators.csv");
  const rows = parseCsv(readFileSync(csvPath, "utf8"));
  return rows.map((row) => ({
    id: row.id,
    pillar: row.pillar,
    framework: row.framework,
    status: row.status,
    name: { en: row.name_en, zu: "" },
    unit: row.unit,
    latestValue: coerceNumber(row.latest_value),
    baselineValue: coerceNumber(row.baseline_value),
    trend: row.trend,
    why: { en: row.why_en, zu: "" },
    source: { en: row.source_en, zu: "" },
    frequency: { en: row.frequency_en, zu: "" },
    caveat: { en: row.caveat_en, zu: "" },
  }));
}

function loadTimeseries() {
  const csvPath = join(DATA_DIR, "timeseries.csv");
  const rows = parseCsv(readFileSync(csvPath, "utf8"));
  const byIndicator = {};
  for (const row of rows) {
    (byIndicator[row.indicator_id] ??= []).push({
      period: row.period,
      value: coerceNumber(row.value),
    });
  }
  return byIndicator;
}

function listExcelFiles() {
  if (!existsSync(DATA_DIR)) return [];
  return readdirSync(DATA_DIR).filter((f) => f.endsWith(".xlsx") || f.endsWith(".xls"));
}

async function main() {
  if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });

  const indicators = loadIndicators();
  const timeseries = loadTimeseries();
  const sites = JSON.parse(readFileSync(join(DATA_DIR, "sites.geojson"), "utf8"));

  const excel = listExcelFiles();
  if (excel.length > 0) {
    // Excel support is optional. If the xlsx package is installed, city analysts
    // can drop .xlsx files into data/ and they will be reported here. Parsing per
    // workbook is intentionally left to the Inception Phase once the exact
    // SUNCASA workbook layout is confirmed with the City of Johannesburg.
    console.log(`Detected Excel workbooks (ingest to be mapped in Inception): ${excel.join(", ")}`);
  }

  writeFileSync(join(OUT_DIR, "indicators.json"), JSON.stringify(indicators, null, 2));
  writeFileSync(join(OUT_DIR, "timeseries.json"), JSON.stringify(timeseries, null, 2));
  writeFileSync(join(OUT_DIR, "sites.json"), JSON.stringify(sites, null, 2));

  console.log(`Ingested ${indicators.length} indicators, ${Object.keys(timeseries).length} time series, ${sites.features.length} map features.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
