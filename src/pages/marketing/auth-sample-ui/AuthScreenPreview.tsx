import { useState } from 'react';
import {
  User,
  Building,
  Phone,
  Mail,
  Lock,
  Eye,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export function AuthScreenPreview() {
  const [activeTab, setActiveTab] = useState<'createAccount' | 'signIn' | 'forgotPassword' | 'verifyOtp' | 'resetPassword'>('signIn');

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm my-4">
      <div className="bg-[#002366] text-white px-3.5 py-2 flex items-center justify-between text-xs font-medium">
        <span className="flex items-center gap-2">
          <ShieldCheck size={14} className="text-blue-300" />
          CRISP · Authentication &amp; Password Recovery
        </span>
        <span className="text-[10px] text-blue-200 uppercase tracking-wider font-mono">Platform UI</span>
      </div>

      <div className="flex items-center border-b border-slate-100 bg-slate-50 px-3 py-1.5 overflow-x-auto gap-1.5 text-xs">
        <button
          type="button"
          onClick={() => setActiveTab('createAccount')}
          className={`px-2.5 py-1 rounded-full font-semibold transition-colors ${
            activeTab === 'createAccount'
              ? 'bg-[#002366] text-white'
              : 'bg-white text-slate-600 border border-slate-200'
          }`}
        >
          Create Account
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('signIn')}
          className={`px-2.5 py-1 rounded-full font-semibold transition-colors ${
            activeTab === 'signIn'
              ? 'bg-[#002366] text-white'
              : 'bg-white text-slate-600 border border-slate-200'
          }`}
        >
          Sign In
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('forgotPassword')}
          className={`px-2.5 py-1 rounded-full font-semibold transition-colors ${
            activeTab === 'forgotPassword'
              ? 'bg-[#002366] text-white'
              : 'bg-white text-slate-600 border border-slate-200'
          }`}
        >
          Recovery Step 1 (Email)
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('verifyOtp')}
          className={`px-2.5 py-1 rounded-full font-semibold transition-colors ${
            activeTab === 'verifyOtp'
              ? 'bg-[#002366] text-white'
              : 'bg-white text-slate-600 border border-slate-200'
          }`}
        >
          Recovery Step 2 (OTP)
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('resetPassword')}
          className={`px-2.5 py-1 rounded-full font-semibold transition-colors ${
            activeTab === 'resetPassword'
              ? 'bg-[#002366] text-white'
              : 'bg-white text-slate-600 border border-slate-200'
          }`}
        >
          Recovery Step 3 (Reset)
        </button>
      </div>

      <div className="p-4 bg-slate-50/40">
        {/* ─── CREATE ACCOUNT (Page 2 of PDF) ─────────────────────────────────── */}
        {activeTab === 'createAccount' && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 max-w-sm mx-auto space-y-3.5 text-xs">
            <div>
              <h4 className="text-base font-bold text-slate-900">Create Account</h4>
              <p className="text-[11px] text-slate-500">Fill in your details to get started</p>
            </div>

            <div className="space-y-2">
              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-0.5">Full Name</label>
                <div className="relative">
                  <User size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    defaultValue="John Doe"
                    className="w-full pl-8 pr-3 py-1.5 border border-slate-300 rounded-lg text-xs text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-0.5">Company Name</label>
                <div className="relative">
                  <Building size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    defaultValue="Acme Enterprises"
                    className="w-full pl-8 pr-3 py-1.5 border border-slate-300 rounded-lg text-xs text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-0.5">Phone Number</label>
                <div className="relative">
                  <Phone size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    defaultValue="1234567890"
                    className="w-full pl-8 pr-3 py-1.5 border border-slate-300 rounded-lg text-xs text-slate-800 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-0.5">Email Address</label>
                <div className="relative">
                  <Mail size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    defaultValue="john@example.com"
                    className="w-full pl-8 pr-3 py-1.5 border border-slate-300 rounded-lg text-xs text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-0.5">Password</label>
                <div className="relative">
                  <Lock size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    defaultValue="password123"
                    className="w-full pl-8 pr-7 py-1.5 border border-slate-300 rounded-lg text-xs text-slate-800"
                  />
                  <Eye size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-0.5">Confirm Password</label>
                <div className="relative">
                  <Lock size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    defaultValue="password123"
                    className="w-full pl-8 pr-3 py-1.5 border border-slate-300 rounded-lg text-xs text-slate-800"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-600">
                <input type="checkbox" defaultChecked className="rounded border-slate-300 text-[#002366]" />
                <span>I agree to the terms and conditions</span>
              </div>
            </div>

            <button
              type="button"
              className="w-full py-2 bg-[#002366] text-white font-bold rounded-lg hover:bg-[#001a4e] flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
            >
              Create Account <ArrowRight size={13} />
            </button>

            <div className="text-center text-[11px] text-slate-500">
              Already have an account? <span className="font-semibold text-[#002366] cursor-pointer">Sign in</span>
            </div>
          </div>
        )}

        {/* ─── SIGN IN (Page 2 of PDF) ─────────────────────────────────────────── */}
        {activeTab === 'signIn' && (
          <div className="bg-white rounded-xl border-2 border-[#002366] shadow-md p-6 max-w-sm mx-auto space-y-4 text-xs">
            <div>
              <h4 className="text-lg font-bold text-slate-900">Sign In</h4>
              <p className="text-[11px] text-slate-500">Enter your credentials to access your account</p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">Email Address</label>
                <div className="relative">
                  <Mail size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    defaultValue="ashok.m@r1xchange.com"
                    className="w-full pl-8 pr-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-800"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-semibold text-slate-700">Password</label>
                  <span className="text-[10px] text-blue-600 font-semibold cursor-pointer">Forgot password?</span>
                </div>
                <div className="relative">
                  <input
                    type="password"
                    defaultValue="secret1234"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-800 tracking-widest font-mono"
                  />
                  <Eye size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
              </div>
            </div>

            <button
              type="button"
              className="w-full py-2.5 bg-[#002366] text-white font-bold rounded-lg hover:bg-[#001a4e] flex items-center justify-center gap-1.5 transition-colors shadow"
            >
              Sign In <ArrowRight size={13} />
            </button>

            <div className="text-center text-[11px] text-slate-400">or</div>

            <div className="text-center text-[11px] text-slate-500">
              Don't have an account? <span className="font-semibold text-[#002366] cursor-pointer">Create account</span>
            </div>
          </div>
        )}

        {/* ─── FORGOT PASSWORD (Page 3 of PDF) ─────────────────────────────────── */}
        {activeTab === 'forgotPassword' && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 max-w-sm mx-auto space-y-3.5 text-xs">
            <div className="flex items-center gap-2">
              <ShieldCheck size={18} className="text-[#002366]" />
              <div>
                <h4 className="text-sm font-bold text-slate-900">Forgot Password</h4>
                <span className="text-[10px] text-slate-400 font-semibold">Step 1 of 3</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-500">
              Enter your registered email and we'll send you an OTP.
            </p>

            <div>
              <label className="text-[11px] font-semibold text-slate-700 block mb-1">Email Address</label>
              <div className="relative">
                <Mail size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="w-full pl-8 pr-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-800"
                />
              </div>
            </div>

            <button
              type="button"
              className="w-full py-2.5 bg-[#002366] text-white font-bold rounded-lg hover:bg-[#001a4e] flex items-center justify-center gap-1.5 shadow-2xs"
            >
              Send OTP <ArrowRight size={13} />
            </button>

            <div className="text-center text-[11px] text-slate-500">
              Remembered it? <span className="font-semibold text-[#002366] cursor-pointer">Back to Sign In</span>
            </div>
          </div>
        )}

        {/* ─── VERIFY OTP (Page 3 of PDF) ───────────────────────────────────────── */}
        {activeTab === 'verifyOtp' && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 max-w-sm mx-auto space-y-3.5 text-xs">
            <div className="flex items-center gap-2">
              <ShieldCheck size={18} className="text-[#002366]" />
              <div>
                <h4 className="text-sm font-bold text-slate-900">Verify OTP</h4>
                <span className="text-[10px] text-slate-400 font-semibold">Step 2 of 3</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-500">
              Enter the 4-digit OTP sent to your email address.
            </p>

            <div className="flex items-center gap-1.5 p-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 text-xs">
              <Mail size={13} className="text-slate-400" />
              <span className="font-medium">stivensaran@gmail.com</span>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-700 block mb-1">One-Time Password (OTP)</label>
              <div className="flex justify-between gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <input
                    key={i}
                    type="text"
                    maxLength={1}
                    defaultValue={i === 1 ? '4' : i === 2 ? '8' : i === 3 ? '2' : '9'}
                    className="w-12 h-10 border border-slate-300 rounded-lg text-center font-bold text-sm text-slate-900 bg-white"
                  />
                ))}
              </div>
              <span className="text-[10px] text-slate-400 block mt-1">
                Check your inbox. OTP may take a few seconds to arrive.
              </span>
            </div>

            <button
              type="button"
              className="w-full py-2.5 bg-[#002366] text-white font-bold rounded-lg hover:bg-[#001a4e] flex items-center justify-center gap-1.5 shadow-2xs"
            >
              Verify OTP <ArrowRight size={13} />
            </button>

            <div className="text-center text-[11px] text-slate-500 cursor-pointer hover:text-slate-700">
              ← Change email
            </div>
          </div>
        )}

        {/* ─── RESET PASSWORD (Page 3 of PDF) ─────────────────────────────────── */}
        {activeTab === 'resetPassword' && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 max-w-sm mx-auto space-y-3.5 text-xs">
            <div className="flex items-center gap-2">
              <ShieldCheck size={18} className="text-[#002366]" />
              <div>
                <h4 className="text-sm font-bold text-slate-900">Reset Password</h4>
                <span className="text-[10px] text-slate-400 font-semibold">Step 3 of 3</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-500">
              Create a new strong password for your account.
            </p>

            <div className="space-y-2.5">
              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">New Password</label>
                <div className="relative">
                  <Lock size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    defaultValue="NewStrongPass!9"
                    className="w-full pl-8 pr-7 py-2 border border-slate-300 rounded-lg text-xs text-slate-800"
                  />
                  <Eye size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 block mb-1">Confirm New Password</label>
                <div className="relative">
                  <Lock size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    defaultValue="NewStrongPass!9"
                    className="w-full pl-8 pr-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-800"
                  />
                </div>
              </div>
            </div>

            <button
              type="button"
              className="w-full py-2.5 bg-[#002366] text-white font-bold rounded-lg hover:bg-[#001a4e] flex items-center justify-center gap-1.5 shadow-2xs"
            >
              Reset Password <ArrowRight size={13} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default AuthScreenPreview;
