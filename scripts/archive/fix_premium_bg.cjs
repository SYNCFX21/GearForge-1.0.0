const fs = require('fs');
let file = fs.readFileSync('src/components/PremiumFeaturesProposal.tsx', 'utf-8');

file = file.replace(
  'bg-gradient-to-r from-primary-950/30 via-zinc-900 to-purple-950/30',
  'bg-gradient-to-br from-[var(--card-bg)] to-[var(--app-bg)]'
);

fs.writeFileSync('src/components/PremiumFeaturesProposal.tsx', file);
