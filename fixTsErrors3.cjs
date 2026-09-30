const fs = require('fs');

let file1 = 'src/components/InteractiveWalletMontage.tsx';
let content1 = fs.readFileSync(file1, 'utf8');
content1 = content1.replace("import React, { useState, useEffect } from 'react';", "import { useState } from 'react';");
content1 = content1.replace("import { Wallet, X, CheckCircle2, ChevronRight, History, CreditCard, Activity, ArrowRight, ShieldCheck, PieChart, FileText, Database } from 'lucide-react';", "import { Wallet, X, CheckCircle2, History, Activity, ArrowRight, ShieldCheck, PieChart, FileText, Database } from 'lucide-react';");
fs.writeFileSync(file1, content1, 'utf8');

let file2 = 'src/pages/marketing/AnchorMarketingSite.tsx';
let content2 = fs.readFileSync(file2, 'utf8');
content2 = content2.replace(/function WalletMontage\(\) \{[\s\S]*?\}\n\n/m, '');
content2 = content2.replace("const hoverTimer = useRef<NodeJS.Timeout | null>(null);", "const hoverTimer = useRef<number | null>(null);");
fs.writeFileSync(file2, content2, 'utf8');

let file3 = 'src/pages/marketing/MarketingSite.tsx';
let content3 = fs.readFileSync(file3, 'utf8');
content3 = content3.replace("const hoverTimer = useRef<NodeJS.Timeout | null>(null);", "const hoverTimer = useRef<number | null>(null);");
// also fix setTimeout cast
content3 = content3.replace("hoverTimer.current = setTimeout", "hoverTimer.current = window.setTimeout");
fs.writeFileSync(file3, content3, 'utf8');

content2 = fs.readFileSync(file2, 'utf8');
content2 = content2.replace("hoverTimer.current = setTimeout", "hoverTimer.current = window.setTimeout");
fs.writeFileSync(file2, content2, 'utf8');

console.log("Fixed TS Errors");
