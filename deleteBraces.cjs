const fs = require('fs');
let file = 'src/pages/marketing/AnchorMarketingSite.tsx';
let content = fs.readFileSync(file, 'utf8');

const start = content.indexOf('function AnchorDashboardMontage() {');
if (start !== -1) {
  // find the matching closing brace
  let i = start;
  let openBraces = 0;
  let foundFirst = false;
  
  while (i < content.length) {
    if (content[i] === '{') {
      openBraces++;
      foundFirst = true;
    } else if (content[i] === '}') {
      openBraces--;
    }
    
    if (foundFirst && openBraces === 0) {
      break;
    }
    i++;
  }
  
  const end = i + 1;
  content = content.substring(0, start) + content.substring(end);
  fs.writeFileSync(file, content, 'utf8');
}

console.log("Deleted");
