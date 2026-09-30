import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import crispLogoWhiteWebView from '@/assets/crispLogoRedesign.png';

interface HomeIntroProps {
  onComplete?: () => void;
}

export default function HomeIntro({ onComplete }: HomeIntroProps = {}) {
  const [show, setShow] = useState(false);
  const [companyName, setCompanyName] = useState('');

  useEffect(() => {
    const hasShown = sessionStorage.getItem('home_intro_shown');
    setCompanyName(sessionStorage.getItem('company_name') || '');

    if (!hasShown) {
      setShow(true);

      const timer = setTimeout(() => {
        setShow(false);
        sessionStorage.setItem('home_intro_shown', 'true');
      }, 1800);

      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {show && (
        <motion.div
          key="home-intro"
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#002366] border-b-[6px] border-white overflow-hidden pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{
            y: '-100%',
            transition: {
              duration: 0.8,
              ease: [0.5, 0, 0.5, 1],
            },
          }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              duration: 0.6,
              ease: [0.22, 0.5, 0.36, 0.5],
            }}
            className="flex flex-col items-center justify-center text-center p-6"
          >
            <img
              src={crispLogoWhiteWebView}
              alt="CRISP"
              className="w-[380px] md:w-[500px] object-contain drop-shadow-2xl"
            />
            {companyName ? (
              <div className="mt-8 flex justify-center">
                <div className="border border-white/30 rounded-xl px-8 py-3 bg-white/5 backdrop-blur-md shadow-lg">
                  <p className="text-xs uppercase tracking-[0.3em] text-white/70">
                    Welcome
                  </p>
                  <h2 className="mt-1 text-2xl md:text-3xl font-bold text-white tracking-wide">
                    {companyName}
                  </h2>
                </div>
              </div>
            ) : (
              <p className="mt-6 text-center text-lg md:text-xl font-semibold tracking-[0.3em] text-white/70">
                Welcome to <span className="text-white">CRISP</span>
              </p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}



