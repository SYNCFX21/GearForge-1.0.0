const fs = require('fs');
let content = fs.readFileSync('src/components/PremiumFeaturesProposal.tsx', 'utf-8');

// The main card gradient
content = content.replace(
  'bg-gradient-to-br from-[var(--card-bg)] to-[var(--app-bg)] border border-primary-500/40',
  'bg-[var(--card-bg)] border border-white/10'
);
// Sometimes it might not have matched exactly, let's just do it broadly:
content = content.replace(
  /bg-gradient-to-[a-z]+ from-\[[^\]]+\] to-\[[^\]]+\] border border-primary-500\/40/g,
  'bg-[var(--card-bg)] border border-white/10'
);

// Inner cards
content = content.replace(
  /border-primary-500\/30/g,
  'border-white/10'
);

content = content.replace(
  /border-primary-500\/50/g,
  'border-white/10'
);

// Text colors that are hard to read
content = content.replace(
  /text-primary-200/g,
  'text-zinc-400'
);

// Make the expiration date look more standard
content = content.replace(
  /text-zinc-300/g,
  'text-zinc-400'
);

fs.writeFileSync('src/components/PremiumFeaturesProposal.tsx', content);
