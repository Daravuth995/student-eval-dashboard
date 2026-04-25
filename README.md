# 🎓 Student Evaluation Dashboard

A premium React + Tailwind CSS + Framer Motion student evaluation portal with glassmorphism design.

---

## 🚀 GitHub Pages Deployment — Step-by-Step Guide

### Prerequisites
- [Node.js 18+](https://nodejs.org/) installed
- [Git](https://git-scm.com/) installed
- A [GitHub account](https://github.com/)
- [npm](https://npmjs.com/) (comes with Node.js)

---

### STEP 1 — Install dependencies locally

```bash
cd student-eval-dashboard
npm install
```

This installs React, Framer Motion, Tailwind, Chart.js, and all other dependencies.

---

### STEP 2 — Test it locally (optional but recommended)

```bash
npm start
```

Visit `http://localhost:3000` — you should see the login screen with the premium dark UI.
Press `Ctrl+C` to stop.

---

### STEP 3 — Create a GitHub repository

1. Go to [github.com](https://github.com)
2. Click **"New repository"** (the green button or `+` → New repository)
3. Name it: `student-eval-dashboard` (or any name you like)
4. Set it to **Public** (required for free GitHub Pages)
5. Do NOT initialize with README (we have our own)
6. Click **Create repository**

---

### STEP 4 — Set the homepage URL in package.json

Open `package.json` and update the `"homepage"` field:

```json
"homepage": "https://YOUR-GITHUB-USERNAME.github.io/student-eval-dashboard"
```

Replace `YOUR-GITHUB-USERNAME` with your actual GitHub username.
Replace `student-eval-dashboard` with your actual repository name if different.

**Example:**
```json
"homepage": "https://johnsmith.github.io/student-eval-dashboard"
```

---

### STEP 5 — Initialize Git and push to GitHub

Run these commands in your project folder:

```bash
git init
git add .
git commit -m "Initial commit — Student Evaluation Dashboard"
git branch -M main
git remote add origin https://github.com/YOUR-GITHUB-USERNAME/student-eval-dashboard.git
git push -u origin main
```

Replace the URL with your actual repository URL (GitHub shows it to you after creating the repo).

---

### STEP 6 — Deploy to GitHub Pages

```bash
npm run deploy
```

This command:
1. Runs `npm run build` to create an optimized production build
2. Pushes the `build/` folder to a `gh-pages` branch on GitHub

Wait ~60 seconds for GitHub to process it.

---

### STEP 7 — Enable GitHub Pages (if not auto-enabled)

1. Go to your GitHub repository
2. Click **Settings** tab
3. In the left sidebar, click **Pages**
4. Under **Source**, select:
   - Branch: `gh-pages`
   - Folder: `/ (root)`
5. Click **Save**

---

### STEP 8 — Visit your live site!

After 1–2 minutes, visit:
```
https://YOUR-GITHUB-USERNAME.github.io/student-eval-dashboard
```

---

## 🔄 Updating / Re-deploying

Any time you make changes:

```bash
git add .
git commit -m "Update: describe what you changed"
git push
npm run deploy
```

---

## 🛠 Project Structure

```
student-eval-dashboard/
├── public/
│   └── index.html          # HTML shell
├── src/
│   ├── components/
│   │   ├── ParticleCanvas.jsx     # Floating particles background
│   │   ├── LoadingScreen.jsx      # Animated loading overlay
│   │   ├── EntrySplash.jsx        # Welcome splash on login
│   │   ├── LoginPage.jsx          # Login form
│   │   ├── Dashboard.jsx          # Main dashboard (all sections)
│   │   ├── ScoreRing.jsx          # Animated circular score ring
│   │   ├── Cards.jsx              # StatCard, CriteriaCard, FeedbackCard
│   │   ├── ProfileSection.jsx     # Student profile + coupon embedded
│   │   ├── RedemptionPanel.jsx    # Coupon redemption UI
│   │   ├── PerformanceChart.jsx   # Line chart (Chart.js)
│   │   ├── FloatingActionButton.jsx # Orange FAB (Send Points)
│   │   ├── SendPointsModal.jsx    # Modal: send points + history
│   │   ├── ScoreGuideModal.jsx    # Score range reference
│   │   └── Toast.jsx              # Success notification
│   ├── config.js            # API URLs + constants
│   ├── App.jsx              # Root: routing between login/dashboard
│   ├── index.js             # React entry point
│   └── index.css            # Tailwind + global styles
├── package.json
├── tailwind.config.js
└── postcss.config.js
```

---

## ⚠️ Troubleshooting

### "404 Not Found" after deploy
→ Make sure `homepage` in `package.json` matches your exact GitHub Pages URL exactly.

### Blank white page
→ Open browser DevTools (F12 → Console). Usually a missing `homepage` field or a wrong URL.

### `npm run deploy` fails with permission error
→ Make sure you've set up Git remote correctly with Step 5. Run `git remote -v` to verify.

### Styles not loading (unstyled page)
→ Run `npm run build` again, then `npm run deploy`. Tailwind needs a fresh build.

### API calls failing (CORS errors)
→ This is expected in development if your Google Apps Script URLs haven't been configured for CORS. The app falls back to sample data gracefully.

---

## 🎨 Design System

| Token | Value |
|---|---|
| Primary | `#7c3aed` (purple) |
| Action | `#ff6b2b` (orange) |
| Success | `#34d399` |
| Warning | `#fbbf24` |
| Error | `#f87171` |
| Background | `black → slate-900 → purple-950` |
| Card | `bg-white/5 backdrop-blur border-white/10` |

---

## 📦 Tech Stack

| Library | Purpose |
|---|---|
| React 18 | UI framework |
| Framer Motion 11 | All animations |
| Tailwind CSS 3 | Utility-first styling |
| Chart.js + react-chartjs-2 | Performance history graph |
| gh-pages | GitHub Pages deployment |
