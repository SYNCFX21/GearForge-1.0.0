const fs = require('fs');

// PremiumFeaturesProposal
let pfp = fs.readFileSync('src/components/PremiumFeaturesProposal.tsx', 'utf-8');
pfp = pfp.replace(
  'bg-gradient-to-r from-primary-950/40 via-purple-950/30 to-zinc-900/80',
  'bg-gradient-to-br from-[var(--card-bg)] to-[var(--app-bg)]'
);
fs.writeFileSync('src/components/PremiumFeaturesProposal.tsx', pfp);

// AdminPanelModal
let apm = fs.readFileSync('src/components/AdminPanelModal.tsx', 'utf-8');
apm = apm.replace(
  'bg-gradient-to-r from-zinc-900 via-zinc-950 to-zinc-900',
  'bg-[var(--card-bg)]'
);
fs.writeFileSync('src/components/AdminPanelModal.tsx', apm);

// RulesModal
let rm = fs.readFileSync('src/components/RulesModal.tsx', 'utf-8');
rm = rm.replace(
  'bg-gradient-to-br from-[var(--theme-color)]/20 to-zinc-900',
  'bg-gradient-to-br from-primary-500/10 to-[var(--card-bg)]'
);
fs.writeFileSync('src/components/RulesModal.tsx', rm);

// UserProfileModal
let upm = fs.readFileSync('src/components/UserProfileModal.tsx', 'utf-8');
upm = upm.replace(
  'bg-gradient-to-r from-zinc-900 to-black',
  'bg-[var(--card-bg)]'
);
fs.writeFileSync('src/components/UserProfileModal.tsx', upm);

// App.tsx
let app = fs.readFileSync('src/App.tsx', 'utf-8');
app = app.replace(
  'bg-gradient-to-r from-zinc-900 via-blue-950/40 to-zinc-900',
  'bg-gradient-to-r from-[var(--card-bg)] via-primary-500/10 to-[var(--card-bg)]'
);
fs.writeFileSync('src/App.tsx', app);

console.log("Done");
