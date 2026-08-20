const fs = require('fs');
let css = fs.readFileSync('src/index.css', 'utf-8');

// Replace the old light-mode-active block
const lightModeBlock = `
body.light-mode-active {
  --app-bg: #f8fafc;
  --card-bg: #ffffff;
  color: #0f172a;
  background-color: var(--app-bg);
}

/* Override utility classes in light mode */
body.light-mode-active .text-white { color: #0f172a !important; }
body.light-mode-active .text-zinc-100,
body.light-mode-active .text-zinc-200,
body.light-mode-active .text-zinc-300 { color: #334155 !important; }
body.light-mode-active .text-zinc-400,
body.light-mode-active .text-zinc-500 { color: #475569 !important; }

body.light-mode-active .border-white\\/5,
body.light-mode-active .border-white\\/8 { border-color: rgba(0,0,0,0.05) !important; }
body.light-mode-active .border-white\\/10,
body.light-mode-active .border-white\\/15,
body.light-mode-active .border-white\\/20,
body.light-mode-active .border-white\\/30 { border-color: rgba(0,0,0,0.1) !important; }

body.light-mode-active .bg-white\\/5,
body.light-mode-active .bg-white\\/8 { background-color: rgba(0,0,0,0.03) !important; }
body.light-mode-active .bg-white\\/10,
body.light-mode-active .bg-white\\/15 { background-color: rgba(0,0,0,0.06) !important; }
body.light-mode-active .bg-white\\/20,
body.light-mode-active .bg-white\\/30 { background-color: rgba(0,0,0,0.1) !important; }

body.light-mode-active .bg-zinc-800 { background-color: #f1f5f9 !important; }
body.light-mode-active .bg-zinc-900 { background-color: #e2e8f0 !important; }
body.light-mode-active .bg-zinc-950 { background-color: #ffffff !important; }
body.light-mode-active .bg-black { background-color: #f8fafc !important; }

/* Keep images normal */
body.light-mode-active img,
body.light-mode-active canvas,
body.light-mode-active video {
  /* no filter needed */
}
`;

css = css.replace(/body\.light-mode-active \{[^]*?(?=@|\z|$)/, lightModeBlock + '\n');
fs.writeFileSync('src/index.css', css);
