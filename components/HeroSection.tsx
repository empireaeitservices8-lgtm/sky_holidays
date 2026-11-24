"use client";

/* eslint-disable @next/next/no-img-element */

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
} from "react";
import { Bebas_Neue, Inter } from "next/font/google";
import Icon from "./Icon";
// import Navbar from "./Navbar";

/* -------------------------------------------------------------------------- */
/*  Fonts                                                                     */
/* -------------------------------------------------------------------------- */

const bebas = Bebas_Neue({ weight: "400", subsets: ["latin"], display: "swap" });
const inter = Inter({ subsets: ["latin"], display: "swap" });

/* -------------------------------------------------------------------------- */
/*  Data                                                                      */
/*  To use your own images later, drop them in /public/destinations and       */
/*  change `image` and `thumb` to e.g. "/destinations/saint-antonien.jpg".    */
/* -------------------------------------------------------------------------- */

interface Destination {
  id: string;
  /** Small label above the title and on the card */
  location: string;
  /** Full name, used on the cards */
  name: string;
  /** Big hero title, split into two lines */
  titleLines: [string, string];
  description: string;
  /** Full-screen background image */
  image: string;
  /** Card image */
  thumb: string;
  /** Shown behind the image if it fails to load */
  fallback: string;
}

const unsplash = (photoId: string, width: number) =>
  `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=${width}&q=80`;

const destinations: Destination[] = [
  {
    id: "saint-antonien",
    location: "Switzerland Alps",
    name: "Saint Antönien",
    titleLines: ["Saint", "Antönien"],
    description:
      "Mountain adventure above the clouds. Ride high alpine trails, cross green valleys and sleep in quiet villages beneath the peaks.",
    image: unsplash("photo-1464822759023-fed622ff2c3b", 1920),
    thumb: unsplash("photo-1464822759023-fed622ff2c3b", 500),
    fallback: "linear-gradient(135deg,#2f4b3a,#101b16)",
  },
  {
    id: "nagano",
    location: "Japan Alps",
    name: "Nagano Prefecture",
    titleLines: ["Nagano", "Prefecture"],
    description:
      "Hot springs, snow monkeys and misty mountain valleys. Slow down in the heart of Japan and soak in the winter calm.",
    image: unsplash("photo-1493976040374-85c8e12f0c0e", 1920),
    thumb: unsplash("photo-1493976040374-85c8e12f0c0e", 500),
    fallback: "linear-gradient(135deg,#5b7a8c,#1c2a33)",
  },
  {
    id: "marrakech",
    location: "Sahara Desert · Morocco",
    name: "Marrakech Merzouga",
    titleLines: ["Marrakech", "Merzouga"],
    description:
      "Golden dunes, camel caravans and starry desert camps. Travel from the lively souks of Marrakech to the edge of the Sahara.",
    image: unsplash("photo-1509316785289-025f5b846b35", 1920),
    thumb: unsplash("photo-1509316785289-025f5b846b35", 500),
    fallback: "linear-gradient(135deg,#c98f68,#6b3f27)",
  },
  {
    id: "yosemite",
    location: "Sierra Nevada · USA",
    name: "Yosemite National Park",
    titleLines: ["Yosemite", "National Park"],
    description:
      "Granite cliffs, giant waterfalls and ancient sequoias. Hike to the viewpoints that made Yosemite famous around the world.",
    image: unsplash("photo-1469474968028-56623f02e42e", 1920),
    thumb: unsplash("photo-1469474968028-56623f02e42e", 500),
    fallback: "linear-gradient(135deg,#59666b,#1a2022)",
  },
  {
    id: "los-angeles-beach",
    location: "California · USA",
    name: "Los Angeles Beach",
    titleLines: ["Los Angeles", "Beach"],
    description:
      "Sunny coastline, surf breaks and golden sunsets. Spend your days on the sand and your evenings on the pier.",
    image: unsplash("photo-1507525428034-b723cf961d3e", 1920),
    thumb: unsplash("photo-1507525428034-b723cf961d3e", 500),
    fallback: "linear-gradient(135deg,#3a7ca5,#12303f)",
  },
];

/* -------------------------------------------------------------------------- */
/*  Config                                                                    */
/* -------------------------------------------------------------------------- */

const AUTOPLAY_MS = 1000; // time before auto-advancing
const TRANSITION_MS = 1000; // card -> full screen expansion
const TEXT_OUT_MS = 320; // how long the old text takes to leave
const TEXT_SWAP_MS = 420; // swap only after the old text is fully gone
const EASE = "cubic-bezier(0.77, 0, 0.18, 1)";
const EASE_OUT_FAST = "cubic-bezier(0.4, 0, 1, 1)"; // quick exit for the old text
const ACCENT = "#f5a623";

/* -------------------------------------------------------------------------- */
/*  Small helpers                                                             */
/* -------------------------------------------------------------------------- */

const DESKTOP_QUERY = "(min-width: 1024px)";

function subscribeDesktop(onChange: () => void) {
  const mq = window.matchMedia(DESKTOP_QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

function getDesktop() {
  return window.matchMedia(DESKTOP_QUERY).matches;
}

const pad = (n: number) => String(n).padStart(2, "0");

interface IncomingLayer {
  /** index in `destinations` */
  index: number;
  /** "card": expands from the card, "fade": simple cross-fade (used for Prev) */
  mode: "card" | "fade";
  /** starting clip-path (card position) */
  from: string;
  /** flips to true one frame later to start the CSS transition */
  go: boolean;
}

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

export default function HeroSection() {
  const total = destinations.length;

  // order[0] is the active destination, order[1..] are the upcoming cards
  const [order, setOrder] = useState<number[]>(() =>
    destinations.map((_, i) => i)
  );
  const [textIndex, setTextIndex] = useState(0);
  const [textVisible, setTextVisible] = useState(true);
  const [incoming, setIncoming] = useState<IncomingLayer | null>(null);
  const [hiding, setHiding] = useState<number[]>([]);
  const [shiftPx, setShiftPx] = useState(0);
  const [busy, setBusy] = useState(false);
  const [paused, setPaused] = useState(false);
  const [progressRun, setProgressRun] = useState(false);

  const isDesktop = useSyncExternalStore(subscribeDesktop, getDesktop, () => false);

  const sectionRef = useRef<HTMLElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const busyRef = useRef(false);
  const timers = useRef<number[]>([]);

  const current = destinations[textIndex];
  const upcoming = order.slice(1);

  /* ------------------------------ transitions ------------------------------ */

  const transitionTo = useCallback(
    (direction: "next" | "prev", cardPos = 0) => {
      if (busyRef.current) return;
      busyRef.current = true;
      setBusy(true);
      setProgressRun(false);

      const rotateBy = direction === "next" ? cardPos + 1 : total - 1;
      const newOrder = [...order.slice(rotateBy), ...order.slice(0, rotateBy)];
      const target = newOrder[0];

      // Start the expansion from the clicked card's exact position
      let mode: IncomingLayer["mode"] = "fade";
      let from = "";
      const cardEl = direction === "next" ? cardRefs.current[cardPos] : null;
      const sectionEl = sectionRef.current;
      if (cardEl && sectionEl) {
        const c = cardEl.getBoundingClientRect();
        const s = sectionEl.getBoundingClientRect();
        const top = Math.max(0, c.top - s.top);
        const left = Math.max(0, c.left - s.left);
        const right = Math.max(0, s.right - c.right);
        const bottom = Math.max(0, s.bottom - c.bottom);
        from = `inset(${top}px ${right}px ${bottom}px ${left}px round 16px)`;
        mode = "card";
      }

      // How far the remaining cards slide left (desktop only)
      let step = 0;
      if (isDesktop && direction === "next") {
        const a = cardRefs.current[0];
        const b = cardRefs.current[1];
        step = a && b ? b.offsetLeft - a.offsetLeft : 0;
      }

      setIncoming({ index: target, mode, from, go: false });
      setHiding(direction === "next" ? order.slice(1, cardPos + 2) : order.slice(1));
      setShiftPx(step * (cardPos + 1));

      // 1) Old text leaves (all of it, quickly)
      setTextVisible(false);

      // Two frames later, start the CSS transition
      requestAnimationFrame(() =>
        requestAnimationFrame(() =>
          setIncoming((prev) => (prev ? { ...prev, go: true } : prev))
        )
      );

      // 2) Only once the old text is fully gone: swap the content and
      //    let the new text come in
      timers.current.push(
        window.setTimeout(() => {
          setTextIndex(target);
          setTextVisible(true);
        }, TEXT_SWAP_MS)
      );

      timers.current.push(
        window.setTimeout(() => {
          setOrder(newOrder);
          setIncoming(null);
          setHiding([]);
          setShiftPx(0);
          setBusy(false);
          busyRef.current = false;
          stripRef.current?.scrollTo({ left: 0 });
        }, TRANSITION_MS + 60)
      );
    },
    [order, total, isDesktop]
  );

  const goNext = () => transitionTo("next", 0);
  const goPrev = () => transitionTo("prev");

  // Autoplay (also drives the orange bar at the top)
  useEffect(() => {
    if (busy || paused) return;
    const raf = requestAnimationFrame(() =>
      requestAnimationFrame(() => setProgressRun(true))
    );
    const id = window.setTimeout(() => transitionTo("next", 0), AUTOPLAY_MS);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(id);
    };
  }, [busy, paused, transitionTo]);

  // Clear pending timers on unmount
  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach((t) => window.clearTimeout(t));
  }, []);

  /* --------------------------------- styles -------------------------------- */

  const revealClass = textVisible
    ? "translate-y-0 opacity-100"
    : "translate-y-5 opacity-0";

  // In: slower and staggered. Out: fast and all at once.
  const revealStyle = (i: number): CSSProperties => ({
    transitionDuration: textVisible ? "600ms" : `${TEXT_OUT_MS}ms`,
    transitionDelay: textVisible ? `${150 + i * 90}ms` : "0ms",
  });

  /* --------------------------------- render -------------------------------- */

  return (
    <section
      ref={sectionRef}
      className={`${inter.className} relative h-[100svh] min-h-[680px] w-full overflow-hidden bg-neutral-900 text-white`}
    >
      {/* ---------- Background layers (all preloaded, only opacity toggles) ---------- */}
      {destinations.map((d, i) => (
        <div
          key={d.id}
          className="absolute inset-0"
          style={{ background: d.fallback, opacity: i === order[0] ? 1 : 0 }}
        >
          <img
            src={d.image}
            alt={i === order[0] ? d.name : ""}
            draggable={false}
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
            className="h-full w-full scale-105 object-cover"
          />
        </div>
      ))}

      {/* ---------- Incoming layer: expands from the card to full screen ---------- */}
      {incoming && (
        <div
          className="absolute inset-0 z-10"
          style={{
            background: destinations[incoming.index].fallback,
            clipPath:
              incoming.mode === "card"
                ? incoming.go
                  ? "inset(0px 0px 0px 0px round 0px)"
                  : incoming.from
                : undefined,
            opacity: incoming.mode === "fade" ? (incoming.go ? 1 : 0) : 1,
            transition: `clip-path ${TRANSITION_MS}ms ${EASE}, opacity ${TRANSITION_MS}ms ease`,
          }}
        >
          <img
            src={destinations[incoming.index].image}
            alt=""
            draggable={false}
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
            className="h-full w-full object-cover"
            style={{
              transform: `scale(${incoming.go ? 1.05 : 1.3})`,
              transition: `transform ${TRANSITION_MS}ms ${EASE}`,
            }}
          />
        </div>
      )}

      {/* ---------- Dark gradient overlays for readability ---------- */}
      <div
        className="pointer-events-none absolute inset-0 z-20"
        style={{
          background:
            "linear-gradient(90deg, rgba(0,0,0,0.62) 0%, rgba(0,0,0,0.25) 45%, rgba(0,0,0,0.08) 100%), linear-gradient(180deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0) 28%, rgba(0,0,0,0) 60%, rgba(0,0,0,0.5) 100%)",
        }}
      />

      {/* ---------- Autoplay progress bar (top) ---------- */}
      <div className="absolute left-0 top-0 z-40 h-[3px] w-full bg-white/10">
        <div
          className="h-full"
          style={{
            background: ACCENT,
            width: progressRun ? "100%" : "0%",
            transition: progressRun ? `width ${AUTOPLAY_MS}ms linear` : "none",
          }}
        />
      </div>

      {/* ---------- Navigation (separate component) ---------- */}
      {/* <Navbar /> */}

      {/* ---------- Main content ---------- */}
      <div className="absolute inset-0 z-30 flex flex-col justify-end gap-6 px-6 pb-8 pt-28 md:px-12 lg:flex-row lg:items-end lg:gap-10 lg:pb-14">
        {/* Left: destination info */}
        <div className="lg:w-[40%] lg:pb-14">
          <div
            className={`mb-3 h-[2px] w-6 bg-white transition-all ${revealClass}`}
            style={revealStyle(0)}
          />
          <p
            className={`mb-3 text-base font-light text-white/90 transition-all sm:text-lg ${revealClass}`}
            style={revealStyle(1)}
          >
            {current.location}
          </p>

          <h1
            className={`${bebas.className} text-6xl uppercase leading-[0.95] tracking-wide sm:text-7xl lg:text-8xl`}
          >
            {current.titleLines.map((line, i) => (
              <span key={i} className="block overflow-hidden pt-[0.06em]">
                <span
                  className="block"
                  style={{
                    transform: textVisible ? "translateY(0)" : "translateY(110%)",
                    transition: `transform ${textVisible ? 700 : TEXT_OUT_MS}ms ${
                      textVisible ? EASE : EASE_OUT_FAST
                    }`,
                    transitionDelay: textVisible ? `${200 + i * 110}ms` : "0ms",
                  }}
                >
                  {line}
                </span>
              </span>
            ))}
          </h1>

          <p
            className={`mt-4 max-w-sm text-xs leading-relaxed text-white/70 transition-all sm:text-[13px] ${revealClass}`}
            style={revealStyle(4)}
          >
            {current.description}
          </p>

          <div
            className={`mt-6 flex items-center gap-3 transition-all ${revealClass}`}
            style={revealStyle(5)}
          >
            <span
              className="flex h-9 w-9 items-center justify-center rounded-full text-white shadow-lg"
              style={{ background: ACCENT }}
              aria-hidden="true"
            >
              <Icon className="h-4 w-4">
                <path d="M6 3h12v18l-6-4-6 4z" />
              </Icon>
            </span>
            <button className="rounded-full border border-white/40 px-5 py-2.5 text-[10px] font-semibold uppercase tracking-[0.2em] transition hover:bg-white hover:text-black">
              Explore Destination
            </button>
          </div>
        </div>

        {/* Right: cards + controls */}
        <div
          className="min-w-0 lg:-mr-12 lg:flex-1"
          onMouseEnter={() => {
            setPaused(true);
            setProgressRun(false);
          }}
          onMouseLeave={() => setPaused(false)}
        >
          {/* Cards (horizontal scroll on mobile / tablet) */}
          <div
            ref={stripRef}
            className="-my-4 overflow-x-auto py-4 [scrollbar-width:none] lg:overflow-hidden [&::-webkit-scrollbar]:hidden"
          >
            <div
              className="flex w-max gap-3 pr-6 lg:gap-4 lg:pr-12"
              style={{
                transform: isDesktop ? `translateX(-${shiftPx}px)` : undefined,
                transition: busy ? `transform ${TRANSITION_MS - 100}ms ${EASE}` : "none",
              }}
            >
              {upcoming.map((destIndex, pos) => {
                const d = destinations[destIndex];
                return (
                  <button
                    key={d.id}
                    ref={(el) => {
                      cardRefs.current[pos] = el;
                    }}
                    onClick={() => transitionTo("next", pos)}
                    aria-label={`Go to ${d.name}`}
                    className="group relative h-[200px] w-[136px] shrink-0 overflow-hidden rounded-2xl text-left shadow-[0_18px_40px_-12px_rgba(0,0,0,0.7)] transition-[transform,opacity] duration-500 hover:-translate-y-2 hover:scale-[1.03] sm:h-[240px] sm:w-[164px] lg:h-[280px] lg:w-[190px] xl:h-[310px] xl:w-[210px]"
                    style={{
                      background: d.fallback,
                      opacity: hiding.includes(destIndex) ? 0 : 1,
                    }}
                  >
                    <img
                      src={d.thumb}
                      alt=""
                      draggable={false}
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(180deg, rgba(0,0,0,0) 45%, rgba(0,0,0,0.75) 100%)",
                      }}
                    />
                    <div className="absolute inset-x-0 bottom-0 p-3.5 lg:p-4">
                      <span className="mb-2 block h-[2px] w-4 bg-white/90" />
                      <span className="block text-[10px] font-light text-white/80">
                        {d.location}
                      </span>
                      <span
                        className={`${bebas.className} mt-0.5 block text-xl uppercase leading-[1] tracking-wide lg:text-2xl`}
                      >
                        {d.name}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Controls: prev / next, progress line, slide number */}
          <div className="mt-6 flex items-center gap-4 lg:mt-8">
            <div className="flex items-center gap-3">
              <button
                onClick={goPrev}
                aria-label="Previous destination"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/40 backdrop-blur-sm transition hover:scale-105 hover:bg-white hover:text-black"
              >
                <Icon>
                  <path d="m15 18-6-6 6-6" />
                </Icon>
              </button>
              <button
                onClick={goNext}
                aria-label="Next destination"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/40 backdrop-blur-sm transition hover:scale-105 hover:bg-white hover:text-black"
              >
                <Icon>
                  <path d="m9 18 6-6-6-6" />
                </Icon>
              </button>
            </div>

            <div className="relative h-px flex-1 bg-white/30">
              <div
                className="absolute left-0 top-0 h-[2px] -translate-y-1/2"
                style={{
                  background: ACCENT,
                  width: `${((textIndex + 1) / total) * 100}%`,
                  transition: `width 800ms ${EASE}`,
                }}
              />
            </div>

            <div
              className={`${bebas.className} flex items-baseline gap-1 pr-6 leading-none lg:pr-12`}
            >
              <span className="text-5xl tracking-wide lg:text-6xl">
                {pad(textIndex + 1)}
              </span>
              <span className="text-sm text-white/50">/ {pad(total)}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}