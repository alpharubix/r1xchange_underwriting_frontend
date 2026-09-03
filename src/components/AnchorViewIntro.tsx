import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import r1xchangeLogoWhiteWebView from "@/assets/r1xchangeLogoWhiteWebView.svg";
import { useAuthContext } from "@/contexts/AuthContext";
import { getAnchorBrand } from "@/lib/brandLogo";

interface AnchorViewIntroProps {
  onComplete: () => void;
}

export default function AnchorViewIntro({ onComplete }: AnchorViewIntroProps) {
  const [isVisible, setIsVisible] = useState(true);
  const shouldReduceMotion = useReducedMotion();
  const { user } = useAuthContext();
  const brand = getAnchorBrand(user);

  useEffect(() => {
    // Wait ~1.6s before starting the fade out.
    // Total duration: 1.6s + 0.6s exit = 2.2s.
    const fadeOutTimer = setTimeout(() => {
      setIsVisible(false);
    }, 2000);

    // Hard failsafe to guarantee onComplete is called and the user isn't stuck
    const failsafeTimer = setTimeout(() => {
      onComplete();
    }, 2500);

    return () => {
      clearTimeout(fadeOutTimer);
      clearTimeout(failsafeTimer);
    };
  }, [onComplete]);

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {isVisible && (
        <motion.div
          key="intro-container"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gradient-to-br from-[#2f1ecc] via-[#1c0f99] to-[#0e0758] overflow-hidden pointer-events-none"
        >
          <motion.div
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.8, y: 10 }}
            animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
            transition={{
              duration: 1.2,
              delay: 0.2, // Subtle delay before logo appears
              ease: [0.25, 0.1, 0.25, 1],
            }}
            className="relative flex flex-col items-center justify-center gap-6"
          >
            {brand.logo ? (
              <div className="flex flex-col items-center justify-center gap-10 md:gap-16 w-full max-w-5xl px-4">
                <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 w-full">
                  {/* R1Xchange Side */}
                  <div className="flex flex-col items-center justify-center gap-6">
                    <img
                      src={r1xchangeLogoWhiteWebView}
                      alt="R1Xchange Logo"
                      className="h-28 md:h-40 w-auto object-contain select-none drop-shadow-[0_20px_50px_rgba(0,0,0,0.4)]"
                    />
                    <p className="text-white/95 font-extrabold tracking-[0.3em] text-xl md:text-2xl uppercase font-sans">
                      R1Xchange
                    </p>
                  </div>

                  {/* The X divider */}
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.8, ease: "easeOut" }}
                    className="text-white/40 font-light text-5xl md:text-6xl select-none font-serif italic"
                  >
                    X
                  </motion.div>

                  {/* Anchor Side */}
                  <div className="flex flex-col items-center justify-center gap-6">
                    <img
                      src={brand.logo}
                      alt={`${brand.name} Logo`}
                      className="h-28 md:h-40 w-auto object-contain select-none drop-shadow-[0_20px_50px_rgba(0,0,0,0.4)]"
                    />
                    <p className="text-white/95 font-extrabold tracking-[0.3em] text-xl md:text-2xl uppercase font-sans text-center">
                      {brand.name}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-6">
                <div className="h-32 w-32 md:h-40 md:w-40 rounded-[2rem] bg-white text-[#002366] flex items-center justify-center font-black text-6xl md:text-7xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] shrink-0 tracking-tighter">
                  {brand.initial}
                </div>
                <div className="text-white/90 font-extrabold tracking-[0.25em] text-2xl md:text-3xl uppercase mt-2">
                  {brand.name}
                </div>
              </div>
            )}

            {/* Extremely subtle light sweep */}
            {!shouldReduceMotion && (
              <motion.div
                initial={{ left: "-150%" }}
                animate={{ left: "150%" }}
                transition={{
                  duration: 1.5,
                  delay: 0.4,
                  ease: "easeInOut",
                }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent w-[200%] h-full mix-blend-overlay -skew-x-12"
              />
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
