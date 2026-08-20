const fs = require('fs');
let css = fs.readFileSync('src/index.css', 'utf-8');

const newLightMode = `body.light-mode-active {
  /* Override Tailwind colors for light mode - Softer, low contrast slate theme */
  --color-white: #1e293b; /* slate-800 - replaces text-white with soft dark text, and makes white/10 borders a soft dark border */
  --color-black: #ffffff; /* replaces bg-black with white */
  
  /* Map dark zinc shades to light slate shades for softer UI */
  --color-zinc-950: #f1f5f9; /* slate-100 */
  --color-zinc-900: #e2e8f0; /* slate-200 */
  --color-zinc-800: #cbd5e1; /* slate-300 */
  --color-zinc-700: #94a3b8; /* slate-400 */
  --color-zinc-500: #94a3b8; /* slate-400 */
  --color-zinc-400: #64748b; /* slate-500 */
  --color-zinc-300: #475569; /* slate-600 */
  
  --app-bg: #f8fafc; /* slate-50 */
  --card-bg: #ffffff;
  
  color: #1e293b;
  background-color: var(--app-bg);
}`;

css = css.replace(/body\.light-mode-active \{[^}]*\}/g, newLightMode);
fs.writeFileSync('src/index.css', css);
