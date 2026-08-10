const fs = require('fs');
let css = fs.readFileSync('src/index.css', 'utf-8');

css = css.replace(
  'body.light-mode-active .bg-white\\/10,\nbody.light-mode-active .bg-white\\/15 { background-color: #ffffff !important; box-shadow: 0 2px 8px rgba(0,0,0,0.03) !important; border: 1px solid rgba(0,0,0,0.04) !important; }',
  'body.light-mode-active .bg-white\\/10,\nbody.light-mode-active .bg-white\\/15 { background-color: rgba(0,0,0,0.04) !important; }'
);

fs.writeFileSync('src/index.css', css);
