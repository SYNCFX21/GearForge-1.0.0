const fs = require('fs');
let css = fs.readFileSync('src/index.css', 'utf-8');

// Replace the light mode block with a much cleaner Apple-inspired one
const newLightMode = `
body.light-mode-active {
  --app-bg: #f5f5f7;
  --card-bg: #ffffff;
  --text-main: #1d1d1f;
  color: var(--text-main);
  background-color: var(--app-bg);
}

/* Apple Light Mode Overrides */
body.light-mode-active .text-white { color: #1d1d1f !important; }
body.light-mode-active .text-zinc-100,
body.light-mode-active .text-zinc-200,
body.light-mode-active .text-zinc-300,
body.light-mode-active .text-zinc-400 { color: #86868b !important; }
body.light-mode-active .text-zinc-500 { color: #a1a1a6 !important; }

/* Subtle borders for cards */
body.light-mode-active .border-white\\/5,
body.light-mode-active .border-white\\/8,
body.light-mode-active .border-white\\/10,
body.light-mode-active .border-white\\/15,
body.light-mode-active .border-white\\/20,
body.light-mode-active .border-white\\/30,
body.light-mode-active .border-zinc-800 { 
  border-color: #d2d2d7 !important; 
}

/* Subtle backgrounds for interactive elements */
body.light-mode-active .bg-white\\/5,
body.light-mode-active .bg-white\\/8 { background-color: rgba(0,0,0,0.02) !important; }
body.light-mode-active .bg-white\\/10,
body.light-mode-active .bg-white\\/15 { background-color: rgba(0,0,0,0.04) !important; }
body.light-mode-active .bg-white\\/20,
body.light-mode-active .bg-white\\/30 { background-color: rgba(0,0,0,0.08) !important; }

/* Invert zinc backgrounds */
body.light-mode-active .bg-zinc-800,
body.light-mode-active .bg-zinc-900,
body.light-mode-active .bg-zinc-950 { background-color: #ffffff !important; }
body.light-mode-active .bg-black { background-color: #f5f5f7 !important; }

/* Primary Colors in Light Mode - keep them bright but accessible */
body.light-mode-active .text-primary-400,
body.light-mode-active .text-primary-500 { color: var(--color-primary-600) !important; }
body.light-mode-active .border-primary-500,
body.light-mode-active .border-primary-400 { border-color: var(--color-primary-500) !important; }
body.light-mode-active .bg-primary-500\\/10 { background-color: var(--color-primary-100) !important; }
body.light-mode-active .bg-primary-500\\/20 { background-color: var(--color-primary-200) !important; }

/* Keep images normal */
body.light-mode-active img,
body.light-mode-active canvas,
body.light-mode-active video {
  /* no filter needed */
}
`;

css = css.replace(/body\.light-mode-active\s*\{[\s\S]*?(?=body:not\(\.light-mode-active\))/, newLightMode);
fs.writeFileSync('src/index.css', css);
