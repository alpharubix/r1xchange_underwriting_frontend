const fs = require('fs');
let file = 'src/pages/marketing/marketing.css';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('@keyframes fade-in')) {
  content += `\n@keyframes fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }\n.animate-fade-in { animation: fade-in 0.3s ease-in-out; }\n`;
  fs.writeFileSync(file, content, 'utf8');
}
console.log("CSS added");
