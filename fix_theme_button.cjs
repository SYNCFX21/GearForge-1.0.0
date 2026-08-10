const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

code = code.replace(
  '<span className="text-xs text-primary-400 bg-primary-500/10 px-2 py-1 rounded-md font-bold uppercase tracking-wide">Edit</span>',
  '<span className="text-xs text-primary-400 bg-primary-500/10 px-2 py-1 rounded-md font-bold uppercase tracking-wide whitespace-nowrap">Create / Edit Theme</span>'
);

fs.writeFileSync('src/App.tsx', code);
