import { motion, AnimatePresence } from "framer-motion";
import { X, User, Building2, CreditCard } from "lucide-react";

interface PayerSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  moduleName: string;
  onUserPay: () => void;
  onCustomerPay: () => void;
}

export default function PayerSelectionModal({
  isOpen,
  onClose,
  moduleName,
  onUserPay,
  onCustomerPay,
}: PayerSelectionModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden z-10"
          >
            <div className="bg-[#002366] p-6 pb-8 text-white relative">
              <div
                className="absolute top-4 right-4 cursor-pointer opacity-70 hover:opacity-100 transition-opacity"
                onClick={onClose}
              >
                <X className="h-5 w-5" />
              </div>
              <div className="h-12 w-12 rounded-2xl bg-white/20 flex items-center justify-center mb-4 backdrop-blur-sm">
                <CreditCard className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white tracking-tight">Who is paying?</h2>
                <p className="text-blue-100 font-medium text-sm mt-1">
                  Select how the {moduleName} report should be billed.
                </p>
              </div>
            </div>

            <div className="p-6 pb-8 -mt-4 bg-white rounded-t-3xl relative flex flex-col items-center gap-4">
              <button
                onClick={onUserPay}
                className="w-full text-left p-4 rounded-2xl border-2 border-slate-100 hover:border-[#002366] hover:bg-slate-50 transition-all group flex items-start gap-4"
              >
                <div className="h-10 w-10 rounded-full bg-blue-50 text-[#002366] flex items-center justify-center shrink-0 group-hover:bg-[#002366] group-hover:text-white transition-colors">
                  <Building2 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-lg">I will pay</h3>
                  <p className="text-sm text-slate-500 mt-0.5">
                    Deduct from your organization's wallet or pay immediately.
                  </p>
                </div>
              </button>

              <button
                onClick={onCustomerPay}
                className="w-full text-left p-4 rounded-2xl border-2 border-slate-100 hover:border-[#002366] hover:bg-slate-50 transition-all group flex items-start gap-4"
              >
                <div className="h-10 w-10 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center shrink-0 group-hover:bg-[#002366] group-hover:text-white transition-colors">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-lg">Customer will pay</h3>
                  <p className="text-sm text-slate-500 mt-0.5">
                    Generate a pending payment for the customer to fulfill in their dashboard.
                  </p>
                </div>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
