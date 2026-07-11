# ⚡ Signal Frontend Application

<p align="center">
  <img src="https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white" alt="Angular" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/NgRx-BA263E?style=for-the-badge&logo=ngrx&logoColor=white" alt="NgRx" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Sass-CC6699?style=for-the-badge&logo=sass&logoColor=white" alt="Sass" />
</p>

---

## 📖 Overview

Welcome to the **Signal Frontend**! This is a state-of-the-art developer productivity and triage workspace built with **Angular 17**, **TypeScript**, and **NgRx**. It acts as a unified hub that ingests, scores, and prioritizes workspace messages (Slack, Gmail, Outlook, Calendar) so you can focus on what actually matters without context switching.

---

## ✨ Features

- **📬 Today's Triage Feed:** Smart, ranked view of your most urgent daily messages.
- **📊 Team Load Charts:** Interactive dashboard showing team volume and communication bottlenecks.
- **⚙️ Connected Integrations Workspace:**
  - Real-time connection management dashboard (Slack, Gmail, Outlook, Calendar).
  - Dynamic **"Checking..."** connection validator during initial status retrieval.
  - One-click connect, reconnect, and disconnect flows.
- **⏱️ Focus Slots:** Time blocking recommendations based on calendar availability.
- **🎨 Premium User Experience:** Elegant dark-mode layout, glassmorphism containers, smooth CSS transitions, and an animated **"Sync Now"** state.

---

## 🛠️ Technology Stack

- **Framework:** [Angular v17](https://angular.dev/) (Standalone Components Architecture)
- **State Management:** [NgRx v17](https://ngrx.io/) (Store, Effects, Selectors)
- **Styles:** Vanilla CSS with Sass (SCSS) design tokens
- **Component Suite:** [Angular Material v17](https://material.angular.io/)
- **Icons:** Google Material Symbols & Brand SVGs

---

## 🚀 Getting Started

### 📋 Prerequisites
Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18.x or above recommended)
- [Angular CLI](https://github.com/angular/angular-cli) (`npm install -g @angular/cli`)

### 📦 Installation
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### 💻 Running Development Server
Run the local dev server:
   ```bash
   npm run dev
   ```
Open your browser and navigate to `http://localhost:4200/`. The app will reload automatically when source code changes.

### 🏗️ Production Build
Compile production assets:
   ```bash
   npm run build
   ```
The output files will be located in the `dist/` directory.
