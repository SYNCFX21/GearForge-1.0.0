const fs = require('fs');
let css = fs.readFileSync('src/index.css', 'utf-8');

// Ensure that var(--app-bg) and var(--card-bg) don't have hardcoded opacities if we can avoid it.
// Wait, they are just custom properties. The utilities bg-[var(--app-bg)]/50 do it automatically.
