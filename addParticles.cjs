const fs = require('fs');
let file = 'src/components/InteractiveWalletMontage.tsx';
let content = fs.readFileSync(file, 'utf8');

const particles = `
      {/* DATA IS FLOWING EASTER EGG (Particles) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-[#002366] rounded-full"
            initial={{ x: -20, y: 50 + i * 40, opacity: 0 }}
            animate={{ 
              x: ["0%", "100%"],
              opacity: [0, 1, 1, 0]
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: i * 0.5,
              ease: "linear"
            }}
          />
        ))}
      </div>
`;

// Insert after <div className="flex w-full items-center justify-center p-4">
content = content.replace(
  '<div className="flex w-full items-center justify-center p-4">', 
  '<div className="flex w-full items-center justify-center p-4 relative">' + particles
);

fs.writeFileSync(file, content, 'utf8');
console.log("Added Data Flowing Easter Egg");
