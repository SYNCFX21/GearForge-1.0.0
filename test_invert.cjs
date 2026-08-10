const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

// Insert light mode state and toggle
code = code.replace(
  'const [themeIndex, setThemeIndex] = useState<number>(() => parseInt(localStorage.getItem("gf_theme_idx") || "0"));',
  'const [themeIndex, setThemeIndex] = useState<number>(() => parseInt(localStorage.getItem("gf_theme_idx") || "0"));\n  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => localStorage.getItem("gf_dark_mode") !== "false");\n  useEffect(() => { localStorage.setItem("gf_dark_mode", isDarkMode.toString()); }, [isDarkMode]);'
);

// Add the Moon/Sun icon import if not there
if (!code.includes('Moon')) {
  code = code.replace('Palette,', 'Palette,\n  Moon,\n  Sun,');
}

// Add the toggle button next to the theme selector
const toggleHtml = `
                  <div className="space-y-2 pt-2 border-t border-white/10 mt-4">
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2 pt-2">
                      {isDarkMode ? <Moon className="w-4 h-4 text-[var(--color-brand-cyan)]" /> : <Sun className="w-4 h-4 text-[var(--color-brand-cyan)]" />}
                      Appearance
                    </label>
                    <button
                      onClick={() => setIsDarkMode(!isDarkMode)}
                      className="w-full bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl py-3 px-4 text-sm text-white transition flex items-center justify-between cursor-pointer"
                    >
                      <span>{isDarkMode ? 'Dark Mode' : 'Light Mode'}</span>
                      <div className={\`w-10 h-5 rounded-full p-1 transition \${isDarkMode ? 'bg-[var(--color-brand-cyan)]' : 'bg-zinc-600'}\`}>
                        <div className={\`w-3 h-3 bg-white rounded-full transition transform \${isDarkMode ? 'translate-x-5' : 'translate-x-0'}\`} />
                      </div>
                    </button>
                  </div>
`;
code = code.replace('{/* Admin Panel Access */}', toggleHtml + '\n                      {/* Admin Panel Access */}');

// Add APP_THEMES logic inside useEffect
const useEffectThemes = `
  useEffect(() => {
    const root = document.documentElement;
    // Set theme color
    // Find the theme from BACKGROUND_THEMES imported from ThreeBackground
    const theme = BACKGROUND_THEMES[themeIndex] || BACKGROUND_THEMES[0];
    root.style.setProperty('--color-brand-cyan', theme.color);
    
    if (isDarkMode) {
      document.body.classList.remove('light-mode-active');
    } else {
      document.body.classList.add('light-mode-active');
    }
  }, [themeIndex, isDarkMode]);
`;

code = code.replace(
  'const tabsContainerRef = useRef<HTMLDivElement>(null);',
  'const tabsContainerRef = useRef<HTMLDivElement>(null);\n' + useEffectThemes
);

fs.writeFileSync('src/App.tsx', code);
