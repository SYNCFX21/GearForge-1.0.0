const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

const themeSelectorCode = `
                  {/* Theme Selector */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                      <Palette className="w-4 h-4 text-[var(--color-brand-cyan)]" />
                      App Theme
                    </label>
                    <select
                      value={themeIndex}
                      onChange={(e) => {
                        const newIdx = parseInt(e.target.value);
                        setThemeIndex(newIdx);
                        localStorage.setItem("gf_theme_idx", newIdx.toString());
                      }}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-amber-400 transition"
                    >
                      {BACKGROUND_THEMES.map((t, idx) => (
                        <option key={t.id} value={idx} className="bg-zinc-900 text-white">
                          {t.name}
                        </option>
                      ))}
                    </select>
                  </div>
`;

code = code.replace(
  '{/* Admin Panel Access */}',
  themeSelectorCode + '\n                      {/* Admin Panel Access */}'
);

fs.writeFileSync('src/App.tsx', code);
