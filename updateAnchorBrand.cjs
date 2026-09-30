const fs = require('fs');
let file = 'src/pages/marketing/AnchorMarketingSite.tsx';
let content = fs.readFileSync(file, 'utf8');

const newBrand = `function Brand() {
  const [isLaunching, setIsLaunching] = useState(false);

  const handleClick = (e) => {
    if (window.scrollY < 50) {
      e.preventDefault();
      if (!isLaunching) {
        setIsLaunching(true);
        setTimeout(() => setIsLaunching(false), 1200);
      }
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <Link className="brand" to="/anchors" aria-label="CRISP Anchor Home" onClick={handleClick}>
      <img 
        src={crispLogoBlack} 
        alt="CRISP" 
        className={isLaunching ? "logo-blast" : ""}
        style={{ height: '67px' }} 
      />
    </Link>
  );
}`;

const brandStart = content.indexOf('function Brand() {');
const brandEnd = content.indexOf('function AnchorNavbar() {');

if (brandStart > -1 && brandEnd > -1) {
  content = content.substring(0, brandStart) + newBrand + '\n\n  ' + content.substring(brandEnd);
  fs.writeFileSync(file, content, 'utf8');
  console.log("Anchor Brand updated");
} else {
  console.log("Could not find Brand component");
}
