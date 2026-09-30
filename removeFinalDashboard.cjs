const fs = require('fs');
let file = 'src/pages/marketing/AnchorMarketingSite.tsx';
let content = fs.readFileSync(file, 'utf8');
content = content.replace(/function AnchorDashboardMontage\(\) \{[\s\S]*?\}\n\n/m, '');
content = content.replace(/function AnchorDashboardMontage\(\) \{[\s\S]*?\}\n/m, '');
fs.writeFileSync(file, content, 'utf8');
