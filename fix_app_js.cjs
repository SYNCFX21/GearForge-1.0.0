const fs = require('fs');
let app = fs.readFileSync('src/App.tsx', 'utf-8');

app = app.replace("root.style.setProperty('--theme-color'", "document.body.style.setProperty('--theme-color'");
app = app.replace("root.style.setProperty('--app-bg'", "document.body.style.setProperty('--app-bg'");
app = app.replace("root.style.setProperty('--card-bg'", "document.body.style.setProperty('--card-bg'");

fs.writeFileSync('src/App.tsx', app);
