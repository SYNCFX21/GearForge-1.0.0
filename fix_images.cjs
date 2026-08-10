const fs = require('fs');

let accessories = fs.readFileSync('src/data/accessories.ts', 'utf8');
accessories = accessories.replace(
  /https:\/\/images\.unsplash\.com\/photo-1527814050087-179f061e389e\?auto=format&fit=crop&w=400&q=80/g,
  'https://images.unsplash.com/photo-1605773527852-c546a8584ea3?auto=format&fit=crop&w=400&q=80'
);
accessories = accessories.replace(
  /https:\/\/images\.unsplash\.com\/photo-1608223652636-f1165dc80324\?auto=format&fit=crop&w=400&q=80/g,
  'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=400&q=80'
);
fs.writeFileSync('src/data/accessories.ts', accessories);

let customPlanner = fs.readFileSync('src/components/CustomLoadoutPlanner.tsx', 'utf8');
customPlanner = customPlanner.replace(
  /https:\/\/images\.unsplash\.com\/photo-1527814050087-179f061e389e\?auto=format&fit=crop&w=400&q=80/g,
  'https://images.unsplash.com/photo-1605773527852-c546a8584ea3?auto=format&fit=crop&w=400&q=80'
);
customPlanner = customPlanner.replace(
  /https:\/\/images\.unsplash\.com\/photo-1608223652636-f1165dc80324\?auto=format&fit=crop&w=400&q=80/g,
  'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=400&q=80'
);
fs.writeFileSync('src/components/CustomLoadoutPlanner.tsx', customPlanner);
