const fs = require('fs');
let css = fs.readFileSync('src/index.css', 'utf-8');

const additionalCSS = `
body.light-mode-active .text-primary-300,
body.light-mode-active .text-emerald-300,
body.light-mode-active .text-emerald-400 { 
  color: var(--color-primary-700) !important; 
}
body.light-mode-active .text-white { color: #1d1d1f !important; }
body.light-mode-active .bg-primary-500\\/10 { background-color: var(--color-primary-50) !important; }
body.light-mode-active .bg-primary-500\\/20 { background-color: var(--color-primary-100) !important; }
body.light-mode-active .bg-emerald-500\\/10 { background-color: rgba(16, 185, 129, 0.1) !important; }
body.light-mode-active .bg-emerald-500\\/20 { background-color: rgba(16, 185, 129, 0.2) !important; }
body.light-mode-active .border-emerald-500\\/30 { border-color: rgba(16, 185, 129, 0.3) !important; }
`;

css += additionalCSS;
fs.writeFileSync('src/index.css', css);
