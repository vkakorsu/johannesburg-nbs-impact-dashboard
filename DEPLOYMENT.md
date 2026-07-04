# Deployment Guide

This guide explains how to build the Johannesburg Nature-based Solutions Impact Dashboard and publish it to a live, shareable URL. The site is a static build, so it can be hosted almost anywhere. Pick the option that fits your needs.

- **Fastest live link for the proposal:** Netlify or Vercel drop in deploy (a few minutes)
- **Recommended for the City of Johannesburg:** Azure Static Web Apps (Microsoft compatible)
- **Portable or on premises:** Docker image behind nginx

The production build output is always the `dist/` folder, created by `npm run build`.

## 0. Prerequisites

- Node.js 20 or newer and npm 10 or newer
- The project installed and building locally:

```bash
npm install
npm run build      # outputs static files to dist/
npm run preview    # optional, preview the production build locally
```

If `npm run build` succeeds and `npm run preview` shows the site, you are ready to deploy.

---

## Option A. Netlify (fastest public link)

Netlify gives you a free public URL such as `https://your-site-name.netlify.app` in minutes.

### A1. Drag and drop (no account setup beyond signup)
1. Run `npm run build` to produce `dist/`.
2. Go to https://app.netlify.com/drop
3. Drag the `dist/` folder onto the page.
4. Netlify returns a live URL immediately. Copy it into the cover letter and submission email.

### A2. Connected to Git (auto rebuilds on every push)
1. Push this `prototype/` folder to a GitHub repository.
2. In Netlify, choose Add new site, then Import an existing project, and select the repo.
3. Set the build command to `npm run build` and the publish directory to `dist`.
4. Deploy. Netlify rebuilds automatically whenever you push.

A `netlify.toml` is included so the settings are detected automatically.

---

## Option B. Vercel (fast public link, Git based)

1. Push this `prototype/` folder to GitHub.
2. Go to https://vercel.com/new and import the repository.
3. Vercel detects Astro. Confirm the build command `npm run build` and output directory `dist`.
4. Deploy. You get a live URL such as `https://your-site.vercel.app`.

---

## Option C. Azure Static Web Apps (recommended for the City)

This is the Microsoft compatible path and the natural fit for City of Johannesburg infrastructure. A `staticwebapp.config.json` is already included for routing, headers, and the fallback page.

### C1. Using the Azure Portal and GitHub
1. Push this `prototype/` folder to a GitHub repository.
2. In the Azure Portal, create a resource, then choose Static Web App.
3. Sign in and select the repository and branch.
4. For build details set:
   - App location: `/` (or `/prototype` if the repo root contains more than this folder)
   - Api location: leave blank
   - Output location: `dist`
5. Create. Azure adds a GitHub Actions workflow and builds the site. When it finishes you get a URL such as `https://your-app.azurestaticapps.net`.

### C2. Using the Azure CLI (Static Web Apps CLI)
```bash
npm install -g @azure/static-web-apps-cli
npm run build
swa deploy ./dist --env production
```
Follow the prompts to sign in and select or create the Static Web App. The CLI prints the live URL when done.

### Custom domain (optional)
In the Static Web App resource, open Custom domains and add the City domain, then follow the DNS instructions. TLS is provisioned automatically.

---

## Option D. Docker (portable or on premises)

Use this to run the dashboard on Azure App Service, Azure Container Apps, or City data centre infrastructure with no code changes. A `Dockerfile` and `nginx.conf` are included.

```bash
# Build the image
docker build -t suncasa-jukskei-dashboard .

# Run it locally on http://localhost:8080
docker run --rm -p 8080:80 suncasa-jukskei-dashboard
```

To publish, push the image to a registry the City uses, for example Azure Container Registry:

```bash
az acr login --name <registryName>
docker tag suncasa-jukskei-dashboard <registryName>.azurecr.io/suncasa-jukskei-dashboard:latest
docker push <registryName>.azurecr.io/suncasa-jukskei-dashboard:latest
```

Then create an Azure Container App or Web App for Containers that pulls this image. The container serves the site on port 80.

---

## After you have a live URL

1. Paste the URL into these files, replacing the `[link to deployed prototype]` placeholder:
   - `submission/COVER_LETTER.md`
   - `submission/SUBMISSION_EMAIL.md`
2. If you also share the source, replace `[link to repository or attached archive]` in the email with your repository link.
3. Do a final check on a phone and on a slow connection, since low bandwidth and mobile use are explicit requirements.

## Updating the data before a deploy

If you change figures in `data/`, regenerate the typed JSON and rebuild before deploying:

```bash
npm run ingest
npm run build
```

## Troubleshooting

- **Blank map area on first load.** The map is a client only component and appears a moment after the page loads. This is expected and keeps the base page light.
- **404 on a refreshed sub page.** Make sure the output or publish directory is set to `dist`. The included Azure and nginx configs already handle fallback routing.
- **Build fails on the host.** Confirm the host uses Node.js 20 or newer and the build command `npm run build`.
