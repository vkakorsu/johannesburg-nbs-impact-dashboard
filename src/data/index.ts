import indicatorsData from "./indicators.json";
import timeseriesData from "./timeseries.json";
import sitesData from "./sites.json";
import type { Lang } from "../i18n";

export type PillarId = "flood" | "heat" | "environment" | "socio";
export type IndicatorStatus = "core" | "proposed";
export type Trend = "up" | "down" | "flat";

export interface LocalizedString {
  en: string;
  zu: string;
}

export interface Indicator {
  id: string;
  pillar: PillarId;
  framework: "PMF" | "EMP";
  status: IndicatorStatus;
  name: LocalizedString;
  unit: string;
  latestValue: number | null;
  baselineValue: number | null;
  trend: Trend;
  why: LocalizedString;
  source: LocalizedString;
  frequency: LocalizedString;
  caveat: LocalizedString;
}

export interface TimeseriesPoint {
  period: string;
  value: number;
}

export interface SiteFeature {
  type: "Feature";
  properties: {
    id: string;
    name: string;
    pillar: PillarId;
    type: string;
    summary: string;
  };
  geometry:
    | { type: "Point"; coordinates: [number, number] }
    | { type: "LineString"; coordinates: [number, number][] };
}

export interface SiteCollection {
  type: "FeatureCollection";
  metadata: { note: string; crs: string };
  features: SiteFeature[];
}

export const indicators = indicatorsData as Indicator[];
export const timeseries = timeseriesData as Record<string, TimeseriesPoint[]>;
export const sites = sitesData as SiteCollection;

export interface PillarMeta {
  id: PillarId;
  order: number;
  slug: string;
  labelKey: string;
  accent: string;
  title: { en: string; zu: string };
  summary: { en: string; zu: string };
}

// Four themes taken verbatim from the SUNCASA PRD thematic structure.
export const pillars: PillarMeta[] = [
  {
    id: "flood",
    order: 1,
    slug: "flood",
    labelKey: "nav.flood",
    accent: "#3B7EA1",
    title: { en: "Flood management", zu: "Ukulawulwa kwezikhukhula" },
    summary: {
      en: "Clearing and restoring the Jukskei channel so stormwater moves safely and fewer homes flood.",
      zu: "Ukuhlanza nokuvuselela umsele weJukskei ukuze amanzi ezimvula ahambe ngokuphepha futhi kuncishiswe izindlu ezikhukhulwayo.",
    },
  },
  {
    id: "heat",
    order: 2,
    slug: "heat",
    labelKey: "nav.heat",
    accent: "#B4643C",
    title: { en: "Heat management", zu: "Ukulawulwa kokushisa" },
    summary: {
      en: "Planting and growing trees that shade streets and homes and cool the neighbourhood.",
      zu: "Ukutshala nokukhulisa izihlahla ezisiza imigwaqo nezindlu ngomthunzi futhi zipholise indawo.",
    },
  },
  {
    id: "environment",
    order: 3,
    slug: "environment",
    labelKey: "nav.environment",
    accent: "#2F6B52",
    title: { en: "Environmental quality", zu: "Ikhwalithi yemvelo" },
    summary: {
      en: "Restoring the riparian corridor, improving water and soil, and bringing back native species.",
      zu: "Ukuvuselela umngcele womfula, ukuthuthukisa amanzi nenhlabathi, nokubuyisa izinhlobo zemvelo zendawo.",
    },
  },
  {
    id: "socio",
    order: 4,
    slug: "socio",
    labelKey: "nav.socio",
    accent: "#8A6D3B",
    title: { en: "Socio economic development", zu: "Intuthuko yezenhlalo nomnotho" },
    summary: {
      en: "Creating local jobs, involving women, and sharing the benefits of restoration fairly.",
      zu: "Ukudala imisebenzi yendawo, ukubandakanya abesifazane, nokwabelana ngezinzuzo zokuvuselela ngokulinganayo.",
    },
  },
];

export function getPillar(id: PillarId): PillarMeta {
  const found = pillars.find((p) => p.id === id);
  if (!found) throw new Error(`Unknown pillar: ${id}`);
  return found;
}

export function indicatorsByPillar(id: PillarId): Indicator[] {
  return indicators.filter((i) => i.pillar === id);
}

export function localized(value: LocalizedString, lang: Lang): string {
  return value[lang] && value[lang].length > 0 ? value[lang] : value.en;
}

// Headline indicators shown on the landing page, one representative core
// indicator per theme plus a fifth to match the PRD five headline design.
export const headlineIndicatorIds = [
  "debris_removed",
  "trees_planted",
  "riparian_restored",
  "jobs_created",
  "women_participants",
];

export function headlineIndicators(): Indicator[] {
  return headlineIndicatorIds
    .map((id) => indicators.find((i) => i.id === id))
    .filter((i): i is Indicator => Boolean(i));
}

// Merge the static UI dictionaries with per indicator and per pillar content so
// the client language toggle can swap every visible string using stable keys.
// Empty isiZulu values fall back to English so nothing blanks out when toggling,
// which is expected because approved translations are supplied by IISD later.
export function buildClientDictionaries(
  base: Record<"en" | "zu", Record<string, string>>,
): Record<"en" | "zu", Record<string, string>> {
  const en: Record<string, string> = { ...base.en };
  const zu: Record<string, string> = { ...base.zu };

  const put = (key: string, value: LocalizedString) => {
    en[key] = value.en;
    zu[key] = value.zu && value.zu.length > 0 ? value.zu : value.en;
  };

  for (const ind of indicators) {
    put(`ind.${ind.id}.name`, ind.name);
    put(`ind.${ind.id}.why`, ind.why);
    put(`ind.${ind.id}.source`, ind.source);
    put(`ind.${ind.id}.frequency`, ind.frequency);
    put(`ind.${ind.id}.caveat`, ind.caveat);
  }

  for (const p of pillars) {
    put(`pillar.${p.id}.title`, { en: p.title.en, zu: p.title.zu });
    put(`pillar.${p.id}.summary`, { en: p.summary.en, zu: p.summary.zu });
  }

  return { en, zu };
}
