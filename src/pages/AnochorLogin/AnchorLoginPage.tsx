import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Lock, User, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { z } from "zod";
import { useAnchorLogin, getApiError } from "@/hooks/useAuth";
import { toast } from "sonner";
import r1xchangeLogoBlackWebView from "@/assets/r1xchangeLogoBlackWebView.svg";
import r1xchangeLogoWhiteWebView from "@/assets/r1xchangeLogoWhiteWebView.svg";

const loginSchema = z.object({
  id: z.string().min(1, "ID is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function AnchorLoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const loginMutation = useAnchorLogin();
  // const [homeIntroShown, setHomeIntroShown] = useState(false);
  sessionStorage.setItem("company_name", loginMutation.data?.data?.company_name || "");
  // const hasShown = sessionStorage.getItem("home_introo");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (values: LoginFormValues) => {
    loginMutation.mutate({
      login_id: values.id,
      password: values.password,
    }, {
      onError: (err) => {
        if (err.message.toLocaleLowerCase() == "unauthorized access") {
          toast.error("Invalid ID or password. Please try again.");
        }
      },
    });
  };

  return (
    <>
      <div className="min-h-screen flex">
        {/* Left Panel */}
        <div className="hidden lg:flex w-1/2 bg-[#002366] flex-col items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-white/5" />
          <div className="absolute -bottom-32 -right-16 w-96 h-96 rounded-full bg-white/5" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-white/[0.02] border border-white/10" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-white/[0.03] border border-white/10" />
        </div>

        <div className="relative z-10 text-center max-w-md ">
          <div className="float-animation mb-8 inline-flex">
            <div className="flex h-80 w-80 items-center justify-center rounded-3xl  ">
              <img src={r1xchangeLogoWhiteWebView} alt="R1Xchange logo" className="hover:scale-[1.02] transition-transform duration-500" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4 leading-tight">
            Welcome Back to
            <br />
            <span className="text-white/70">R1Xchange</span>
          </h1>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex flex-1 items-center justify-center bg-gradient-to-br from-gray-50 via-white to-blue-50/30 p-6">
        <div className="w-full max-w-md animate-fade-in">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-xl">
              <img src={r1xchangeLogoBlackWebView} alt="R1Xchange logo" />
            </div>
          </div>

          <Card className="shadow-black shadow-xl border-0 ring-4 ring-[#000050]/90">
            <CardHeader className="space-y-2 pb-4">
              <CardTitle className="text-3xl text-black">Sign In</CardTitle>
              <CardDescription className="text-base text-black/70">
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-5"
                id="login-form"
              >
                {/* API Error */}
                {loginMutation.isError && (
                  <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600 animate-fade-in">
                    {getApiError(loginMutation.error)}
                  </div>
                )}

                {/* ID */}
                <div className="space-y-2 text-black">
                  <Label htmlFor="login-id" className="text-black">
                    ID
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#002366]/40" />
                    <Input
                      id="login-id"
                      type="text"
                      placeholder="Enter your ID"
                     className={`pl-10 transition-transform duration-200 focus:scale-105 ${
                        errors.id
                          ? "border-red-400 focus-visible:ring-red-300"
                          : "focus:p-2 m-0"
                          }`}
                      autoComplete="username"
                      {...register("id")}
                    />
                  </div>
                  {errors.id && (
                    <p className="text-xs text-red-500 animate-fade-in">
                      {errors.id.message}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="login-password" className="text-black">Password</Label>
                    <Link
                      to="/forgot-password"
                      className="text-xs text-[#002366] hover:underline font-medium"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#002366]/40" />
                    <Input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                     className={`pl-10 transition-transform duration-200 focus:scale-105 ${
                        errors.password
                          ? "border-red-400 focus-visible:ring-red-300"
                          : "focus:p-2 m-0"
                          }`}
                      autoComplete="current-password"
                      {...register("password")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#002366]/40 hover:text-[#002366] transition-colors"
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-xs text-red-500 animate-fade-in">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {/* Submit */}
                <Button
                  type="submit"
                  className=" group w-full h-12 text-base gap-2 bg-[#002366] hover:bg-[#002366]/85 text-white font-semibold flex items-center justify-center "
                  disabled={loginMutation.isPending}
                  id="login-submit"
                >
                  {loginMutation.isPending ? (
                    <>
                      <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign In
                      <ArrowRight className="h-4 w-4 " />
                    </>
                  )}
                </Button>

                {/* Having problems link */}
                <div className="mt-8 text-center">
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      toast.info("Please contact system administrator to retrieve your credentials.");
                    }}
                    className="text-sm font-semibold text-gray-500 hover:text-[#002366] transition-colors"
                  >
                    Having problems signing in?
                  </a>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>

    </>
  );
}

