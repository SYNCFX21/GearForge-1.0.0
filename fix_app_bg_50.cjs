const fs = require('fs');
let css = fs.readFileSync('src/index.css', 'utf-8');

css = css.replace(
  'body.light-mode-active .bg-\\[var\\(--app-bg\\)\\]\\/85 {',
  'body.light-mode-active .bg-\\[var\\(--app-bg\\)\\]\\/85,\nbody.light-mode-active .bg-\\[var\\(--app-bg\\)\\]\\/50 {'
);

fs.writeFileSync('src/index.css', css);
