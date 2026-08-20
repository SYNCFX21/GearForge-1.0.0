const fs = require('fs');

const file = fs.readFileSync('src/data/catalog.ts', 'utf8');
const images = {
  mouse: 'https://images.unsplash.com/photo-1527814050087-179f061e389e?auto=format&fit=crop&w=400&q=80',
  keyboard: 'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=400&q=80',
  headset: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=400&q=80',
  mousepad: 'https://images.unsplash.com/photo-1616423640778-28d1b53229bd?auto=format&fit=crop&w=400&q=80',
  mic: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=400&q=80',
  monitor: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=400&q=80',
  controller: 'https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?auto=format&fit=crop&w=400&q=80',
  speakers: 'https://images.unsplash.com/photo-1608223652636-f1165dc80324?auto=format&fit=crop&w=400&q=80'
};

const regex = /category:\s*'([^']+)'/g;
let match;
let res = file;

while ((match = regex.exec(file)) !== null) {
  const cat = match[1];
  const url = images[cat];
  if (url) {
    // Add imageUrl: '...', after category: '...'
    const searchString = match[0];
    res = res.replace(searchString, `${searchString},\n    imageUrl: '${url}'`);
  }
}

fs.writeFileSync('src/data/catalog.ts', res);
