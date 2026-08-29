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
import { useAdminLogin } from "@/hooks/useAuth";
import { toast } from "sonner";
import characterLaptop from "@/assets/character_laptop.jpg";

const adminLoginSchema = z.object({
  id: z.string().min(1, "ID is required"),
  password: z.string().min(1, "Password is required"),
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
    mode: "onTouched",
  });



  const onSubmit = (values: AdminLoginFormValues) => {
    loginMutation.mutate({
      login_id: values.id,
      password: values.password,
    });
  };

  return (
    <div className="flex min-h-screen w-full bg-[#f4f5f9] text-[#1a1a1a]">
      {/* Left Branding Panel (Mockup Redesign) */}
      <div className="relative hidden w-1/2 bg-gradient-to-br from-[#7754f8] to-[#5130d2] p-8 text-white md:flex overflow-hidden">
        
        {/* Transparent glassmorphic inner card matching the screenshot layout */}
        <div className="relative w-full h-full flex flex-col justify-between p-10 overflow-hidden rounded-[36px] border border-white/20 bg-white/10 backdrop-blur-md shadow-2xl">
          
          {/* Blueprint/Grid skyline watermark in the card background */}
          <div className="absolute inset-0 pointer-events-none opacity-10 select-none">
            <svg className="w-full h-full text-white" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.3">
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
              <path d="M 60,25 C 62,20 70,20 72,25 C 74,20 82,20 84,25 L 85,28 L 58,28 Z" fill="currentColor" opacity="0.3" />
            </svg>
          </div>

          {/* Hanging Dome Lamp */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none select-none">
            <div className="w-[1.5px] h-28 bg-white/40" />
            <div className="w-24 h-12 rounded-t-full bg-gradient-to-b from-[#111] to-[#222] relative overflow-hidden shadow-lg">
              <div className="absolute bottom-0 left-0 right-0 h-3 bg-gradient-to-t from-white/10 to-transparent" />
            </div>
          </div>

          {/* Centered 3D Character Illustration */}
          <div className="relative z-10 flex flex-col items-center justify-center mt-48">
            <img 
              src={characterLaptop} 
              alt="3D Character typing on laptop" 
              className="w-72 h-72 object-cover rounded-[32px] shadow-2xl border border-white/20" 
            />
          </div>

          {/* Text Branding & Sliders */}
          <div className="relative z-10 space-y-6 mt-auto">
            <div className="space-y-2 text-left">
              <h2 className="text-3xl font-bold tracking-tight text-white leading-tight">
               CRISP
              </h2>
              <p className="text-white/80 text-sm font-medium">
                Welcome to R1X Underwriting Platform.
              </p>
            </div>

            {/* Slider Indicator Dots */}
           
          </div>

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
            <CardContent className="p-8">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" autoComplete="off">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                    Login
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Enter your credentials to access your account
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="id">
                    ID
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                    <Input
                      id="id"
                      type="text"
                      placeholder="ID"
                      className="h-12 pl-11 pr-4 border-gray-200 focus:border-[#7754f8] focus:ring-[#7754f8] rounded-xl text-base shadow-none placeholder:text-gray-400"
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

                <div className="space-y-2">
                  <Label htmlFor="password">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      className="h-12 pl-11 pr-11 border-gray-200 focus:border-[#7754f8] focus:ring-[#7754f8] rounded-xl text-base shadow-none placeholder:text-gray-400"
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
          <div className="mt-8 text-center">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                toast.info("Please contact system administrator to retrieve your credentials.");
              }}
              className="text-sm font-semibold text-gray-500 hover:text-[#7754f8] transition-colors"
            >
              Having problems signing in?
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
