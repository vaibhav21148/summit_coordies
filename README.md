# E-Summit '26 - Events Website Portal

This standalone repository contains the frontend code for all **E-Summit '26 Events Websites & Registration Portals**.

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Local Development Server
```bash
npm start
```
*or:*
```bash
npx ng serve
```

The application will be running at [`http://localhost:4200/`](http://localhost:4200/).

---

## 📂 Event Pages & Routes

When running the project, opening [`http://localhost:4200/`](http://localhost:4200/) takes you to the **Events Hub**, which provides quick navigation to all event portals:

| Event | Main Route | Subroutes / Registrations |
| :--- | :--- | :--- |
| **Internship & Job Fair (IJF)** | `/ijf` | `/ijf/studreg`, `/ijf/compreg` |
| **Entre-MUN** | `/entremun` | `/entremun/reg`, `/entremun/dash` |
| **iHack Hackathon** | `/ihack` | `/ihack/reg` |
| **Innovation & Startup Expo** | `/expo` | `/expo/reg`, `/expo/dash` |
| **SeedStars** | `/seedstars` | `/seedstars/reg` |
| **Influencer Summit** | `/influencersummit` | `/influencersummit/nominate` |
| **International Summit (ISummit)** | `/isummit` | - |
| **Two Minutes To Market (TTMM)** | `/ttmm` | `/ttmm/reg` |
| **Contingent Leader (CL)** | `/cl` | `/cl/dash`, `/contingent` |
| **Competitions (Compi)** | `/compi` | `/compi/reg` |
| **Workshops** | `/workshops` | - |
| **Global Entrepreneurship Congress (GEC)** | `/gec` | `/gec/reg` |
| **Virtual Stock Market (VSM)** | `/vsm` | `/vsm/reg` |
| **Networking Arena (NA)** | `/na` | `/na/reg` |

---

## 📁 Directory Structure

```text
events_website_26/
├── src/
│   ├── app/
│   │   ├── pages/
│   │   │   ├── events-hub/             # Central developer landing page
│   │   │   └── events-website/         # All event website components
│   │   │       ├── ijf/
│   │   │       ├── entre-mun/
│   │   │       ├── ihack/
│   │   │       ├── expo/
│   │   │       ├── seed-stars/
│   │   │       ├── influencer-summit/
│   │   │       ├── isummit/
│   │   │       ├── ttmm/
│   │   │       ├── cl/
│   │   │       ├── compi/
│   │   │       ├── workshop/
│   │   │       ├── gec/
│   │   │       ├── vsm/
│   │   │       └── na/
│   │   ├── components/                 # Header, navbar, footer, fab
│   │   ├── shared/                     # Reusable UI components (events-bg, accordion, etc.)
│   │   ├── services/                   # APIs & HTTP services
│   │   └── constants/                  # Enums, metadata & event configurations
│   ├── assets/ & public/               # Images, branding & media assets
│   ├── styles.scss                     # Global styling
│   └── events-website.scss             # Event page layout styles
```
