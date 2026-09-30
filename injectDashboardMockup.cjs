const fs = require('fs');
let file = 'src/pages/marketing/AnchorMarketingSite.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Add InteractiveAnchorDashboardMontage import
content = content.replace("import InteractiveWalletMontage from '../../components/InteractiveWalletMontage';", "import InteractiveWalletMontage from '../../components/InteractiveWalletMontage';\nimport InteractiveAnchorDashboardMontage from '../../components/InteractiveAnchorDashboardMontage';");

// 2. Replace the JSX tag only
content = content.replace(/<AnchorDashboardMontage \/>/g, '<InteractiveAnchorDashboardMontage />');

// 3. Remove AnchorDashboardMontage function definition
content = content.replace(/function AnchorDashboardMontage\(\) \{[\s\S]*?\}\n\n/m, '');

fs.writeFileSync(file, content, 'utf8');
console.log("Updated AnchorMarketingSite.tsx with InteractiveAnchorDashboardMontage");
