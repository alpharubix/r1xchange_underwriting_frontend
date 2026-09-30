const fs = require('fs');
let file = 'src/pages/marketing/MarketingSite.tsx';
let content = fs.readFileSync(file, 'utf8');

// Find and remove animate import
content = content.replace(/import\s*\{\s*animate\s*\}\s*from\s*'framer-motion';/g, '');

fs.writeFileSync(file, content, 'utf8');
console.log("Removed framer-motion animate import");
