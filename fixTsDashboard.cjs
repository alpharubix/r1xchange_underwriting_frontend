const fs = require('fs');

let file1 = 'src/components/InteractiveAnchorDashboardMontage.tsx';
let content1 = fs.readFileSync(file1, 'utf8');
content1 = content1.replace("import { Smartphone, Eye, X, CheckCircle2 } from 'lucide-react';", "import { Smartphone, Eye, CheckCircle2 } from 'lucide-react';");
fs.writeFileSync(file1, content1, 'utf8');

let file2 = 'src/pages/marketing/AnchorMarketingSite.tsx';
let content2 = fs.readFileSync(file2, 'utf8');
content2 = content2.replace(/function AnchorDashboardMontage\(\) \{[\s\S]*?\}\n\n/m, '');
fs.writeFileSync(file2, content2, 'utf8');

console.log("Fixed TS errors");
