const fs = require('fs');
let file = 'src/pages/marketing/marketing.css';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('@keyframes shimmer')) {
  content += `\n@keyframes shimmer {
    100% { transform: translateX(100%); }
  }\n`;
  fs.writeFileSync(file, content, 'utf8');
}
console.log("Shimmer CSS added");
