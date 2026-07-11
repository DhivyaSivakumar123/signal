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
