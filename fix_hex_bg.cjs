const fs = require('fs');
const glob = require('glob');

const files = glob.sync('src/**/*.{tsx,ts}');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf-8');
  let original = content;
  
  // Replace bg-[#141821] with bg-[var(--app-bg)]
  content = content.replace(/bg-\\[#141821\\]/g, 'bg-[var(--app-bg)]');
  
  // Replace bg-[#0a0a0c] with bg-[var(--card-bg)]
  content = content.replace(/bg-\\[#0a0a0c\\]/g, 'bg-[var(--card-bg)]');
  
  if (content !== original) {
    fs.writeFileSync(file, content);
  }
});

console.log("Done");
