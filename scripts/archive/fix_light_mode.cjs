const fs = require('fs');
let css = fs.readFileSync('src/index.css', 'utf-8');

// Remove invert filters
css = css.replace(/body\.light-mode-active \{[^}]*\}/g, '');
css = css.replace(/body\.light-mode-active img,[^}]*\}/g, '');

// Add light mode overrides
const lightModeOverrides = `
body.light-mode-active {
  /* Override Tailwind colors for light mode */
  --color-white: #000000;
  --color-black: #ffffff;
  --color-zinc-400: #52525b; /* zinc-600 */
  --color-zinc-950: #f4f4f5; /* zinc-100 */
  --color-zinc-900: #e4e4e7; /* zinc-200 */
  --color-zinc-800: #d4d4d8; /* zinc-300 */
  --color-zinc-700: #a1a1aa; /* zinc-400 */
  
  --app-bg: #f8fafc; /* slate-50 */
  --card-bg: #ffffff;
  
  color: #111111;
  background-color: var(--app-bg);
}

body.light-mode-active img,
body.light-mode-active canvas,
body.light-mode-active video {
  /* no invert needed */
}
`;

css += lightModeOverrides;
fs.writeFileSync('src/index.css', css);

