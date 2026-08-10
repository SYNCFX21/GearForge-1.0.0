const fs = require('fs');
let css = fs.readFileSync('src/index.css', 'utf-8');

if (!css.includes('body.light-mode-active .text-primary-400')) {
  const contrastFixes = `
/* Adjust primary color contrast in light mode */
body.light-mode-active .text-primary-400,
body.light-mode-active .text-primary-500 {
  color: var(--color-primary-700) !important;
}

body.light-mode-active .border-primary-500,
body.light-mode-active .border-primary-400 {
  border-color: var(--color-primary-600) !important;
}

body.light-mode-active .bg-primary-500\\/10 {
  background-color: var(--color-primary-100) !important;
}
body.light-mode-active .bg-primary-500\\/20 {
  background-color: var(--color-primary-200) !important;
}
`;

  css += contrastFixes;
  fs.writeFileSync('src/index.css', css);
}
