const fs = require('fs');

// 1. Update ThemeEditorModal.tsx to support more colors
let modalCode = fs.readFileSync('src/components/ThemeEditorModal.tsx', 'utf-8');

// Add new properties to CustomTheme interface
modalCode = modalCode.replace(
  '  color: string;\n}',
  '  color: string;\n  bgColor?: string;\n  cardColor?: string;\n}'
);

// Add state for new colors
modalCode = modalCode.replace(
  "const [newThemeColor, setNewThemeColor] = useState('#00f2ff');",
  "const [newThemeColor, setNewThemeColor] = useState('#00f2ff');\n  const [newBgColor, setNewBgColor] = useState('#050505');\n  const [newCardColor, setNewCardColor] = useState('#09090b');" // zinc-950
);

// Update save payload
modalCode = modalCode.replace(
  "color: newThemeColor",
  "color: newThemeColor,\n      bgColor: newBgColor,\n      cardColor: newCardColor"
);

// Add UI for new colors
const newColorUI = `
                  <div>
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-2">App Background Color</label>
                    <div className="flex gap-4">
                      <input
                        type="color"
                        value={newBgColor}
                        onChange={(e) => setNewBgColor(e.target.value)}
                        className="w-14 h-14 rounded-xl cursor-pointer bg-transparent border-0 p-0"
                      />
                      <input
                        type="text"
                        value={newBgColor}
                        onChange={(e) => setNewBgColor(e.target.value)}
                        className="flex-1 bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-primary-500 transition font-mono uppercase"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-2">Card/Panel Background</label>
                    <div className="flex gap-4">
                      <input
                        type="color"
                        value={newCardColor}
                        onChange={(e) => setNewCardColor(e.target.value)}
                        className="w-14 h-14 rounded-xl cursor-pointer bg-transparent border-0 p-0"
                      />
                      <input
                        type="text"
                        value={newCardColor}
                        onChange={(e) => setNewCardColor(e.target.value)}
                        className="flex-1 bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-primary-500 transition font-mono uppercase"
                      />
                    </div>
                  </div>
`;
modalCode = modalCode.replace(
  "<div>\n                    <label className=\"text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-2\">Quick Palettes</label>",
  newColorUI + "\n                  <div>\n                    <label className=\"text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-2\">Quick Palettes</label>"
);

fs.writeFileSync('src/components/ThemeEditorModal.tsx', modalCode);

// 2. Update index.css to use variables for backgrounds
let css = fs.readFileSync('src/index.css', 'utf-8');
css = css.replace('@theme {', '@theme {\n  --app-bg: #050505;\n  --card-bg: #09090b;\n');
css = css.replace('background-color: #050505;', 'background-color: var(--app-bg);');

fs.writeFileSync('src/index.css', css);

// 3. Update App.tsx to apply these new variables
let appCode = fs.readFileSync('src/App.tsx', 'utf-8');
appCode = appCode.replace(
  "root.style.setProperty('--theme-color', theme.color);",
  "root.style.setProperty('--theme-color', theme.color);\n    root.style.setProperty('--app-bg', theme.bgColor || '#050505');\n    root.style.setProperty('--card-bg', theme.cardColor || '#09090b');"
);

// We should also replace some bg-zinc-950 with bg-[var(--card-bg)]
appCode = appCode.replace(/bg-zinc-950/g, 'bg-[var(--card-bg)]');
fs.writeFileSync('src/App.tsx', appCode);

