// not used - This file is not used anywhere in the project - initially was renderring Home intro for Anchors (anchor specific)


// import { useEffect, useState } from 'react';
// import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
// import crispLogoWhiteWebView from '@/assets/crispLogoRedesign.png';
// import { useAuthContext } from '@/contexts/AuthContext';
// import { getAnchorBrand } from '@/lib/brandLogo';

interface AnchorViewIntroProps {
  onComplete?: () => void;
}

export default function AnchorViewIntro({ onComplete }: AnchorViewIntroProps) {
  onComplete?.();
  return null;
}
