const fs = require('fs');
let app = fs.readFileSync('src/App.tsx', 'utf-8');

app = app.replace(
  "document.documentElement.style.setProperty('--app-bg', theme.bgColor || '#050505');",
  "document.documentElement.style.setProperty('--app-bg', isDarkMode ? (theme.bgColor || '#050505') : '#f5f5f7');"
);
app = app.replace(
  "document.documentElement.style.setProperty('--card-bg', theme.cardColor || '#09090b');",
  "document.documentElement.style.setProperty('--card-bg', isDarkMode ? (theme.cardColor || '#09090b') : '#ffffff');"
);
app = app.replace(
  "document.documentElement.style.setProperty('--text-main', theme.textColor || '#ffffff');",
  "document.documentElement.style.setProperty('--text-main', isDarkMode ? (theme.textColor || '#ffffff') : '#1d1d1f');"
);

fs.writeFileSync('src/App.tsx', app);
