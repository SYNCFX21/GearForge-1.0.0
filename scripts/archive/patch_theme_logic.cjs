const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

// 1. Import ThemeEditorModal
if (!code.includes("import ThemeEditorModal")) {
  code = code.replace(
    "import ThreeBackground, { BACKGROUND_THEMES } from './components/ThreeBackground';",
    "import ThreeBackground, { BACKGROUND_THEMES } from './components/ThreeBackground';\nimport ThemeEditorModal, { CustomTheme } from './components/ThemeEditorModal';"
  );
}

// 2. Replace themeIndex state with activeThemeId and add customThemes state
code = code.replace(
  'const [themeIndex, setThemeIndex] = useState<number>(() => parseInt(localStorage.getItem("gf_theme_idx") || "0"));',
  `const [activeThemeId, setActiveThemeId] = useState<string>(() => localStorage.getItem("gf_active_theme_id") || "classic_cyan");
  const [customThemes, setCustomThemes] = useState<CustomTheme[]>(() => {
    try {
      const saved = localStorage.getItem("gf_custom_themes");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isThemeEditorOpen, setIsThemeEditorOpen] = useState<boolean>(false);`
);

// 3. Update useEffect for theme colors
code = code.replace(
  /const theme = BACKGROUND_THEMES\[themeIndex\] \|\| BACKGROUND_THEMES\[0\];/g,
  `const theme = [...BACKGROUND_THEMES, ...customThemes].find(t => t.id === activeThemeId) || BACKGROUND_THEMES[0];`
);
code = code.replace(
  /}, \[themeIndex, isDarkMode\]\);/g,
  `}, [activeThemeId, customThemes, isDarkMode]);`
);

// 4. Replace the old Theme Selector <select> with a button to open the modal
const oldSelector = `                  {/* Theme Selector */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                      <Palette className="w-4 h-4 text-primary-400" />
                      App Theme
                    </label>
                    <select
                      value={themeIndex}
                      onChange={(e) => {
                        const newIdx = parseInt(e.target.value);
                        setThemeIndex(newIdx);
                        localStorage.setItem("gf_theme_idx", newIdx.toString());
                      }}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-primary-400 transition"
                    >
                      {BACKGROUND_THEMES.map((t, idx) => (
                        <option key={t.id} value={idx} className="bg-zinc-900 text-white">
                          {t.name}
                        </option>
                      ))}
                    </select>
                  </div>`;

const newSelector = `                  {/* Theme Selector */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                      <Palette className="w-4 h-4 text-primary-400" />
                      App Theme
                    </label>
                    <button
                      onClick={() => {
                        setIsHamburgerOpen(false);
                        setIsThemeEditorOpen(true);
                      }}
                      className="w-full bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl py-3 px-4 text-sm text-white transition flex items-center justify-between cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded-full border border-white/20 shadow-sm"
                          style={{ backgroundColor: [...BACKGROUND_THEMES, ...customThemes].find(t => t.id === activeThemeId)?.color || BACKGROUND_THEMES[0].color }}
                        />
                        <span className="font-bold">{[...BACKGROUND_THEMES, ...customThemes].find(t => t.id === activeThemeId)?.name || 'Theme'}</span>
                      </div>
                      <span className="text-xs text-primary-400 bg-primary-500/10 px-2 py-1 rounded-md font-bold uppercase tracking-wide">Edit</span>
                    </button>
                  </div>`;
                  
code = code.replace(oldSelector, newSelector);

// 5. Inject the <ThemeEditorModal /> at the bottom
code = code.replace(
  '        {/* Slide-Over Hamburger Drawer for PC, Tablet & Mobile */}',
  `        <ThemeEditorModal
          isOpen={isThemeEditorOpen}
          onClose={() => setIsThemeEditorOpen(false)}
          customThemes={customThemes}
          currentThemeId={activeThemeId}
          onSaveTheme={(theme) => {
            const updated = [...customThemes, theme];
            setCustomThemes(updated);
            localStorage.setItem("gf_custom_themes", JSON.stringify(updated));
            setActiveThemeId(theme.id);
            localStorage.setItem("gf_active_theme_id", theme.id);
          }}
          onDeleteTheme={(id) => {
            const updated = customThemes.filter(t => t.id !== id);
            setCustomThemes(updated);
            localStorage.setItem("gf_custom_themes", JSON.stringify(updated));
            if (activeThemeId === id) {
              setActiveThemeId(BACKGROUND_THEMES[0].id);
              localStorage.setItem("gf_active_theme_id", BACKGROUND_THEMES[0].id);
            }
          }}
          onSelectTheme={(theme) => {
            setActiveThemeId(theme.id);
            localStorage.setItem("gf_active_theme_id", theme.id);
          }}
        />\n\n        {/* Slide-Over Hamburger Drawer for PC, Tablet & Mobile */}`
);

fs.writeFileSync('src/App.tsx', code);
