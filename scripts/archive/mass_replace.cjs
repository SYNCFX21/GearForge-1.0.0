const fs = require('fs');
const glob = require('glob');

const files = glob.sync('src/**/*.{tsx,ts}');

// Map of colors to replace with primary
const colorsToReplace = ['blue', 'purple', 'cyan', 'rose', 'pink', 'amber', 'orange', 'indigo'];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf-8');
  let original = content;
  
  colorsToReplace.forEach(color => {
    // Replace text-color-X
    content = content.replace(new RegExp(`text-${color}-([1-9]00)`, 'g'), 'text-primary-$1');
    // Replace bg-color-X
    content = content.replace(new RegExp(`bg-${color}-([1-9]00)`, 'g'), 'bg-primary-$1');
    // Replace border-color-X
    content = content.replace(new RegExp(`border-${color}-([1-9]00)`, 'g'), 'border-primary-$1');
  });
  
  if (content !== original) {
    fs.writeFileSync(file, content);
  }
});
