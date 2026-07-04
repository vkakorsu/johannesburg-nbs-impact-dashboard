// SUNCASA data export
//
// Purpose: export the dashboard's typed JSON data back to CSV format so a
// City analyst can open it in Excel or import it into Power BI without
// transformation. This fulfils the RFP requirement to "export data in
// standard formats (e.g., Excel, CSV)".
//
// Usage:
//   node scripts/export.mjs
//
// Inputs  (src/data/): indicators.json, timeseries.json
// Outputs (data/):     indicators_export.csv, timeseries_export.csv

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const DATA_DIR = join(ROOT, "src", "data");
const OUT_DIR = join(ROOT, "data");

function toCsv(rows) {
  if (rows.length === 0) return "";
  const headers = Object.keys(rows[0]);
  const escape = (val) => {
    const s = String(val ?? "");
    if (s.includes(",") || s.includes('"') || s.includes("\n")) {
      return '"' + s.replace(/"/g, '""') + '"';
    }
    return s;
  };
  const lines = [headers.join(",")];
  for (const row of rows) {
    lines.push(headers.map((h) => escape(row[h])).join(","));
  }
  return lines.join("\n");
}

function flattenIndicator(ind) {
  return {
    id: ind.id,
    pillar: ind.pillar,
    framework: ind.framework,
    status: ind.status,
    name_en: ind.name.en,
    name_zu: ind.name.zu,
    unit: ind.unit,
    latest_value: ind.latestValue,
    baseline_value: ind.baselineValue,
    trend: ind.trend,
    why_en: ind.why.en,
    why_zu: ind.why.zu,
    source_en: ind.source.en,
    source_zu: ind.source.zu,
    frequency_en: ind.frequency.en,
    frequency_zu: ind.frequency.zu,
    caveat_en: ind.caveat.en,
    caveat_zu: ind.caveat.zu,
  };
}

function flattenTimeseries(timeseriesMap) {
  const rows = [];
  for (const [indicatorId, points] of Object.entries(timeseriesMap)) {
    for (const point of points) {
      rows.push({ indicator_id: indicatorId, period: point.period, value: point.value });
    }
  }
  return rows;
}

function main() {
  if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });

  const indicators = JSON.parse(readFileSync(join(DATA_DIR, "indicators.json"), "utf8"));
  const timeseries = JSON.parse(readFileSync(join(DATA_DIR, "timeseries.json"), "utf8"));

  const indCsv = toCsv(indicators.map(flattenIndicator));
  const tsCsv = toCsv(flattenTimeseries(timeseries));

  writeFileSync(join(OUT_DIR, "indicators_export.csv"), indCsv);
  writeFileSync(join(OUT_DIR, "timeseries_export.csv"), tsCsv);

  console.log(`Exported ${indicators.length} indicators and ${Object.keys(timeseries).length} time series to CSV.`);
}

main();
