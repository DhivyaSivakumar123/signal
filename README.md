# ⚡ Signal — Frontend

<p align="left">
  <img src="https://skillicons.dev/icons?i=angular,ts,sass,html,css" />
</p>

---

## 📖 Overview

**Signal Frontend** is a developer productivity workspace built with **Angular 17** Standalone Components, **NgRx** state management, and a Google Drive-inspired dark-mode design system. It ingests, scores, and surfaces your most important workspace messages from Google Workspace (**Gmail** and **Google Calendar** — live API integrations) with extensible connector stubs for **Slack** and **Microsoft Outlook** (synthetic mock generators disabled) so you can focus on high-impact work without context switching.

---

## 🔌 Real vs Stub Integrations (Aligned with Backend)

| Provider | Status | Implementation Details |
|---|---|---|
| **Google Gmail** | **REAL** | Live message ingestion via Google Gmail REST API (`/gmail/v1/users/me/messages?q=is:unread`), RFC 822 header extraction, snippet display, and automatic OAuth2 token refresh. |
| **Google Calendar** | **REAL** | Ingests calendar events via Google Calendar v3 API (`/calendar/v3/calendars/primary/events`) to surface upcoming meetings, schedule conflicts, and Focus Slot availability. |
| **Slack** | **STUB** | Stub connector structure retained in UI and backend for OAuth flow and future webhook ingestion. Mock random message generator is permanently disabled to ensure zero synthetic data. |
| **Microsoft Outlook** | **STUB** | Stub entity and endpoint structure preserved. Synthetic mock message generator disabled; ready for Microsoft Graph API credentials. |

---

## ✨ Features

- **📬 Today's Triage Feed** — Ranked, urgency-scored view of your daily messages (`NOW`, `TODAY`, `THIS_WEEK`, `FYI`).
- **📊 Team Load Dashboard** — Interactive Chart.js visualizations showing team communication volume and interruption distribution.
- **⚙️ Connected Integrations** — Real-time connection management with dynamic **Checking...** validation state.
- **⏱️ Focus Slots** — Time-block recommendations derived from Google Calendar availability.
- **📧 Digest Notifications** — On-demand email summaries of top priorities dispatched via authenticated SMTP.
- **🎨 Premium Dark UI** — Glassmorphism cards, micro-animations, custom scrollbars, and animated Sync Now button state.

---

## 🛠️ Tech Stack & Architecture Verification

| Layer | Technology | Verification Notes |
|---|---|---|
| **Framework** | Angular 17 (Standalone Components) | Strict standalone components with Angular Router and control flow (`@if`, `@for`). |
| **State Management** | NgRx 17 (Store, Effects, Selectors) | Centralized state management for `auth`, `integrations`, `triage`, and `analytics`. |
| **Styles** | SCSS with custom design token system | Glassmorphism surfaces, custom scrollbars, and high-contrast color palette. |
| **UI Library** | Angular Material 17 (`@angular/material`, `@angular/cdk`) | **Verified**: Uses `MatIconModule`, `MatTooltipModule`, and CDK utilities. |
| **Build Tool** | Angular CLI 17 (Application Builder with esbuild) | **Verified**: Uses `@angular-devkit/build-angular:application` powered by **esbuild** (Vite is not a standalone dependency in `package.json`). |
| **Charts** | Chart.js 4 + ng2-charts 6 | Hourly interruption heatmaps and source volume distributions. |
| **Language** | TypeScript 5.4 | Strict typing and modern ES2022 features. |

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) v18 or above
- [Angular CLI](https://github.com/angular/angular-cli): `npm install -g @angular/cli`

### Installation
```bash
cd frontend
npm install
```

### Running Development Server
Runs the environment configuration script and starts the Angular development server:
```bash
npm run dev
```
> This executes `node scripts/set-env.js && ng serve` and serves the app on `http://localhost:4200/` with live reload.

### Production Build
Compiles the application with optimizations into the `dist/` directory:
```bash
npm run build
```

### Development Watch Build
Builds in development mode and recompiles on file changes:
```bash
npm run watch
```

### Running Unit Tests
Executes unit tests via Karma and Jasmine:
```bash
npm test
```

---

## 👥 Contribution Table

*Extracted directly from git repository history (`git shortlog -sn HEAD`):*

| Commits | Author | Primary Areas of Contribution |
|:---:|---|---|
| **52** | **Akaash-S** | Application Architecture, NgRx State Management, Dark UI Design System, Chart.js Analytics Dashboard, OAuth Identity & Avatar Handlers, Integration Settings Manager. |
| **3** | **DhivyaSivakumar123** | Initial project scaffolding, base component stubs, initial routing. |

---

## 👨‍💻 What I Built (Akaash-S)

* **Google Drive-Inspired Dark Design System**:
  * Overhauled the application aesthetic with high-contrast surfaces, glassmorphism cards, and custom scrollbars.
  * Built the application shell, responsive navigation sidebar, and topbar layout.
* **NgRx State Management & Live Sync**:
  * Designed and implemented reactive state flows across `triage`, `integrations`, `auth`, and `analytics`.
  * Built the interactive **Sync Now** action in the sidebar with an animated spinning loader and optimistic disabled states.
* **Connected Tools & Integration Settings**:
  * Redesigned the integration manager with dynamic "Checking..." health-check status to prevent state flashing.
  * Separated item-level action loaders from global integration fetch states.
* **Team Load Analytics & Data Visualization**:
  * Built the Team Load metrics dashboard with KPI cards, source distribution breakdowns, and hourly interruption heatmaps powered by **Chart.js**.
  * Registered dynamic Chart.js scales and transformed raw backend rollups into responsive frontend models.
* **OAuth Identity & Avatar Handling**:
  * Integrated real Google and Microsoft profile avatar rendering with automated Gravatar fallback and high-fidelity provider badges.
  * Enforced `no-referrer` image security policies to prevent CDN loading blocks.

---

## 📸 Screenshots

> [!NOTE]
> Screenshot images are placeholders pending final visual capture and should be placed in `docs/screenshots/`. Below are the documented view descriptions:

- **Triage Feed**: Prioritized daily message stream categorized into NOW, TODAY, THIS WEEK, and FYI urgency badges (`docs/screenshots/triage_feed.png`).
- **Team Load Analytics**: Hourly interruption heatmaps, source volume breakdown, and focus metrics powered by Chart.js (`docs/screenshots/team_analytics.png`).
- **Connected Integrations Manager**: Real-time OAuth provider status cards with dynamic "Checking..." health validation (`docs/screenshots/integrations.png`).
- **Focus Time & Calendar Slots**: Google Calendar-derived focus blocks and smart scheduling recommendations (`docs/screenshots/focus_slots.png`).
