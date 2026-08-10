const fs = require('fs');
let modalCode = fs.readFileSync('src/components/ThemeEditorModal.tsx', 'utf-8');

// Add textColor to interface
modalCode = modalCode.replace(
  '  cardColor?: string;\n}',
  '  cardColor?: string;\n  textColor?: string;\n}'
);

// Add state for textColor
modalCode = modalCode.replace(
  "const [newCardColor, setNewCardColor] = useState('#09090b');",
  "const [newCardColor, setNewCardColor] = useState('#09090b');\n  const [newTextColor, setNewTextColor] = useState('#ffffff');"
);

// Update save payload
modalCode = modalCode.replace(
  "cardColor: newCardColor",
  "cardColor: newCardColor,\n      textColor: newTextColor"
);

// Add UI for Text Color
const textColorUI = `
                  <div>
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-2">Main Text Color</label>
                    <div className="flex gap-4">
                      <input
                        type="color"
                        value={newTextColor}
                        onChange={(e) => setNewTextColor(e.target.value)}
                        className="w-14 h-14 rounded-xl cursor-pointer bg-transparent border-0 p-0"
                      />
                      <input
                        type="text"
                        value={newTextColor}
                        onChange={(e) => setNewTextColor(e.target.value)}
                        className="flex-1 bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-primary-500 transition font-mono uppercase"
                      />
                    </div>
                  </div>
`;
modalCode = modalCode.replace(
  "<div>\n                    <label className=\"text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-2\">Quick Palettes</label>",
  textColorUI + "\n                  <div>\n                    <label className=\"text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-2\">Quick Palettes</label>"
);

fs.writeFileSync('src/components/ThemeEditorModal.tsx', modalCode);

// Update App.tsx to apply text color
let appCode = fs.readFileSync('src/App.tsx', 'utf-8');
appCode = appCode.replace(
  "document.body.style.setProperty('--card-bg', theme.cardColor || '#09090b');",
  "document.body.style.setProperty('--card-bg', theme.cardColor || '#09090b');\n    document.body.style.setProperty('--text-main', theme.textColor || '#ffffff');"
);
fs.writeFileSync('src/App.tsx', appCode);

// Update index.css to use --text-main
let css = fs.readFileSync('src/index.css', 'utf-8');
css = css.replace(/color: #f5f5f7;/g, 'color: var(--text-main, #ffffff);');
css = css.replace(/--text-main: #0f172a;/g, '');
css = css.replace(/color: #0f172a;/g, 'color: var(--text-main, #0f172a);');
fs.writeFileSync('src/index.css', css);

