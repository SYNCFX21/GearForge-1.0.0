const fs = require('fs');
let css = fs.readFileSync('src/index.css', 'utf-8');

if (!css.includes('.fill-primary-400')) {
  css += `\nbody.light-mode-active .fill-primary-400 { fill: var(--color-primary-600) !important; }\n`;
  fs.writeFileSync('src/index.css', css);
}
