const fs = require('fs');
let file = 'src/pages/marketing/AnchorMarketingSite.tsx';
let content = fs.readFileSync(file, 'utf8');

const missingComponents = `
function Brand() {
  const [isLaunching, setIsLaunching] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const hoverTimer = useRef<number | null>(null);

  const handleClick = (e: React.MouseEvent) => {
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

  const handleMouseEnter = () => {
    hoverTimer.current = window.setTimeout(() => setIsHovered(true), 1500);
  };

  const handleMouseLeave = () => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    setIsHovered(false);
  };

  return (
    <Link 
      className="brand flex items-center relative h-[67px]" 
      to="/anchors" 
      aria-label="CRISP Anchor Home" 
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {isHovered ? (
        <div className="flex flex-col justify-center animate-fade-in pl-2">
          <span className="text-[#001845] font-bold text-2xl leading-none">CRISP</span>
          <span className="text-slate-500 text-[10px] font-semibold tracking-widest uppercase mt-1 animate-pulse">Financial Intelligence</span>
        </div>
      ) : (
        <img 
          src={crispLogoBlack} 
          alt="CRISP" 
          className={isLaunching ? "logo-blast" : "animate-fade-in"}
          style={{ height: '67px' }} 
        />
      )}
    </Link>
  );
}

function HierarchyMontage() {
  return (
    <div className="flex h-[400px] w-full bg-slate-50 overflow-hidden rounded-xl border shadow-sm text-left p-4">
      <div className="flex-1 bg-white border rounded shadow-sm p-3">
        <div className="text-sm font-bold text-slate-800 mb-2">Anchor Ecosystem</div>
        <div className="space-y-2">
          <div className="p-2 border rounded bg-slate-50 text-xs">Dealer 1</div>
          <div className="p-2 border rounded bg-slate-50 text-xs ml-4">Borrower A</div>
          <div className="p-2 border rounded bg-slate-50 text-xs ml-4">Borrower B</div>
        </div>
      </div>
    </div>
  );
}
`;

content = content.replace("function AnchorNavbar() {", missingComponents + "\nfunction AnchorNavbar() {");
fs.writeFileSync(file, content, 'utf8');
console.log("Restored missing components");
