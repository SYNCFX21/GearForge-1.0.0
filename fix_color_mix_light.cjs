const fs = require('fs');
let css = fs.readFileSync('src/index.css', 'utf-8');

const additionalCSS = `
body.light-mode-active .bg-\\[color-mix\\(in_srgb\\,var\\(--card-bg\\)_80\\%\\,white\\)\\] {
  background-color: #ffffff !important;
  box-shadow: 0 4px 24px rgba(0,0,0,0.04) !important;
  border-color: rgba(0,0,0,0.04) !important;
}
`;

css += additionalCSS;
fs.writeFileSync('src/index.css', css);
