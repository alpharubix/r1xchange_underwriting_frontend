const fs = require('fs');
let file = 'src/pages/marketing/AnchorMarketingSite.tsx';
let content = fs.readFileSync(file, 'utf8');

// Add import
const importStatement = "import InteractiveWalletMontage from '../../components/InteractiveWalletMontage';\n";
content = content.replace("import React, { useEffect, useState} from 'react';", "import React, { useEffect, useState} from 'react';\n" + importStatement);

// Replace <WalletMontage /> with <InteractiveWalletMontage />
content = content.replace(/<WalletMontage \/>/g, '<InteractiveWalletMontage />');

fs.writeFileSync(file, content, 'utf8');
console.log("Updated AnchorMarketingSite.tsx with InteractiveWalletMontage");
