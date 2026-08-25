import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, Trash2, Check, Palette, Sliders } from 'lucide-react';
import { BACKGROUND_THEMES } from './ThreeBackground';

export interface CustomTheme {
  id: string;
  name: string;
  color: string;
  bgColor?: string;
  cardColor?: string;
  textColor?: string;
}

interface ThemeEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  customThemes: CustomTheme[];
  onSaveTheme: (theme: CustomTheme) => void;
  onDeleteTheme: (id: string) => void;
  onSelectTheme: (theme: any) => void;
  currentThemeId: string;
}

const PRESET_PALETTES = [
  '#00f2ff', '#ff0033', '#00ff33', '#aa00ff', '#ffcc00', 
  '#ff00ff', '#ffffff', '#ff5500', '#111111', '#00ffaa'
];

/**
 * ThemeEditorModal Component
 * Interactive visual theme customizer and palette switcher.
 * Allows users to choose from built-in cyber presets or create, preview,
 * save, and delete custom accent and background themes.
 * 
 * @whereUsed
 * - `src/App.tsx` (opened when user clicks the theme/palette button in the navigation header)
 */
export default function ThemeEditorModal({ 
  isOpen, onClose, customThemes, onSaveTheme, onDeleteTheme, onSelectTheme, currentThemeId 
}: ThemeEditorModalProps) {
  const [activeTab, setActiveTab] = useState<'presets' | 'custom'>('presets');
  const [newThemeName, setNewThemeName] = useState('My Custom Theme');
  const [newThemeColor, setNewThemeColor] = useState('#00f2ff');
  const [newBgColor, setNewBgColor] = useState('#050505');
  const [newCardColor, setNewCardColor] = useState('#09090b');
  const [newTextColor, setNewTextColor] = useState('#ffffff');

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveTheme({
      id: 'custom_' + Date.now(),
      name: newThemeName,
      color: newThemeColor,
      bgColor: newBgColor,
      cardColor: newCardColor,
      textColor: newTextColor
    });
    setNewThemeName('My Custom Theme');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-[var(--app-bg)]/80 backdrop-blur-sm"
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-2xl bg-[var(--card-bg)] border border-primary-500/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
      >
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary-500/20 text-primary-400">
              <Palette className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white">Theme Creator</h2>
              <p className="text-xs text-zinc-400">Customize your GearForge experience</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition text-zinc-400 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex border-b border-white/10">
          <button
            onClick={() => setActiveTab('presets')}
            className={`flex-1 py-4 text-sm font-bold uppercase tracking-wider transition border-b-2 ${
              activeTab === 'presets' ? 'border-primary-500 text-primary-400 bg-primary-500/5' : 'border-transparent text-zinc-400 hover:text-zinc-300 hover:bg-white/5'
            }`}
          >
            Presets
          </button>
          <button
            onClick={() => setActiveTab('custom')}
            className={`flex-1 py-4 text-sm font-bold uppercase tracking-wider transition border-b-2 ${
              activeTab === 'custom' ? 'border-primary-500 text-primary-400 bg-primary-500/5' : 'border-transparent text-zinc-400 hover:text-zinc-300 hover:bg-white/5'
            }`}
          >
            Custom Themes
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'presets' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {BACKGROUND_THEMES.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => onSelectTheme(theme)}
                  className={`flex items-center gap-4 p-4 rounded-2xl border transition-all cursor-pointer text-left ${
                    currentThemeId === theme.id 
                      ? 'bg-primary-500/10 border-primary-500' 
                      : 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10'
                  }`}
                >
                  <div 
                    className="w-8 h-8 rounded-full shadow-lg shrink-0 border border-white/20"
                    style={{ backgroundColor: theme.color, boxShadow: `0 0 15px ${theme.color}40` }}
                  />
                  <div className="flex-1">
                    <div className="font-bold text-white">{theme.name}</div>
                    <div className="text-xs text-zinc-400">{theme.color}</div>
                  </div>
                  {currentThemeId === theme.id && (
                    <Check className="w-5 h-5 text-primary-500" />
                  )}
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-8">
              <div className="bg-white/5 border border-white/10 p-5 rounded-2xl space-y-5">
                <h3 className="font-bold text-white flex items-center gap-2">
                  <Plus className="w-4 h-4 text-primary-400" />
                  Create New Theme
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-2">Theme Name</label>
                    <input
                      type="text"
                      value={newThemeName}
                      onChange={(e) => setNewThemeName(e.target.value)}
                      className="w-full bg-[var(--app-bg)]/40 border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-primary-500 transition"
                      placeholder="My Awesome Theme"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-2">Primary Color (Buttons, UI Elements)</label>
                    <div className="flex gap-4">
                      <input
                        type="color"
                        value={newThemeColor}
                        onChange={(e) => setNewThemeColor(e.target.value)}
                        className="w-14 h-14 rounded-xl cursor-pointer bg-transparent border-0 p-0"
                      />
                      <input
                        type="text"
                        value={newThemeColor}
                        onChange={(e) => setNewThemeColor(e.target.value)}
                        className="flex-1 bg-[var(--app-bg)]/40 border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-primary-500 transition font-mono uppercase"
                      />
                    </div>
                  </div>

                  
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
                        className="flex-1 bg-[var(--app-bg)]/40 border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-primary-500 transition font-mono uppercase"
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
                        className="flex-1 bg-[var(--app-bg)]/40 border border-white/10 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-primary-500 transition font-mono uppercase"
                      />
                    </div>
                  </div>

                  
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

                  <div>
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-2">Quick Palettes</label>
                    <div className="flex flex-wrap gap-2">
                      {PRESET_PALETTES.map((color) => (
                        <button
                          key={color}
                          onClick={() => setNewThemeColor(color)}
                          className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 cursor-pointer ${
                            newThemeColor.toLowerCase() === color ? 'border-white scale-110' : 'border-transparent'
                          }`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={handleSave}
                    className="w-full py-3 bg-primary-500 text-black font-bold rounded-xl hover:bg-primary-400 transition cursor-pointer"
                  >
                    Save & Apply Custom Theme
                  </button>
                </div>
              </div>

              {customThemes.length > 0 && (
                <div className="space-y-4">
                  <h3 className="font-bold text-white flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-primary-400" />
                    Saved Custom Themes
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {customThemes.map((theme) => (
                      <div
                        key={theme.id}
                        className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${
                          currentThemeId === theme.id 
                            ? 'bg-primary-500/10 border-primary-500' 
                            : 'bg-white/5 border-white/10'
                        }`}
                      >
                        <button
                          onClick={() => onSelectTheme(theme)}
                          className="flex-1 flex items-center gap-3 text-left cursor-pointer group"
                        >
                          <div 
                            className="w-8 h-8 rounded-full shadow-lg shrink-0 border border-white/20 group-hover:scale-110 transition"
                            style={{ backgroundColor: theme.color, boxShadow: `0 0 15px ${theme.color}40` }}
                          />
                          <div>
                            <div className="font-bold text-white group-hover:text-primary-400 transition">{theme.name}</div>
                            <div className="text-xs text-zinc-400">{theme.color}</div>
                          </div>
                        </button>
                        {currentThemeId === theme.id && (
                          <Check className="w-5 h-5 text-primary-500 shrink-0" />
                        )}
                        <button
                          onClick={() => onDeleteTheme(theme.id)}
                          className="p-2 text-zinc-500 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition cursor-pointer shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
