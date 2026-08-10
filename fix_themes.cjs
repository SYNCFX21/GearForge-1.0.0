const fs = require('fs');
let code = fs.readFileSync('src/components/ThreeBackground.tsx', 'utf-8');

const newThemes = `export const BACKGROUND_THEMES = [
  { id: 'classic_cyan', name: 'Classic Cyan', color: '#00f2ff', bgColor: '#050505', cardColor: '#09090b' },
  { id: 'rog_red', name: 'ROG Red', color: '#ff0033', bgColor: '#0a0000', cardColor: '#120000' },
  { id: 'razer_green', name: 'Razer Green', color: '#00ff33', bgColor: '#000800', cardColor: '#001400' },
  { id: 'amethyst_purple', name: 'Amethyst Purple', color: '#aa00ff', bgColor: '#05000a', cardColor: '#0a0014' },
  { id: 'corsair_gold', name: 'Corsair Gold', color: '#ffcc00', bgColor: '#080600', cardColor: '#120f00' },
  { id: 'cyberpunk', name: 'Cyberpunk Pink', color: '#ff00ff', bgColor: '#080008', cardColor: '#120012' },
  { id: 'monochrome', name: 'Monochrome Dark', color: '#555555', bgColor: '#050505', cardColor: '#09090b' },
  { id: 'ocean_blue', name: 'Deep Ocean', color: '#00a8ff', bgColor: '#000508', cardColor: '#001018' },
];`;

code = code.replace(/export const BACKGROUND_THEMES = \[[^]*?\];/, newThemes);
fs.writeFileSync('src/components/ThreeBackground.tsx', code);
