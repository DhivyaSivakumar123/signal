# ⚡ Signal — Frontend

<p align="left">
  <img src="https://skillicons.dev/icons?i=angular,ts,sass,vite" />
</p>

---

## 📖 Overview

**Signal Frontend** is a smart developer productivity workspace built with **Angular 17** Standalone Components, **NgRx** state management, and a premium dark-mode design system. It ingests, scores, and surfaces your most important workspace messages from Slack, Gmail, Outlook, and Calendar so you can focus on what truly matters — without context switching.

---

## ✨ Features

- **📬 Today's Triage Feed** — Ranked, urgency-scored view of your daily messages.
- **📊 Team Load Dashboard** — Interactive charts showing team communication volume and bottlenecks.
- **⚙️ Connected Integrations** — Real-time connection management with dynamic **Checking...** validation state.
- **⏱️ Focus Slots** — Time-block recommendations derived from calendar availability.
- **📧 Digest Notifications** — On-demand email summaries of your top priorities, dispatched via SMTP.
- **🎨 Premium Dark UI** — Glassmorphism containers, micro-animations, and animated Sync Now button state.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Angular 17 (Standalone Components) |
| State | NgRx 17 (Store, Effects, Selectors) |
| Styles | SCSS with design token system |
| UI Library | Angular Material 17 |
| Build Tool | Vite (via Angular CLI) |
| Language | TypeScript 5 |

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
```bash
npm run dev
```
Open `http://localhost:4200/` in your browser. The app hot-reloads on file changes.

### Production Build
```bash
npm run build
```
Build artifacts are output to the `dist/` directory.

---

## 👨‍💻 What I Built (Akaash-S)

* **Google Drive-Inspired Dark Design System**:
  * Overhauled the application aesthetic with high-contrast surfaces, glassmorphism cards, and Google Drive-inspired custom scrollbars.
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

| Triage Feed & Dark UI | Team Load & Analytics Dashboard |
| :---: | :---: |
| ![Triage Feed](docs/screenshots/triage_feed.png) | ![Team Load Analytics](docs/screenshots/team_analytics.png) |
| *Prioritized daily message stream with urgency badges* | *Chart.js hourly interruption heatmaps & source distribution* |

| Connected Integrations Manager | Focus Time & Calendar Slots |
| :---: | :---: |
| ![Integrations](docs/screenshots/integrations.png) | ![Focus Slots](docs/screenshots/focus_slots.png) |
| *Real-time OAuth provider status with "Checking..." validation* | *Calendar-derived focus blocks and scheduling recommendations* |

