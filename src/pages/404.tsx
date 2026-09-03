import { ArrowLeft, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/r1xchangeLogoWhiteWebView.svg";

export default function NotF() {
  const navigate = useNavigate();

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#002366] flex items-center justify-center px-6">
      {/* ================= Background Pattern ================= */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-15 animate-[moveRight_10s_both_infinite_alternate_ease]">
        <div className="grid grid-cols-6 gap-2 rotate-[-10deg] scale-125">
            {Array.from({ length: 100 }).map((_, i) => (
            <img
                key={i}
                src={logo}
                alt="r1xchange logo"
                className="h-15 w-15 object-contain"
            />
            ))}
        </div>
    </div>

      {/* ================= Card ================= */}

      <div className="relative z-10 w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 text-center shadow-2xl backdrop-blur-md">

        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-white/40">
          Error
        </p>

        <p className="text-lg font-medium text-white/80">
          YOU HAVE ARRIVED AT A WRONG PLACE
        </p>

        <h1 className="mt-4 text-8xl font-black tracking-tight text-white">
          404
        </h1>

        <h2 className="mt-4 text-3xl font-semibold text-red-500">
          Page not found
        </h2>

        <p className="mt-4 text-base leading-7 text-white/60">
          Sorry, the page you’re looking for doesn’t exist or has been moved.
        </p>

        <div className="mt-8 flex items-center justify-center gap-3">

          <button
            onClick={() => navigate("/home/dashboard")}
            className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-gray-200"
          >
            <Home className="h-4 w-4" />
            Go home
          </button>

          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4" />
            Go back
          </button>

        </div>

      </div>

    </main>
  );
}