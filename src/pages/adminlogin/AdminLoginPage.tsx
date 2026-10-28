import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Lock, User, ArrowRight, Loader2, Building2, Users, CreditCard, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { z } from 'zod';
import { useAdminLogin } from '@/hooks/useAuth';
import { toast } from 'sonner';
import adminCommandCenter from '@/assets/admin_command_center.jpg';
import crispLogoWhiteWebView from '@/assets/crispLogoRedesign.png';

const adminLoginSchema = z.object({
  id: z.string().min(1, 'ID is required'),
  password: z.string().min(1, 'Password is required'),
});

type AdminLoginFormValues = z.infer<typeof adminLoginSchema>;

export default function AdminLoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const loginMutation = useAdminLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AdminLoginFormValues>({
    resolver: zodResolver(adminLoginSchema),
    mode: 'onTouched',
  });

  useEffect(() => {
    document.body.classList.add('admin-panel');
    return () => {
      document.body.classList.remove('admin-panel');
    };
  }, []);

  const onSubmit = (values: AdminLoginFormValues) => {
    loginMutation.mutate({
      login_id: values.id,
      password: values.password,
    });
  };

  return (
    <div className="admin-panel flex h-screen max-h-screen w-full overflow-hidden bg-[#f4f5f9] text-[#1a1a1a] font-montserrat">
      {/* Left Branding Panel (Mockup Redesign) */}
      <div className="relative hidden w-1/2 h-full bg-gradient-to-br from-[#7754f8] to-[#5130d2] p-5 lg:p-6 text-white md:flex overflow-hidden">
        {/* Transparent glassmorphic inner card matching the screenshot layout */}
        <div className="relative w-full h-full flex flex-col justify-between p-6 lg:p-8 overflow-hidden rounded-[28px] border border-white/20 bg-white/10 backdrop-blur-md shadow-2xl">
          {/* Blueprint/Grid skyline watermark in the card background */}
          <div className="absolute inset-0 pointer-events-none opacity-10 select-none">
            <svg
              className="w-full h-full text-white"
              viewBox="0 0 100 100"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.3"
            >
              {/* Grid lines */}
              <line x1="10" y1="0" x2="10" y2="100" />
              <line x1="25" y1="0" x2="25" y2="100" />
              <line x1="40" y1="0" x2="40" y2="100" />
              <line x1="55" y1="0" x2="55" y2="100" />
              <line x1="70" y1="0" x2="70" y2="100" />
              <line x1="85" y1="0" x2="85" y2="100" />

              <line x1="0" y1="15" x2="100" y2="15" />
              <line x1="0" y1="30" x2="100" y2="30" />
              <line x1="0" y1="45" x2="100" y2="45" />
              <line x1="0" y1="60" x2="100" y2="60" />
              <line x1="0" y1="75" x2="100" y2="75" />

              {/* Outline skyline structures */}
              <path d="M 10,75 L 10,50 L 22,50 L 22,75" />
              <path d="M 25,75 L 25,35 L 42,35 L 42,75" />
              <path d="M 50,75 L 50,55 L 68,55 L 68,75" />
              <path d="M 72,75 L 72,40 L 88,40 L 88,75" />

              {/* Outline Clouds */}
              <path
                d="M 60,25 C 62,20 70,20 72,25 C 74,20 82,20 84,25 L 85,28 L 58,28 Z"
                fill="currentColor"
                opacity="0.3"
              />
            </svg>
          </div>

          {/* Top Admin Status Header */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[11px] font-semibold text-white/90 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Admin Command Center
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-medium text-white/70 bg-white/5 border border-white/10 px-2.5 py-0.5 rounded-md backdrop-blur-xs">
              <Activity className="w-3 h-3 text-cyan-300" />
              <span>Real-Time Monitoring</span>
            </div>
          </div>

          {/* Centered Admin Monitoring Visual with Anchors, Customers & Payments */}
          <div className="relative z-10 flex flex-col items-center justify-center my-auto py-2">
            <div className="relative group">
              {/* Soft ambient glow */}
              <div className="absolute -inset-2 bg-gradient-to-r from-cyan-500/20 via-purple-500/25 to-blue-500/20 rounded-[30px] blur-xl opacity-75" />

              {/* Central Admin Monitoring Image */}
              <img
                src={adminCommandCenter}
                alt="CRISP Admin Monitoring Portal - Anchors, Customers, Payments"
                className="relative w-48 h-48 lg:w-56 lg:h-56 xl:w-60 xl:h-60 object-cover rounded-[24px] shadow-2xl border border-white/25"
              />

              {/* Floating Badge: Anchors Oversight */}
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="absolute -top-3 -left-3 bg-slate-900/85 backdrop-blur-md border border-white/20 px-2.5 py-1.5 rounded-xl shadow-lg flex items-center gap-2 text-white"
              >
                <div className="h-6 w-6 rounded-lg bg-indigo-500/30 border border-indigo-400/40 flex items-center justify-center text-indigo-300 shrink-0">
                  <Building2 className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold block leading-none text-white tracking-tight">Anchors</span>
                  <span className="text-[9px] text-indigo-200 font-medium leading-none">Partners</span>
                </div>
              </motion.div>

              {/* Floating Badge: Customers Due Diligence */}
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                className="absolute -top-3 -right-3 bg-slate-900/85 backdrop-blur-md border border-white/20 px-2.5 py-1.5 rounded-xl shadow-lg flex items-center gap-2 text-white"
              >
                <div className="h-6 w-6 rounded-lg bg-emerald-500/30 border border-emerald-400/40 flex items-center justify-center text-emerald-300 shrink-0">
                  <Users className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold block leading-none text-white tracking-tight">Customers</span>
                  <span className="text-[9px] text-emerald-200 font-medium leading-none">Underwriting</span>
                </div>
              </motion.div>

              {/* Floating Badge: Payments & Ledger */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.4 }}
                className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-slate-900/90 backdrop-blur-md border border-white/20 px-3 py-1.5 rounded-xl shadow-xl flex items-center gap-2 text-white whitespace-nowrap"
              >
                <div className="h-6 w-6 rounded-lg bg-amber-500/30 border border-amber-400/40 flex items-center justify-center text-amber-300 shrink-0">
                  <CreditCard className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="text-[10px] font-bold block leading-none text-white tracking-tight">Payments Ledger</span>
                  <span className="text-[9px] text-amber-200 font-medium leading-none">Audit & Reconciled</span>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Text Branding & Sliders */}
          <div className="relative z-10 space-y-2 mt-auto">
            <div className="space-y-1.5 text-left">
              <div className="flex items-center gap-3">
                <img
                  src={crispLogoWhiteWebView}
                  alt="CRISP logo"
                  className="h-12 lg:h-14 w-auto object-contain drop-shadow-lg"
                />
                <div className="h-6 w-[2px] bg-white/30 rounded-full" />
                <h1 className="text-xl lg:text-2xl font-bold tracking-tight text-white leading-tight font-montserrat">
                  CRISP Admin Portal
                </h1>
              </div>
              <p className="text-white/80 text-xs lg:text-sm font-medium">
                Welcome to R1X Underwriting Platform.
              </p>
            </div>

            {/* Slider Indicator Dots */}
          </div>
        </div>
      </div>

      {/* Right Login Panel */}
      <div className="flex w-full h-full items-center justify-center p-6 md:w-1/2 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="w-full max-w-md my-auto"
        >
          {/* Card Form */}
          <Card className="border-0 bg-white shadow-xl shadow-black/5 rounded-2xl overflow-hidden">
            <CardContent className="p-6 sm:p-8">
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-5"
                autoComplete="off"
              >
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                    CRISP Admin Portal
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Enter your credentials to access your account
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="id">ID</Label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                    <Input
                      id="id"
                      type="text"
                      placeholder="ID"
                      className="h-12 pl-11 pr-4 border-gray-200 focus:border-[#7754f8] focus:ring-[#7754f8] rounded-xl text-base shadow-none placeholder:text-gray-400"
                      autoComplete="off"
                      {...register('id')}
                    />
                  </div>
                  {errors.id && (
                    <p className="text-xs font-medium text-red-600">
                      {errors.id.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Password"
                      className="h-12 pl-11 pr-11 border-gray-200 focus:border-[#7754f8] focus:ring-[#7754f8] rounded-xl text-base shadow-none placeholder:text-gray-400"
                      autoComplete="new-password"
                      {...register('password')}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 focus:outline-none"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-xs font-medium text-red-600">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={loginMutation.isPending}
                  className="w-full h-12 text-base font-semibold bg-[#7754f8] hover:bg-[#5130d2] text-white rounded-xl shadow-md shadow-[#7754f8]/20 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  {loginMutation.isPending ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Logging in...
                    </>
                  ) : (
                    <>
                      Login
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Having problems link */}
          <div className="mt-4 lg:mt-5 text-center">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                toast.info(
                  'Please contact system administrator to retrieve your credentials.'
                );
              }}
              className="text-xs sm:text-sm font-semibold text-gray-500 hover:text-[#7754f8] transition-colors"
            >
              Having problems signing in?
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
