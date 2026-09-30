const fs = require('fs');
let file = 'src/pages/marketing/AnchorMarketingSite.tsx';
let content = fs.readFileSync(file, 'utf8');
content = content.replace(/const handleClick = \(e\) => \{/g, 'const handleClick = (e: React.MouseEvent) => {');
fs.writeFileSync(file, content, 'utf8');
