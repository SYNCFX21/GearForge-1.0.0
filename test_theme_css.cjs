const fs = require('fs');
let css = fs.readFileSync('src/index.css', 'utf-8');

const themeColors = `
  /* Dynamic Primary Colors */
  --theme-color: #f59e0b; /* default amber-500 */
  --color-primary-50: color-mix(in srgb, var(--theme-color) 10%, white);
  --color-primary-100: color-mix(in srgb, var(--theme-color) 20%, white);
  --color-primary-200: color-mix(in srgb, var(--theme-color) 40%, white);
  --color-primary-300: color-mix(in srgb, var(--theme-color) 60%, white);
  --color-primary-400: color-mix(in srgb, var(--theme-color) 80%, white);
  --color-primary-500: var(--theme-color);
  --color-primary-600: color-mix(in srgb, var(--theme-color) 80%, black);
  --color-primary-700: color-mix(in srgb, var(--theme-color) 60%, black);
  --color-primary-800: color-mix(in srgb, var(--theme-color) 40%, black);
  --color-primary-900: color-mix(in srgb, var(--theme-color) 20%, black);
  --color-primary-950: color-mix(in srgb, var(--theme-color) 10%, black);
`;

css = css.replace('@theme {', '@theme {\n' + themeColors);
fs.writeFileSync('src/index.css', css);

let appCode = fs.readFileSync('src/App.tsx', 'utf-8');
appCode = appCode.replace("root.style.setProperty('--color-brand-cyan', theme.color);", "root.style.setProperty('--theme-color', theme.color);");
// also fix the Sun/Moon icons color
appCode = appCode.replace(/text-\[var\(--color-brand-cyan\)\]/g, 'text-primary-500');
appCode = appCode.replace(/bg-\[var\(--color-brand-cyan\)\]/g, 'bg-primary-500');
fs.writeFileSync('src/App.tsx', appCode);

