const fs = require('fs');
let file = 'src/pages/marketing/marketing.css';
let content = fs.readFileSync(file, 'utf8');

const cssToAdd = `
@keyframes blastOff {
  0% { transform: translate(0, 0); }
  10% { transform: translate(-6px, 0) rotate(-3deg); }
  20% { transform: translate(6px, 0) rotate(3deg); }
  30% { transform: translate(-6px, 0) rotate(-3deg); }
  40% { transform: translate(6px, 0) rotate(3deg); }
  50% { transform: translate(-6px, 0) rotate(-3deg); }
  60% { transform: translate(6px, 0) rotate(3deg); }
  75% { transform: translate(0, 0) rotate(0deg); }
  100% { transform: translate(0, -600px) scale(0.8); opacity: 0; }
}

.logo-blast {
  animation: blastOff 1.2s cubic-bezier(0.36, 0, 0.66, -0.56) forwards !important;
}
`;

if (!content.includes('blastOff')) {
  fs.appendFileSync(file, cssToAdd, 'utf8');
  console.log("CSS animation added");
}
