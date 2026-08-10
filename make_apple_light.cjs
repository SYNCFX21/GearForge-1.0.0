const fs = require('fs');
let css = fs.readFileSync('src/index.css', 'utf-8');

// We will replace the entire light-mode-active block
const start = css.indexOf('body.light-mode-active {');
if (start !== -1) {
  css = css.substring(0, start);
}

const appleLight = `
/* =========================================
   APPLE-INSPIRED LIGHT MODE
   ========================================= */
body.light-mode-active {
  --app-bg: #f5f5f7;
  --card-bg: #ffffff;
  --text-main: #1d1d1f;
  color: var(--text-main);
  background-color: var(--app-bg);
}

body.light-mode-active .bg-\\[var\\(--card-bg\\)\\] {
  background-color: #ffffff !important;
  box-shadow: 0 4px 24px rgba(0,0,0,0.04) !important;
  border-color: rgba(0,0,0,0.04) !important;
}

body.light-mode-active .bg-\\[var\\(--app-bg\\)\\]\\/40,
body.light-mode-active .bg-\\[var\\(--app-bg\\)\\]\\/80,
body.light-mode-active .bg-\\[var\\(--app-bg\\)\\]\\/85 {
  background-color: rgba(245,245,247,0.85) !important;
}

/* Glassmorphism for Apple Light Mode */
body.light-mode-active .bg-\\[var\\(--color-glass\\)\\] {
  background-color: rgba(255,255,255,0.7) !important;
  border-color: rgba(0,0,0,0.05) !important;
  box-shadow: 0 8px 32px rgba(0,0,0,0.04) !important;
}

/* Text Overrides */
body.light-mode-active .text-white { color: #1d1d1f !important; }
body.light-mode-active .text-zinc-100,
body.light-mode-active .text-zinc-200,
body.light-mode-active .text-zinc-300,
body.light-mode-active .text-zinc-400 { color: #86868b !important; font-weight: 500; }
body.light-mode-active .text-zinc-500 { color: #a1a1a6 !important; }

/* Border Overrides */
body.light-mode-active .border-white\\/5,
body.light-mode-active .border-white\\/8,
body.light-mode-active .border-white\\/10,
body.light-mode-active .border-white\\/15,
body.light-mode-active .border-white\\/20,
body.light-mode-active .border-white\\/30,
body.light-mode-active .border-zinc-800 { 
  border-color: rgba(0,0,0,0.06) !important; 
}

/* Background Overrides for interactive/nested cards */
body.light-mode-active .bg-white\\/5,
body.light-mode-active .bg-white\\/8 { background-color: rgba(0,0,0,0.02) !important; }
body.light-mode-active .bg-white\\/10,
body.light-mode-active .bg-white\\/15 { background-color: #ffffff !important; box-shadow: 0 2px 8px rgba(0,0,0,0.03) !important; border: 1px solid rgba(0,0,0,0.04) !important; }
body.light-mode-active .bg-white\\/20,
body.light-mode-active .bg-white\\/30 { background-color: rgba(0,0,0,0.06) !important; }

/* Invert zinc backgrounds */
body.light-mode-active .bg-zinc-800,
body.light-mode-active .bg-zinc-900,
body.light-mode-active .bg-zinc-950 { background-color: #ffffff !important; border: 1px solid rgba(0,0,0,0.05) !important; }
body.light-mode-active .bg-black { background-color: #f5f5f7 !important; }

/* Shadows */
body.light-mode-active .shadow-2xl { box-shadow: 0 20px 40px rgba(0,0,0,0.06) !important; }
body.light-mode-active .shadow-xl { box-shadow: 0 10px 20px rgba(0,0,0,0.04) !important; }
body.light-mode-active .shadow-lg { box-shadow: 0 4px 12px rgba(0,0,0,0.03) !important; }

/* Primary Colors in Light Mode - keep them bright but accessible */
body.light-mode-active .text-primary-400,
body.light-mode-active .text-primary-500 { color: var(--color-primary-600) !important; }
body.light-mode-active .border-primary-500,
body.light-mode-active .border-primary-400,
body.light-mode-active .border-primary-500\\/30,
body.light-mode-active .border-primary-500\\/40 { border-color: var(--color-primary-400) !important; }
body.light-mode-active .bg-primary-500\\/10 { background-color: var(--color-primary-50) !important; }
body.light-mode-active .bg-primary-500\\/20 { background-color: var(--color-primary-100) !important; }
body.light-mode-active .bg-primary-500\\/30 { background-color: var(--color-primary-200) !important; }

/* Remove any dark mode text overrides in light mode */
body:not(.light-mode-active) .text-white {
  color: var(--text-main, #ffffff) !important;
}
`;

css += appleLight;
fs.writeFileSync('src/index.css', css);
