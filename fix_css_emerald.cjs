const fs = require('fs');
let css = fs.readFileSync('src/index.css', 'utf-8');

css = css.replace(
  'body.light-mode-active .text-primary-300,\nbody.light-mode-active .text-emerald-300,\nbody.light-mode-active .text-emerald-400 { \n  color: var(--color-primary-700) !important; \n}',
  `body.light-mode-active .text-primary-300 { color: var(--color-primary-700) !important; }
body.light-mode-active .text-emerald-300,
body.light-mode-active .text-emerald-400 { color: #059669 !important; }`
);

fs.writeFileSync('src/index.css', css);
