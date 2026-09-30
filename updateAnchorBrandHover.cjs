const fs = require('fs');
let file = 'src/pages/marketing/AnchorMarketingSite.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace("import React, { useEffect, useState} from 'react';", "import React, { useEffect, useState, useRef} from 'react';");

const newBrand = `function Brand() {
  const [isLaunching, setIsLaunching] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const hoverTimer = useRef<NodeJS.Timeout | null>(null);

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
    hoverTimer.current = setTimeout(() => setIsHovered(true), 1500); // Wait 1.5s
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
}`;

const brandStart = content.indexOf('function Brand() {');
const brandEnd = content.indexOf('function AnchorNavbar() {');

if (brandStart > -1 && brandEnd > -1) {
  content = content.substring(0, brandStart) + newBrand + '\n\n  ' + content.substring(brandEnd);
  fs.writeFileSync(file, content, 'utf8');
  console.log("Anchor Brand updated with hover Easter Egg");
} else {
  console.log("Could not find Brand component");
}
