"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Bebas_Neue, Inter } from "next/font/google";
import { MapPin } from "lucide-react"; // swap for any other lucide icon, e.g. Compass, Luggage, Backpack, Globe

const bebas = Bebas_Neue({ weight: "400", subsets: ["latin"], display: "swap" });
const inter = Inter({ subsets: ["latin"], display: "swap" });

/* ========================================================================== */
/*  EDIT HERE                                                                  */
/* ========================================================================== */

const BRAND = "Your Travel Brand";
const TAGLINE = "Packing your bags";

const NAVY = "#0f2747";
const GOLD = "#C9A25B";
const CORAL = "#F07850";
const CREAM = "#F5EFE7";

const MIN_MS = 2200; // the preloader always shows at least this long
const MAX_MS = 7000; // safety: never block the site longer than this
const ONCE_PER_SESSION = false; // true = show only on the first visit of a browser session
const SESSION_KEY = "preloader-seen";

/* ========================================================================== */
/*  Route geometry (SVG space is 400 x 160)                                    */
/* ========================================================================== */

const W = 400;
const H = 160;
const P0 = { x: 20, y: 135 };
const P1 = { x: 200, y: -40 };
const P2 = { x: 380, y: 135 };
const ROUTE = `M${P0.x} ${P0.y} Q${P1.x} ${P1.y} ${P2.x} ${P2.y}`;

/** Point on the curve at t (0 to 1). */
function onRoute(t: number) {
  const a = (1 - t) * (1 - t);
  const b = 2 * (1 - t) * t;
  const c = t * t;
  return {
    x: a * P0.x + b * P1.x + c * P2.x,
    y: a * P0.y + b * P1.y + c * P2.y,
  };
}

/* ========================================================================== */
/*  Component                                                                  */
/* ========================================================================== */

export default function Preloader() {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const reduce = useReducedMotion();
  const loadedRef = useRef(false);

  // Progress eases towards 90% while loading, then to 100% once the page has
  // loaded and the minimum time has passed.
  useEffect(() => {
    if (ONCE_PER_SESSION && sessionStorage.getItem(SESSION_KEY)) {
      setVisible(false);
      return;
    }

    const start = performance.now();
    let raf = 0;
    let value = 0;
    let closing = 0;

    const markLoaded = () => {
      loadedRef.current = true;
    };
    if (document.readyState === "complete") markLoaded();
    else window.addEventListener("load", markLoaded);
    const failsafe = window.setTimeout(markLoaded, MAX_MS);

    const tick = (now: number) => {
      const elapsed = now - start;
      const ready = loadedRef.current && elapsed >= MIN_MS;
      const target = ready ? 100 : Math.min(90, (elapsed / MIN_MS) * 90);
      value += (target - value) * 0.07;
      setProgress(value);

      if (ready && value > 99.4) {
        setProgress(100);
        if (ONCE_PER_SESSION) sessionStorage.setItem(SESSION_KEY, "1");
        closing = window.setTimeout(() => setVisible(false), 450);
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(failsafe);
      window.clearTimeout(closing);
      window.removeEventListener("load", markLoaded);
    };
  }, []);

  // Lock page scroll while the preloader is on screen
  useEffect(() => {
    if (!visible) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [visible]);

  const marker = onRoute(progress / 100);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="preloader"
          role="status"
          aria-live="polite"
          aria-label="Loading"
          className={`${inter.className} fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden px-6 text-white`}
          style={{ background: NAVY }}
          initial={{ y: 0, opacity: 1 }}
          exit={
            reduce
              ? { opacity: 0, transition: { duration: 0.4 } }
              : { y: "-100%", transition: { duration: 0.9, ease: [0.76, 0, 0.24, 1] } }
          }
        >
          {/* Brand name */}
          <motion.h1
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className={`${bebas.className} text-center text-5xl uppercase leading-none tracking-[0.12em] sm:text-7xl`}
            style={{ color: CREAM }}
          >
            {BRAND}
          </motion.h1>

          {/* Pin travelling along the dotted route */}
          <div className="relative mt-10 w-full max-w-[460px]" style={{ aspectRatio: `${W} / ${H}` }}>
            <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full overflow-visible" fill="none" aria-hidden="true">
              <defs>
                {/* Reveals the bright trail as the pin passes (the curve only ever moves right) */}
                <clipPath id="preloader-trail">
                  <rect x="0" y="-60" width={marker.x} height={H + 120} />
                </clipPath>
              </defs>
              {/* Faint full route */}
              <path d={ROUTE} stroke="white" strokeOpacity="0.2" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="1 11" />
              {/* Bright route behind the pin */}
              <path d={ROUTE} stroke={GOLD} strokeWidth="3" strokeLinecap="round" strokeDasharray="1 11" clipPath="url(#preloader-trail)" />
              {/* Start and end points */}
              <circle cx={P0.x} cy={P0.y} r="5" fill={GOLD} />
              <circle cx={P2.x} cy={P2.y} r="5" fill="none" stroke={GOLD} strokeWidth="2" />
            </svg>

            {/* The pin's tip sits on the route, so it is shifted up by its own height */}
            <span
              aria-hidden="true"
              className="absolute grid h-10 w-10 place-items-center"
              style={{
                left: `${(marker.x / W) * 100}%`,
                top: `${(marker.y / H) * 100}%`,
                transform: "translate(-50%, -92%)",
                color: "#fff",
              }}
            >
              <MapPin className="h-10 w-10 drop-shadow-lg" fill={CORAL} strokeWidth={1.5} />
            </span>
          </div>

          <p className="mt-6 text-sm text-white/70">{TAGLINE}</p>

          {/* Thin progress line along the bottom */}
          <div className="absolute inset-x-0 bottom-0 h-[3px] bg-white/10">
            <div className="h-full" style={{ width: `${progress}%`, background: CORAL }} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}