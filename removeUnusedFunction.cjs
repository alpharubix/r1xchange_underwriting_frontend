const fs = require('fs');
let file = 'src/pages/marketing/AnchorMarketingSite.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/function WalletMontage\(\) \{[\s\S]*?\}\n\n/m, '');

fs.writeFileSync(file, content, 'utf8');
console.log("Removed WalletMontage function definition");
