const fs = require('fs');
let file = 'src/pages/marketing/MarketingSite.tsx';
let content = fs.readFileSync(file, 'utf8');

// Replace the Brand function
const newBrand = `function Brand() {
  const [isLaunching, setIsLaunching] = useState(false);

  const handleClick = (e) => {
    // If we are already at the top, or just as a fun effect, trigger the launch!
    if (window.scrollY < 50) {
      e.preventDefault(); // Don't navigate if already at top
      if (!isLaunching) {
        setIsLaunching(true);
        setTimeout(() => setIsLaunching(false), 1200); // Reset after animation
      }
    } else {
      // Normal scroll to top behavior
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <Link className="brand" to="/" aria-label="CRISP home" onClick={handleClick}>
      <img 
        src={crispLogoBlack} 
        alt="CRISP" 
        className={isLaunching ? "logo-blast" : ""}
        style={{ height: '70px', transition: 'transform 0.1s' }} 
      />
    </Link>
  );
}`;

content = content.replace(/function Brand\(\) \{[\s\S]*?<\element|\n\}\n/m, (match, offset, string) => {
  // Wait, regex might be tricky. Let's do indexOf
  return match; 
});
// Using index of is safer:
const brandStart = content.indexOf('function Brand() {');
const brandEnd = content.indexOf('export function ActionLink');

if (brandStart > -1 && brandEnd > -1) {
  content = content.substring(0, brandStart) + newBrand + '\n\n  ' + content.substring(brandEnd);
  fs.writeFileSync(file, content, 'utf8');
  console.log("Brand component updated");
} else {
  console.log("Could not find Brand component");
}
