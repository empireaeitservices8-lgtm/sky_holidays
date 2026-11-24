"use client";

import Image from "next/image";
import { useState } from "react";
import { Poppins } from "next/font/google";

/* ============ EDIT THESE ============ */
// Paste any image URL here (remote URLs need their host allowed in next.config -> images.remotePatterns),
// or put a file in /public/images/ and use a path like "/images/my-photo.jpg".
const AUTH_IMAGE_URL =
  "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=2000&q=80";
const BRAND_NAME = "voyger";
const BRAND_COLOR = "#3a6650"; // button + logo colour
const ACCOMMODATION = { place: "Garsia Village", name: "Villa Mexico" };
const DISTANCE = { value: "1,2 km", text: "left to your accommodation" };
const TRAIL_NAME = "Gringo Trail";
/* ==================================== */

const poppins = Poppins({ subsets: ["latin"], weight: ["400", "500", "600", "700"], display: "swap" });

type Mode = "register" | "login";

const AppleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M16.4 12.6c0-2.3 1.9-3.4 2-3.5-1.1-1.6-2.8-1.8-3.4-1.8-1.4-.1-2.8.9-3.5.9s-1.8-.8-3-.8c-1.5 0-3 .9-3.8 2.3-1.6 2.8-.4 7 1.2 9.3.8 1.1 1.7 2.4 2.900 2.3 1.2 0 1.6-.7 3-.7s1.8.7 3 .7c1.300 0 2.1-1.100 2.800-2.200.9-1.300 1.300-2.500 1.300-2.600-.1 0-2.500-1-2.500-3.900zM14.200 5.800c.6-.8 1.100-1.900 1-3-.9 0-2.100.6-2.700 1.400-.6.700-1.100 1.800-1 2.900 1.100.1 2.100-.5 2.700-1.300z" />
  </svg>
);
const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
    <path fill="#4285F4" d="M22.5 12.2c0-.8-.1-1.500-.2-2.200H12v4.200h5.900c-.3 1.400-1 2.500-2.200 3.300v2.700h3.500c2.1-1.900 3.300-4.700 3.300-8z" />
    <path fill="#34A853" d="M12 23c3 0 5.400-1 7.200-2.700l-3.500-2.700c-1 .7-2.200 1-3.700 1-2.800 0-5.300-1.900-6.100-4.500H2.3v2.800C4.100 20.500 7.800 23 12 23z" />
    <path fill="#FBBC05" d="M5.900 14.100c-.2-.7-.4-1.400-.4-2.1s.1-1.400.4-2.100V7.100H2.3C1.500 8.600 1 10.200 1 12s.5 3.400 1.300 4.900l3.600-2.800z" />
    <path fill="#EA4335" d="M12 5.400c1.6 0 3 .6 4.200 1.600l3.100-3.100C17.400 2.200 15 1 12 1 7.800 1 4.100 3.500 2.3 7.100l3.600 2.800C6.700 7.300 9.200 5.400 12 5.400z" />
  </svg>
);
const FacebookIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2" aria-hidden="true">
    <path d="M24 12a12 12 0 1 0-13.900 11.900v-8.400H7.100V12h3V9.400c0-3 1.8-4.700 4.500-4.700 1.300 0 2.700.2 2.700.2v3h-1.500c-1.500 0-2 .9-2 1.900V12h3.400l-.5 3.500h-2.900v8.400A12 12 0 0 0 24 12z" />
  </svg>
);
const EyeIcon = ({ off }: { off: boolean }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M2 12s3.600-7 10-7 10 7 10 7-3.600 7-10 7S2 12 2 12z" />
    <circle cx="12" cy="12" r="3" />
    {off && <path d="M3 3l18 18" />}
  </svg>
);
const HomeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 11 12 4l9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" />
  </svg>
);

export default function LoginRegisterPage() {
  const [mode, setMode] = useState<Mode>("register");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isRegister = mode === "register";
  const update = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    setError("");
  };

  const switchMode = (m: Mode) => {
    setMode(m);
    setError("");
    setShowPassword(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isRegister && !form.name.trim()) return setError("Please enter your full name.");
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return setError("Please enter a valid email address.");
    if (form.password.length < 6) return setError("Password must be at least 6 characters.");

    setLoading(true);
    try {
      // TODO: connect to your auth API, e.g.
      // await fetch(isRegister ? "/api/auth/register" : "/api/auth/login", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(form),
      // });
      console.log(isRegister ? "Register" : "Login", form);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSocial = (provider: "apple" | "google" | "facebook") => {
    // TODO: connect your OAuth provider, e.g. signIn(provider) from next-auth
    console.log("Social login:", provider);
  };

  const input =
    "w-full rounded-full bg-[#f2f2f2] px-5 py-3.5 text-sm text-neutral-900 outline-none ring-offset-2 transition placeholder:text-neutral-800 focus:ring-2 focus:ring-[var(--brand)]";

  return (
    <main
      className={`${poppins.className} relative isolate flex min-h-screen items-center justify-center overflow-hidden bg-[#2f4a3b] px-4 pb-8 pt-28 sm:px-8 sm:pt-32`}
      style={{ ["--brand" as string]: BRAND_COLOR }}
    >
      {/* Blurred full-page background */}
      <Image src={AUTH_IMAGE_URL} alt="" fill priority sizes="100vw" className="-z-20 scale-110 object-cover blur-md" />
      <div className="absolute inset-0 -z-10 bg-black/15" />

      <div className="grid w-full max-w-6xl overflow-hidden rounded-[2.5rem] bg-white p-2 shadow-2xl md:grid-cols-[1fr_1.35fr] md:p-3">
        {/* ---------- Form side ---------- */}
        <section className="flex flex-col items-center justify-center px-6 py-10 sm:px-12 md:py-14">
          <p className="text-xl font-semibold tracking-tight" style={{ color: BRAND_COLOR }}>{BRAND_NAME}</p>
          <h1 className="mt-5 text-center text-3xl font-bold leading-tight text-black sm:text-4xl">
            {isRegister ? <>Start your<br />perfect trip</> : <>Welcome back,<br />traveler</>}
          </h1>

          <div className="mt-9 flex items-center gap-1 rounded-full bg-[#f4f4f4] p-2.5">
            {([
              ["apple", "Continue with Apple", <AppleIcon key="a" />],
              ["google", "Continue with Google", <GoogleIcon key="g" />],
              ["facebook", "Continue with Facebook", <FacebookIcon key="f" />],
            ] as const).map(([p, label, icon]) => (
              <button key={p} type="button" aria-label={label} onClick={() => handleSocial(p)}
                className="grid h-11 w-14 place-items-center rounded-full transition hover:bg-white hover:shadow">
                {icon}
              </button>
            ))}
          </div>

          <p className="my-4 text-xs text-neutral-700">or</p>

          <form onSubmit={handleSubmit} noValidate className="w-full max-w-xs space-y-3">
            {isRegister && (
              <input type="text" placeholder="Full name" value={form.name} onChange={update("name")} autoComplete="name" aria-label="Full name" className={input} />
            )}
            <input type="email" placeholder="Email" value={form.email} onChange={update("email")} autoComplete="email" aria-label="Email" className={input} />
            <div className="relative">
              <input type={showPassword ? "text" : "password"} placeholder="Password" value={form.password} onChange={update("password")}
                autoComplete={isRegister ? "new-password" : "current-password"} aria-label="Password" className={`${input} pr-12`} />
              <button type="button" onClick={() => setShowPassword((s) => !s)} aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-800 transition hover:text-black">
                <EyeIcon off={showPassword} />
              </button>
            </div>

            {error && <p role="alert" className="px-2 text-xs text-red-600">{error}</p>}

            <button type="submit" disabled={loading}
              className="mt-2 w-full rounded-full py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:brightness-110 disabled:opacity-60"
              style={{ background: BRAND_COLOR }}>
              {loading ? "Please wait..." : isRegister ? "Start" : "Log in"}
            </button>
          </form>

          <p className="mt-6 text-sm text-neutral-800">
            {isRegister ? "Already have an account? " : "New here? "}
            <button type="button" onClick={() => switchMode(isRegister ? "login" : "register")} className="font-semibold text-black hover:underline">
              {isRegister ? "Log in" : "Sign up"}
            </button>
          </p>
        </section>

        {/* ---------- Image side ---------- */}
        <section className="relative hidden min-h-[560px] overflow-hidden rounded-[2rem] md:block">
          <Image src={AUTH_IMAGE_URL} alt="Scenic trail through green hills" fill priority sizes="(min-width: 768px) 55vw, 0px" className="object-cover" />

          {/* Accommodation pin */}
          <div className="absolute left-[12%] top-[12%] flex flex-col items-start">
            <span className="ml-[0.1rem] h-2.5 w-2.5 rounded-full bg-white/80 ring-4 ring-white/30" />
            <span className="ml-[0.4rem] h-16 w-px bg-white/70" />
            <div className="flex items-center gap-3 rounded-full bg-white/30 py-2 pl-2 pr-6 text-white backdrop-blur-md">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-white/30"><HomeIcon /></span>
              <span className="leading-tight">
                <span className="block text-xs text-white/85">{ACCOMMODATION.place}</span>
                <span className="block text-sm font-semibold">{ACCOMMODATION.name}</span>
              </span>
            </div>
          </div>

          {/* Distance card */}
          <div className="absolute right-[6%] top-[33%] w-44 rounded-2xl bg-white/30 p-4 text-white backdrop-blur-md">
            <p className="text-sm font-semibold">{DISTANCE.value}</p>
            <p className="mt-1 text-xs leading-snug text-white/90">{DISTANCE.text}</p>
          </div>

          {/* Trail label */}
          <div className="absolute bottom-[8%] left-[48%] flex -translate-x-1/2 flex-col items-center">
            <span className="rounded-full bg-white/90 px-5 py-2 text-sm font-medium text-neutral-900 shadow">{TRAIL_NAME}</span>
            <span className="h-10 w-px bg-white/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/90 ring-4 ring-white/30" />
          </div>
        </section>
      </div>
    </main>
  );
}