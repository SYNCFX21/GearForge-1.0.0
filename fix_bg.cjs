const fs = require('fs');
let css = fs.readFileSync('src/index.css', 'utf-8');

// Remove the radial gradient from the body
css = css.replace(/background-image:[^]*?transparent 60%\);/, '');
fs.writeFileSync('src/index.css', css);
