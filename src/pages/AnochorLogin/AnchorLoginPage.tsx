import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Eye, EyeOff, Lock, User, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { z } from "zod";
import { useAnchorLogin, getApiError } from "@/hooks/useAuth";
import { toast } from "sonner";
import r1xchangeLogoWhiteWebView from "@/assets/r1xchangeLogoWhiteWebView.svg";

const loginSchema = z.object({
  id: z.string().min(1, "ID is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function AnchorLoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const loginMutation = useAnchorLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onTouched",
  });

  const onSubmit = (values: LoginFormValues) => {
    loginMutation.mutate({
      login_id: values.id,
      password: values.password,
    }, {
      onError: (err) => {
        if (err.message.toLocaleLowerCase() == "Unauthorized Access") {
          toast.error("Invalid ID or password. Please try again.");
        }
        toast.error(getApiError(err));
      },
    });
  };

  return (
    <div className="flex min-h-screen w-full bg-[#f4f5f9] text-[#1a1a1a]">
      {/* Left Branding Panel */}
      <div className="relative hidden w-1/2 flex-col justify-between bg-gradient-to-br from-[#2f1ecc] via-[#1c0f99] to-[#0e0758] p-12 text-white md:flex overflow-hidden">
        {/* Visual Graphic Elements */}
        <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
          {/* Ambient Glow behind the orb */}
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute -right-24 top-[15%] w-[600px] h-[600px] rounded-full bg-[#5839f5]/25 blur-[120px]"
          />

          {/* Glowing Orb/Sphere */}
          <motion.div
            animate={{
              y: [0, -30, 0],
              x: [0, -10, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute -right-24 top-[20%] w-[480px] h-[480px] rounded-full bg-gradient-to-br from-[#4027db] to-[#120760] opacity-90 border-t border-l border-white/20 shadow-[inset_15px_15px_40px_rgba(255,255,255,0.22),_0_0_80px_rgba(83,69,211,0.25)]"
          />

          {/* Diagonal Glassmorphic Overlay */}
          <motion.div
            initial={{ rotate: -38 }}
            animate={{
              y: [0, 15, 0],
              rotate: [-38, -39, -38]
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute right-[-15%] bottom-[-15%] w-[100%] h-[90%] rounded-[100px] bg-gradient-to-tr from-white/[0.05] to-transparent backdrop-blur-[14px] border-t border-l border-white/[0.08] shadow-[25px_-25px_60px_rgba(0,0,0,0.2)] origin-bottom-right"
          />

          {/* Fading Dot Grid Pattern */}
          <div className="absolute right-8 bottom-8 w-[200px] h-[250px] opacity-40">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <radialGradient id="dotMask" cx="100%" cy="100%" r="100%">
                  <stop offset="0%" stopColor="white" stopOpacity="1" />
                  <stop offset="85%" stopColor="white" stopOpacity="0.1" />
                  <stop offset="100%" stopColor="white" stopOpacity="0" />
                </radialGradient>
                <mask id="gridMask">
                  <rect width="100%" height="100%" fill="url(#dotMask)" />
                </mask>
                <pattern id="dots" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
                  <circle cx="3" cy="3" r="1.5" fill="white" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#dots)" mask="url(#gridMask)" />
            </svg>
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-4">
          <img src={r1xchangeLogoWhiteWebView} alt="R1Xchange Logo" className="h-32 w-auto object-contain select-none" />
        </div>

        {/* Center Text Branding */}
        <div className="relative z-10 my-auto max-w-lg select-none">
          <h1 className="text-5xl md:text-6xl font-bold text-white leading-[1.12] tracking-tight">
            Welcome To
            <br />
            CRISP
            <br />
            Underwriting Platform
          </h1>
        </div>

        {/* Footer Credit */}
        <div className="relative z-10 text-xs text-white/40 font-medium tracking-wide">
          © 2025 R1Xchange. All rights reserved.
        </div>
      </div>

      {/* Right Login Panel */}
      <div className="flex w-full items-center justify-center p-6 md:w-1/2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          {/* Card Form */}
          <Card className="border-0 bg-white shadow-xl shadow-black/5 rounded-2xl overflow-hidden">
            <CardContent className="p-6 md:p-7">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" autoComplete="off">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                    Login
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Enter your credentials to access your account
                  </p>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="id">
                    ID
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                    <Input
                      id="id"
                      type="text"
                      placeholder="ID"
                      className="h-11 pl-11 pr-4 border-gray-200 focus:border-[#4c3cbd] focus:ring-[#4c3cbd] rounded-xl text-base shadow-none placeholder:text-gray-400"
                      autoComplete="off"
                      {...register("id")}
                    />
                  </div>
                  {errors.id && (
                    <p className="text-xs font-medium text-red-600">
                      {errors.id.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="password">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      className="h-11 pl-11 pr-11 border-gray-200 focus:border-[#4c3cbd] focus:ring-[#4c3cbd] rounded-xl text-base shadow-none placeholder:text-gray-400"
                      autoComplete="new-password"
                      {...register("password")}
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
                  className="w-full h-11 mt-2 text-base font-semibold bg-[#4c3cbd] hover:bg-[#3f32a3]/80 hover:border-[#000000]/20 hover:tracking-[0.08em] active:scale-[0.90] text-white rounded-xl shadow-md shadow-[#4c3cbd]/20 transition-all ease-in-out duration-200 flex items-center justify-center gap-2"
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
          <div className="mt-8 text-center">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                toast.info("Please contact system administrator to retrieve your credentials.");
              }}
              className="text-sm font-semibold text-gray-500 hover:text-[#4c3cbd] transition-colors"
            >
              Having problems signing in?
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
