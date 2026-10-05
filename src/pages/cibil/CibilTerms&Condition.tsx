import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CibilTermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept?: () => void;
}

export function CibilTermsModal({
  isOpen,
  onClose,
  onAccept,
}: CibilTermsModalProps) {
  if (!isOpen) return null;

  const handleAuthorise = () => {
    if (onAccept) {
      onAccept();
    }
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col border border-gray-200 overflow-hidden animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/80">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#002366]">
              SEPARATE OPTIONAL/REQUIRED CONSENT — CREDIT INFORMATION
            </h2>
            <p className="text-lg font-bold text-gray-900 mt-1">
              Credit Information Authorisation
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors self-start"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 text-sm text-gray-700 leading-relaxed">
          <section className="space-y-3">
           
            <blockquote className="border-l-4 border-[#002366] bg-gray-50 p-4 rounded-r-xl text-xs leading-relaxed text-gray-800 space-y-2">
              <p>
               I expressly consent to the access and processing of my credit information for the
purposes described in the Credit Information Authorisation
              </p>
            </blockquote>
          </section>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50/80 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-semibold text-gray-500 hover:text-gray-800"
          >
            Cancel
          </button>
          <Button
            type="button"
            className="bg-[#002366] text-white hover:bg-[#001845] px-6 font-bold tracking-wide uppercase text-xs h-10"
            onClick={handleAuthorise}
          >
            AUTHORISE CREDIT CHECK
          </Button>
        </div>
      </div>
    </div>
  );
}

export default CibilTermsModal;
