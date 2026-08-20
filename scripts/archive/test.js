const fs = require('fs');
const file = fs.readFileSync('src/components/CustomLoadoutPlanner.tsx', 'utf8');
console.log(file.includes('imageUrl'));
