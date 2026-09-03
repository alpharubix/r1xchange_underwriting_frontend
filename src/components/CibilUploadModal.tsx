import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText } from 'lucide-react';
import CibilWorkflow from "@/pages/cibil/index";

interface CibilUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  custId?: string;
}

export default function CibilUploadModal({ isOpen, onClose, custId }: CibilUploadModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-xl shadow-2xl relative"
        >
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="p-6 pb-0">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <FileText className="h-6 w-6 text-[#002366]" />
              CIBIL Score
            </h2>
            <p className="text-gray-500 mt-1 font-medium">Authenticate customer consent and process CIBIL report data</p>
            {custId && <p className="text-gray-700 mt-1 font-medium text-sm">Target Customer ID: <span className="text-[#002366] font-semibold">{custId}</span></p>}
          </div>

          <div className="p-6 pt-0">
            <CibilWorkflow custId={custId} />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}
