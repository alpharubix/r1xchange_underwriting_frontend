const fs = require('fs');

let file1 = 'src/pages/marketing/MarketingSite.tsx';
let content1 = fs.readFileSync(file1, 'utf8');
content1 = content1.replace(/const handleClick = \(e\) => \{/g, 'const handleClick = (e: React.MouseEvent) => {');
fs.writeFileSync(file1, content1, 'utf8');

let file2 = 'src/pages/marketing/AnchorMarketingSite.tsx';
let content2 = fs.readFileSync(file2, 'utf8');
content2 = content2.replace(/const handleClick = \(e\) => \{/g, 'const handleClick = (e: React.MouseEvent) => {');
fs.writeFileSync(file2, content2, 'utf8');

console.log("Fixed TypeScript error for e: React.MouseEvent");
