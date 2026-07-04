# Johannesburg Nature-based Solutions Impact Dashboard (MVP prototype)

[![Live Demo](https://img.shields.io/badge/live%20demo-online-3B7EA1)](https://johannesburg-nbs-impact-dashboard.vercel.app)
![Astro](https://img.shields.io/badge/Astro-5-FF5D01?logo=astro&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38BDF8?logo=tailwindcss&logoColor=white)

**Live demo:** [johannesburg-nbs-impact-dashboard.vercel.app](https://johannesburg-nbs-impact-dashboard.vercel.app)

A public facing, communication first dashboard that shows the impact of SUNCASA nature based solutions along the Jukskei River in Alexandra, Johannesburg. It is indicator driven and narrative supported, inspired by the MyPeg community dashboard, and built to be low bandwidth, accessible, and easy for the City of Johannesburg to own and extend.

This prototype was prepared as part of a proposal for the SUNCASA MVP dashboard consultancy. Values shown are illustrative and await the official SUNCASA data catalogue.

## Why this stack

- **Astro** ships almost no JavaScript by default, which suits the low bandwidth and mobile requirement.
- **React islands** are used only where interactivity is needed (language toggle, map, chart).
- **Leaflet with OpenStreetMap** needs no API token, so there is no vendor lock in.
- **Static output** deploys cleanly to Azure Static Web Apps or any static host on City infrastructure.
- Data, presentation, and content are kept separate, which reduces the maintenance burden.

## Requirements

- Node.js 20 or newer
- npm 10 or newer

## Getting started

```bash
npm install
npm run dev      # start the local dev server at http://localhost:4321
npm run build    # produce a static site in dist/
npm run preview  # preview the production build
```

## Data ingestion (CSV and Excel)

Source data lives in `data/` as friendly CSV and GeoJSON files. A city analyst can edit these, or drop in an Excel workbook, then regenerate the typed JSON the site reads:

```bash
npm run ingest
```

- Inputs: `data/indicators.csv`, `data/timeseries.csv`, `data/sites.geojson`, and optional `data/*.xlsx`
- Outputs: `src/data/indicators.json`, `src/data/timeseries.json`, `src/data/sites.json`

The Excel path uses the `xlsx` package. Exact workbook column mapping is confirmed during the Inception Phase once the SUNCASA workbook layout is known.

## Data export (CSV for Excel and Power BI)

The typed JSON data can be exported back to CSV so a City analyst can open it in Excel or import it into Power BI without transformation:

```bash
npm run export
```

- Inputs: `src/data/indicators.json`, `src/data/timeseries.json`
- Outputs: `data/indicators_export.csv`, `data/timeseries_export.csv`

## Project structure

```
prototype/
  data/                     source of truth CSV and GeoJSON
  scripts/ingest.mjs        CSV and Excel to JSON ingestion
  scripts/export.mjs        JSON to CSV export for Excel and Power BI
  public/                   static assets (favicon, etc.)
  src/
    components/             UI components and React islands
    data/                   typed data model and generated JSON
    i18n/                   EN and ZU dictionaries and helper
    layouts/BaseLayout.astro
    pages/                  index, [pillar], about-data, methodology, 404
    scripts/i18n-client.ts  client language runtime
    styles/tokens.css       design tokens and base styles
  staticwebapp_config.json  Azure Static Web Apps config
  vercel.json               Vercel deployment config
  Dockerfile                Docker image for City data centre hosting
```

## Languages (English and isiZulu)

The interface supports an English and isiZulu content structure with an instant `EN | ZU` toggle. Per the terms of reference, approved narrative text and translations are provided by IISD and the City of Johannesburg. The isiZulu strings in this prototype are structural placeholders only.

## Accessibility and performance

- Plain language, high contrast palette, visible focus states, skip link, and reduced motion support.
- Near zero baseline JavaScript. Map and chart libraries load only on the pages and viewports that need them.

## Scope

This is an MVP. Real time data feeds, advanced analytics and machine learning, custom authentication, and city wide coverage are explicitly out of scope for this phase. The structure is designed to scale into a city wide NbS platform in a later phase.

## Ownership and license

All code, configuration, and data in this repository are prepared for the City of Johannesburg Environment and Infrastructure Services Department as part of the SUNCASA MVP dashboard consultancy. This repository is made public temporarily for evaluation purposes during the proposal period. Upon contract award, ownership transfers to the City of Johannesburg and the repository will be transferred to City control. No third party may use, copy, or distribute this codebase without written permission from the author and the City of Johannesburg.
