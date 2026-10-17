import { useState } from 'react';
import {
  ShieldCheck,
  ArrowRight,
  ArrowUpRight,
  FileSearch,
  CheckCircle2,
  Lock,
  FileText, 
} from 'lucide-react';

export interface KycScreenPreviewProps {
  stepIndex: number;
}

export function KycScreenPreview({ stepIndex }: KycScreenPreviewProps) {
  const progressLabels = ['Aadhaar', 'OTP', 'DigiLocker', 'Documents'];
  const [selectedDoc, setSelectedDoc] = useState<'aadhaar' | 'pan'>('aadhaar');

  const renderContent = () => {
    if (stepIndex === 0) {
      return (
        <>
          <div className="kyc-preview-heading">
            <ShieldCheck size={16} />
            <span>
              <strong>Identity Verification</strong>
              <small>Verify your Aadhaar details via DigiLocker to continue</small>
            </span>
          </div>
          <label>Aadhaar Number</label>
          <div className="kyc-preview-input">5428 9102 3841</div>
          <button
            type="button"
            style={{
              height: '32px',
              minHeight: 'unset',
              lineHeight: '1',
              color: '#ffffff',
            }}
          >
            <span className="inline-flex items-center gap-1.5" style={{ color: '#ffffff', fontSize: '12px', whiteSpace: 'nowrap' }}>
              <span>Send OTP</span>
              <ArrowRight size={11} className="text-white" />
            </span>
          </button>
        </>
      );
    }
    if (stepIndex === 1) {
      return (
        <>
          <div className="kyc-preview-status">
            <span className="health-dot" />
            <strong>OTP sent to registered mobile linked with Aadhaar</strong>
          </div>
          <label>Enter 6-Digit Aadhaar OTP</label>
          <div className="kyc-preview-input kyc-preview-otp">7 2 9 4 0 1</div>
          <button
            type="button"
            style={{
              height: '32px',
              minHeight: 'unset',
              lineHeight: '1',
              color: '#ffffff',
            }}
          >
            <span className="inline-flex items-center gap-1.5" style={{ color: '#ffffff', fontSize: '12px', whiteSpace: 'nowrap' }}>
              <span>Verify Aadhaar</span>
              <ArrowRight size={11} className="text-white" />
            </span>
          </button>
        </>
      );
    }
    if (stepIndex === 2) {
      return (
        <>
          <div className="kyc-preview-heading">
            <ShieldCheck size={16} />
            <span>
              <strong>DigiLocker Consent Gateway</strong>
              <small>Approve consent to securely fetch verified government documents</small>
            </span>
          </div>
          <div className="kyc-preview-consent">
            <span className="kyc-preview-lock">
              <Lock size={12} />
            </span>
            <span>
              <strong>Secure DigiLocker Session</strong>
              <small>Session active · Waiting for user authorization</small>
            </span>
            <ArrowUpRight size={13} />
          </div>
          <button
            type="button"
            style={{
              height: '32px',
              minHeight: 'unset',
              lineHeight: '1',
              color: '#ffffff',
            }}
          >
            <span className="inline-flex items-center gap-1.5" style={{ color: '#ffffff', fontSize: '12px', whiteSpace: 'nowrap' }}>
              <span>Open DigiLocker Window</span>
              <ArrowUpRight size={11} className="text-white" />
            </span>
          </button>
        </>
      );
    }
    if (stepIndex === 3) {
      return (
        <>
          <div className="kyc-preview-status kyc-preview-processing">
            <span className="gst-preview-spinner" />
            <strong>Checking DigiLocker Session Status</strong>
          </div>
          <div className="kyc-preview-progress">
            <span />
          </div>
          <small>Secure handshake in progress. Fetching verified documents from UIDAI &amp; Income Tax...</small>
        </>
      );
    }
    return (
      <>
        <div className="kyc-preview-heading">
          <FileSearch size={16} />
          <span>
            <strong>Available Documents</strong>
            <small>Government-verified records retrieved successfully</small>
          </span>
        </div>
        <div className="kyc-preview-documents">
          <span
            onClick={() => setSelectedDoc('aadhaar')}
            style={{
              cursor: 'pointer',
              border: selectedDoc === 'aadhaar' ? '1px solid #16a34a' : undefined,
              backgroundColor: selectedDoc === 'aadhaar' ? '#f0fdf4' : undefined,
            }}
          >
            <FileText size={13} />
            <b>Aadhaar Card (UIDAI)</b>
            <em>
              <CheckCircle2 size={11} className="inline mr-1 text-emerald-600" />
              Verified
            </em>
          </span>
          <span
            onClick={() => setSelectedDoc('pan')}
            style={{
              cursor: 'pointer',
              border: selectedDoc === 'pan' ? '1px solid #16a34a' : undefined,
              backgroundColor: selectedDoc === 'pan' ? '#f0fdf4' : undefined,
            }}
          >
            <FileText size={13} />
            <b>PAN Card (NSDL / UTI)</b>
            <em>
              <CheckCircle2 size={11} className="inline mr-1 text-emerald-600" />
              Available
            </em>
          </span>
        </div>
        {selectedDoc === 'aadhaar' ? (
          <div className="mt-3 p-3 rounded-lg border border-emerald-100 bg-emerald-50/50 text-xs">
            <div className="font-semibold text-slate-800 flex items-center justify-between">
              <span>Aadhaar Identity Card</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-mono">UIDAI XML</span>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-2 text-slate-600">
              <div>Name: <b className="text-slate-800">Rahul Sharma</b></div>
              <div>DOB: <b className="text-slate-800">12-04-1992</b></div>
              <div>Gender: <b className="text-slate-800">Male</b></div>
              <div>Address: <b className="text-slate-800">Bangalore, KA</b></div>
            </div>
          </div>
        ) : (
          <div className="mt-3 p-3 rounded-lg border border-emerald-100 bg-emerald-50/50 text-xs">
            <div className="font-semibold text-slate-800 flex items-center justify-between">
              <span>Permanent Account Number</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-mono">PAN API</span>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-2 text-slate-600">
              <div>PAN: <b className="text-slate-800">ABCDE1234F</b></div>
              <div>Name: <b className="text-slate-800">Rahul Sharma</b></div>
              <div>Status: <b className="text-emerald-700">OPERATIVE</b></div>
              <div>Aadhaar Seeding: <b className="text-emerald-700">LINKED</b></div>
            </div>
          </div>
        )}
      </>
    );
  };

  return (
    <div className="kyc-screen-preview">
      <div className="kyc-preview-top">
        <span>
          <ShieldCheck size={14} /> KYC Verification
        </span>
        <small>CRISP</small>
      </div>
      <div className="kyc-preview-progress-steps">
        {progressLabels.map((label, index) => (
          <span className={index <= stepIndex ? 'active' : ''} key={label}>
            <i>{index < stepIndex ? '✓' : index + 1}</i>
            {label}
          </span>
        ))}
      </div>
      <div className="kyc-preview-content">{renderContent()}</div>
    </div>
  );
}

export default KycScreenPreview;

