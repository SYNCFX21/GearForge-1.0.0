const fs = require('fs');
let css = fs.readFileSync('src/index.css', 'utf-8');

// Ensure body.light-mode-active .text-white handles --text-main
if (!css.includes('body.light-mode-active .text-white { color: var(--text-main, #0f172a) !important; }')) {
  css = css.replace(
    'body.light-mode-active .text-white { color: #0f172a !important; }',
    'body.light-mode-active .text-white { color: var(--text-main, #0f172a) !important; }'
  );
}

// Add dark mode text-white
if (!css.includes('body:not(.light-mode-active) .text-white')) {
  css += `
body:not(.light-mode-active) .text-white {
  color: var(--text-main, #ffffff) !important;
}
`;
}

fs.writeFileSync('src/index.css', css);
