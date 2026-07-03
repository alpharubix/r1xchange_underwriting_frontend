import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import r1xchangeLogoWhiteWebView from "@/assets/r1xchangeLogoWhiteWebView.svg";

export default function HomeIntro() {
  const [show, setShow] = useState(false);
  const [companyName, setCompanyName] = useState("");

  useEffect(() => {
    
    const hasShown = sessionStorage.getItem("home_intro");
    setCompanyName(sessionStorage.getItem("company_name") || "");

    if (!hasShown) {
      setShow(true);

      const timer = setTimeout(() => {
        setShow(false);
        sessionStorage.setItem("home_intro", "true");
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black border-b-[6px] border-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{
            y: "-100%",
            transition: {
              duration: 1,
              ease: [0.5, 0, 0.5, 1],
            },
          }}
        >
          <motion.div
            initial={{
              scale: 0.2,
              opacity: 0,
            }}
            animate={{
              scale: 1,
              opacity: 1,
            }}
            transition={{
              duration: 0.5,
              ease: [0.22, 0.5, 0.36, 0.5],
            }}
            
          >
           
           <img
              src={r1xchangeLogoWhiteWebView}
              alt="R1Xchange"
              className="w-[320px] md:w-[450px] "
            />
            {
              companyName ? (
                <div className="flex justify-center ">
                  <div className=" border border-gray-800 border-2 shadow-xl  px-6 py-3 shadow-md bg-[#1a1a1a] rounded-lg">
                    <p className="text-[0.1] font-poppins poppins-regular text-center uppercase tracking-[0.3em] text-gray-400 px-10">
                     Welcome
                    </p>
                    <h2 className="mt-1 text-2xl font-poppins poppins-bold text-white px-10 border-t border-gray-600 pt-2 text-center poppins-letter-spacing">
                      {companyName}
                    </h2>
                  </div>
                </div>
              ) : (
                <p className="mt-6 text-center text-xl font-semibold tracking-[0.3em] text-white/50">
                  Welcome to <span className="text-white">R1Xchange</span>
                </p>
              )
          }
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
