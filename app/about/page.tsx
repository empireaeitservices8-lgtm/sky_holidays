"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Playfair_Display, Inter, Caveat } from "next/font/google";
import { Compass, MapPin, Plane } from "lucide-react";

const heading = Playfair_Display({ subsets: ["latin"], weight: ["500", "600"], style: ["normal", "italic"], display: "swap" });
const body = Inter({ subsets: ["latin"], weight: ["400", "500", "600"], display: "swap" });
const hand = Caveat({ subsets: ["latin"], weight: ["500", "600"], display: "swap" });

/* ========================================================================== */
/*  EDIT EVERYTHING HERE                                                       */
/* ========================================================================== */

const BRAND = "Your Travel Brand";
const CITY = "Kochi, Kerala";

// Photos: replace any URL with your own image (full URL, or a path like "/images/about/team.jpg").
// If a photo fails to load, a soft colour block is shown instead, so nothing looks broken.
const u = (id: string, w = 1200) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

/**
 * HERO IMAGE
 * The hero image URL is picked in this order:
 *   1. the `heroImage` prop      <AboutPage heroImage="https://..." />
 *   2. the env variable          NEXT_PUBLIC_ABOUT_HERO_URL (in .env.local or your hosting dashboard)
 *   3. DEFAULT_HERO below        (used if nothing is set, or if the URL fails to load)
 *
 * Remember: the image's domain must be allowed in next.config.js under images.remotePatterns.
 * Local images such as "/images/about-hero.jpg" (inside /public) work without any config.
 */
const DEFAULT_HERO = "/images/about2.png";

const CTA_IMAGE = u("photo-1570077188670-e3a8d69ac5ff", 2400);

// Light world map behind the polaroids (optional – leave "" to hide)
const WORLD_MAP = "https://upload.wikimedia.org/wikipedia/commons/8/80/World_map_-_low_resolution.svg";

// Colours
const CREAM = "#F7F3EE";
const INK = "#3b2a20";
const NAVY = "#0f2747";
const GOLD = "#C9A25B";
const CORAL = "#F07850";
const FOREST = "#2f4a3b";

// SAMPLE numbers – replace with your real ones
const STATS = [
  { value: "10+", label: "Years of experience" },
  { value: "5,000+", label: "Happy travelers" },
  { value: "50+", label: "Destinations" },
  { value: "24/7", label: "Support" },
];

const PALETTE = [CORAL, "#D9B26B", "#F1E5CF", "#3a6650", INK];

// Collage photos in "Our story"
const COLLAGE = [
  { src: u("photo-1602216056096-3b40cc0c9944"), alt: "Kerala backwaters" },
  { src: u("photo-1564507592333-c60657eea523"), alt: "Taj Mahal" },
  { src: u("photo-1477587458883-47145ed94245"), alt: "Jaipur" },
  { src: u("photo-1626621341517-bbf3d9990a23"), alt: "Himalayas" },
];

// Postcards ("What we stand for")
const POSTCARDS = [
  { title: "PERSONALISED PLANNING", text: "Every trip is built around you: your pace, your budget, your dream stops.", src: u("photo-1561134643-668f9057cce4"), border: "#7a2e1d", stamp: "#c8693f" },
  { title: "LOCAL EXPERTS", text: "Guides and partners who live where you're headed and know the hidden corners.", src: u("photo-1537996194471-e657df975ab4"), border: "#d9a21b", stamp: "#d9a21b" },
  { title: "ALWAYS BY YOUR SIDE", text: "Real people, day and night, from the first enquiry to the trip home.", src: u("photo-1531366936337-7c912a4589a7"), border: "#1f4a6b", stamp: "#5b7f96" },
];

// Polaroids on the map. x / y = position in % (top-left corner of the polaroid), r = tilt in degrees
const PLACES = [
  { name: "Banff, Canada", src: u("photo-1561134643-668f9057cce4", 600), x: 3, y: 36, r: -4 },
  { name: "Kyoto, Japan", src: u("photo-1493976040374-85c8e12f0c0e", 600), x: 22, y: 3, r: 3 },
  { name: "Amalfi Coast, Italy", src: u("photo-1534113414509-0eec2bfb493f", 600), x: 40, y: 36, r: -2 },
  { name: "Phi Phi Islands, Thailand", src: u("photo-1552465011-b4e21bf6e79a", 600), x: 58, y: 3, r: 3 },
  { name: "Singapore", src: u("photo-1525625293386-3f8f99389edd", 600), x: 79, y: 34, r: 4 },
  { name: "Machu Picchu, Peru", src: u("photo-1526392060635-9d6019884377", 600), x: 5, y: 68, r: -5 },
  { name: "Sahara Desert, Morocco", src: u("photo-1509316785289-025f5b846b35", 600), x: 23, y: 66, r: 2 },
  { name: "Bali, Indonesia", src: u("photo-1537996194471-e657df975ab4", 600), x: 42, y: 68, r: -3 },
  { name: "Queenstown, New Zealand", src: u("photo-1507699622108-4be3abd695ad", 600), x: 80, y: 67, r: 3 },
  { name: "Lake Bled, Slovenia", src: u("photo-1561042122-f7c1b5e8bd1b", 600), x: 61, y: 64, r: -2 },
];

const EASE = [0.22, 1, 0.36, 1] as const;

/* ========================================================================== */
/*  Small pieces                                                               */
/* ========================================================================== */

/** Image that falls back to a soft colour block if the URL fails. Parent must be `relative`. */
function Photo({ src, alt, sizes = "50vw" }: { src: string; alt: string; sizes?: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return <div role="img" aria-label={alt} className="absolute inset-0 bg-gradient-to-br from-[#d8c3a5] to-[#8aa6b8]" />;
  }
  return <Image src={src} alt={alt} fill sizes={sizes} className="object-cover" onError={() => setFailed(true)} />;
}

function Polaroid({ n, name, src, className = "", style }: { n: number; name: string; src: string; className?: string; style?: React.CSSProperties }) {
  return (
    <figure className={`bg-white p-2 pb-3 shadow-[0_12px_30px_rgba(15,39,71,0.22)] transition duration-300 hover:z-20 hover:scale-105 ${className}`} style={style}>
      <div className="relative aspect-[4/5] overflow-hidden">
        <Photo src={src} alt={name} sizes="(min-width:768px) 16vw, 45vw" />
      </div>
      <figcaption className={`${hand.className} mt-2 text-center text-base leading-tight text-neutral-700 lg:text-lg`}>
        {n}. {name}
      </figcaption>
    </figure>
  );
}

function Postcard({ p, index }: { p: (typeof POSTCARDS)[number]; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: index * 0.12, ease: EASE }}
      className="group transition duration-300 hover:-translate-y-2"
    >
      <div className="relative aspect-[3/2] overflow-hidden rounded-2xl border-[6px] shadow-xl" style={{ borderColor: p.border }}>
        <Photo src={p.src} alt={p.title} sizes="(min-width:768px) 30vw, 90vw" />
      </div>
      <div className="mt-4 rounded-2xl bg-[#e9dfcc] p-5 text-[#2a2118] shadow-xl">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className={`${heading.className} text-sm italic`}>Greetings from</p>
            <p className="mt-1 text-[13px] font-bold leading-tight tracking-wider">{p.title}</p>
            <p className="mt-1 text-[10px] tracking-widest">★★★★★</p>
            <p className={`${heading.className} mt-3 text-sm italic`}>Wish you were here!</p>
          </div>
          <div className="relative border-l border-[#2a2118]/30 pl-4">
            <span className="absolute right-0 top-0 grid h-10 w-8 place-items-center border-2 border-dashed text-[7px] font-semibold uppercase leading-none text-white/90" style={{ background: p.stamp, borderColor: "rgba(255,255,255,0.6)" }}>
              Place<br />stamp
            </span>
            <p className="mt-12 text-xs leading-relaxed text-[#2a2118]/80">{p.text}</p>
          </div>
        </div>
        <p className="mt-4 border-t border-[#2a2118]/20 pt-2 text-[9px] uppercase tracking-widest text-[#2a2118]/60">
          {BRAND} · {CITY}
        </p>
      </div>
    </motion.article>
  );
}

/* ========================================================================== */
/*  Page                                                                       */
/* ========================================================================== */

export default function AboutPage({ heroImage }: { heroImage?: string }) {
  // Hero image: prop → env variable → default. Falls back to the default if the URL fails to load.
  const [heroFailed, setHeroFailed] = useState(false);
  const heroSrc = (!heroFailed && (heroImage || process.env.NEXT_PUBLIC_ABOUT_HERO_URL)) || DEFAULT_HERO;

  // Route (dotted line) between polaroid centres, in order
  const centres = PLACES.map((p) => ({ x: p.x + 8, y: p.y + 15 }));
  const segments = centres.slice(1).map((c, i) => ({ a: centres[i], b: c }));

  return (
    <div className={body.className} style={{ background: CREAM }}>
      {/* ------------------------------ Hero ------------------------------ */}
      <section className="relative isolate flex min-h-[70vh] items-center justify-center overflow-hidden px-4 pb-14 pt-28 text-center text-white sm:min-h-[78vh] sm:pt-36 md:pt-40">
        <Image
          key={heroSrc}
          src={heroSrc}
          alt=""
          fill
          priority
          sizes="100vw"
          quality={75}
          onError={() => setHeroFailed(true)}
          className="-z-20 object-cover object-center"
        />
        {/* Overlays: flat dim + top/bottom fade + extra dark pool behind the text */}
        <div className="absolute inset-0 -z-10 bg-black/40" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/55 via-black/25 to-black/70" />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.6),transparent_75%)]" />
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE }} className="max-w-3xl">
          <h1 className={`${heading.className} text-3xl font-medium leading-tight [text-shadow:0_4px_30px_rgba(0,0,0,0.7)] sm:text-5xl md:text-6xl lg:text-7xl`}>
            We turn journeys into stories
          </h1>
          <nav aria-label="Breadcrumb" className="mt-4 flex items-center justify-center gap-2 text-sm text-white/90 [text-shadow:0_2px_12px_rgba(0,0,0,0.8)]">
            {/* <Link href="/" className="transition-colors hover:text-white">Home</Link>
            <span aria-hidden>/</span>
            <span className="text-white">About Us</span> */}
          </nav>
          <p className="mx-auto mt-6 max-w-xl text-base font-medium leading-relaxed text-white [text-shadow:0_2px_16px_rgba(0,0,0,0.9)] sm:text-lg">
            {BRAND} helps travelers discover the world in a way that feels personal, effortless and unforgettable.
          </p>
        </motion.div>
      </section>

      {/* ----------------------- Our story (moodboard) ----------------------- */}
      <section className="px-4 py-20 md:px-8 md:py-28" style={{ color: INK }}>
        <div className="mx-auto grid max-w-[1180px] items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.6, ease: EASE }}>
            <svg viewBox="0 0 120 120" className="h-24 w-24" style={{ color: INK }} aria-hidden="true">
              <defs><path id="who-we-are" d="M60,60 m-44,0 a44,44 0 1,1 88,0 a44,44 0 1,1 -88,0" /></defs>
              <text className="fill-current text-[11px] font-medium tracking-[0.3em]">
                <textPath href="#who-we-are">WHO WE ARE • WHO WE ARE •</textPath>
              </text>
            </svg>

            <h2 className={`${heading.className} mt-4 text-4xl leading-tight sm:text-5xl`} style={{ color: "#b7702f" }}>
              Our Story
            </h2>
            <p className="mt-5 text-base leading-relaxed" style={{ color: `${INK}cc` }}>
              {/* Replace with your real story */}
              What began as a love for exploring has grown into a team of travel lovers who plan trips the way we would plan our own: with care, local knowledge and a little room for wonder.
            </p>
            <p className="mt-4 text-base leading-relaxed" style={{ color: `${INK}cc` }}>
              From quiet backwaters to golden deserts and snow-capped peaks, we handle the details so you can focus on the moments you will remember.
            </p>

            <div className="mt-7 flex gap-2.5" aria-hidden="true">
              {PALETTE.map((c) => (
                <span key={c} className="h-9 w-9 rounded-full" style={{ background: c }} />
              ))}
            </div>

            <dl className="mt-9 grid grid-cols-2 gap-6 sm:grid-cols-4">
              {STATS.map((s) => (
                <div key={s.label}>
                  <dt className={`${heading.className} text-3xl`} style={{ color: "#b7702f" }}>{s.value}</dt>
                  <dd className="mt-1 text-xs uppercase tracking-wider" style={{ color: `${INK}b3` }}>{s.label}</dd>
                </div>
              ))}
            </dl>
          </motion.div>

          {/* Collage */}
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.6, delay: 0.1, ease: EASE }} className="grid grid-cols-6 gap-3 sm:gap-4">
            <div className="relative col-span-3 aspect-[4/5] -rotate-2 overflow-hidden bg-white p-1.5 shadow-xl">
              <div className="relative h-full w-full"><Photo src={COLLAGE[0].src} alt={COLLAGE[0].alt} sizes="(min-width:1024px) 22vw, 45vw" /></div>
            </div>
            <div className="relative col-span-3 mt-10 aspect-square rotate-2 overflow-hidden bg-white p-1.5 shadow-xl">
              <div className="relative h-full w-full"><Photo src={COLLAGE[1].src} alt={COLLAGE[1].alt} sizes="(min-width:1024px) 22vw, 45vw" /></div>
            </div>
            <div className="relative col-span-2 -mt-6 aspect-[3/4] rotate-1 overflow-hidden bg-white p-1.5 shadow-xl">
              <div className="relative h-full w-full"><Photo src={COLLAGE[2].src} alt={COLLAGE[2].alt} sizes="(min-width:1024px) 15vw, 30vw" /></div>
            </div>
            <div className="relative col-span-4 aspect-[16/10] -rotate-1 overflow-hidden bg-white p-1.5 shadow-xl">
              <div className="relative h-full w-full"><Photo src={COLLAGE[3].src} alt={COLLAGE[3].alt} sizes="(min-width:1024px) 30vw, 60vw" /></div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ------------------------ Postcards (values) ------------------------ */}
      <section className="px-4 py-20 text-white md:px-8 md:py-28" style={{ background: FOREST }}>
        <div className="mx-auto max-w-[1180px]">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className={`${heading.className} text-4xl sm:text-5xl`}>What we stand for</h2>
            <p className="mt-4 text-base leading-relaxed text-white/80">
              Three promises we send with every trip.
            </p>
          </div>
          <div className="mt-12 grid gap-8 sm:mt-14 sm:grid-cols-2 md:grid-cols-3">
            {POSTCARDS.map((p, i) => (
              <Postcard key={p.title} p={p} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ------------------- Polaroids on the world map ------------------- */}
      <section className="relative overflow-hidden px-4 py-20 md:px-8 md:py-28" style={{ background: "linear-gradient(180deg,#fbfcfd 0%,#dfeaf3 100%)", color: NAVY }}>
        <div className="mx-auto max-w-[1180px]">
          <h2 className={`${heading.className} text-4xl font-medium leading-tight sm:text-6xl`}>
            10 Places.<br />Endless Possibilities.
          </h2>
          <span className="mt-6 block h-[2px] w-14" style={{ background: GOLD }} />
          <p className="mt-5 text-base leading-relaxed" style={{ color: `${NAVY}cc` }}>
            The world is calling.<br />Where will you go next?
          </p>

          {/* Desktop: scattered polaroids over a map */}
          <div className="relative mt-10 hidden aspect-[16/11] md:block">
            {WORLD_MAP && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={WORLD_MAP} alt="" aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full object-contain opacity-25" />
            )}

            {/* Dotted route + pins */}
            <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
              {segments.map(({ a, b }, i) => (
                <path key={i} d={`M ${a.x} ${a.y} Q ${(a.x + b.x) / 2} ${Math.min(a.y, b.y) - 12} ${b.x} ${b.y}`}
                  fill="none" stroke={GOLD} strokeWidth="1.5" strokeDasharray="5 5" vectorEffect="non-scaling-stroke" />
              ))}
            </svg>
            {segments.map(({ a, b }, i) => (
              <MapPin key={i} aria-hidden="true" className="absolute z-[5] h-6 w-6 -translate-x-1/2 -translate-y-full" style={{ left: `${(a.x + b.x) / 2}%`, top: `${(a.y + b.y) / 2}%`, color: GOLD }} fill={GOLD} stroke="#fff" strokeWidth={1.5} />
            ))}

            {PLACES.map((p, i) => (
              <motion.div
                key={p.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.6, delay: i * 0.06, ease: EASE }}
                className="absolute z-10 w-[16%]"
                style={{ left: `${p.x}%`, top: `${p.y}%` }}
              >
                <Polaroid n={i + 1} name={p.name} src={p.src} style={{ transform: `rotate(${p.r}deg)` }} />
              </motion.div>
            ))}

            <Plane aria-hidden="true" className="absolute right-[6%] top-[2%] h-10 w-10 rotate-[-20deg]" style={{ color: GOLD }} fill={GOLD} />
            <Compass aria-hidden="true" className="absolute bottom-0 right-[2%] h-14 w-14" style={{ color: GOLD }} />
          </div>

          {/* Mobile: simple tilted grid */}
          <div className="mt-10 grid grid-cols-2 gap-5 md:hidden">
            {PLACES.map((p, i) => (
              <Polaroid key={p.name} n={i + 1} name={p.name} src={p.src} className={i % 2 === 0 ? "-rotate-2" : "rotate-2"} />
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------- CTA ------------------------------- */}
      <section className="relative isolate overflow-hidden px-4 py-24 text-center text-white md:py-32">
        <Image src={CTA_IMAGE} alt="" fill sizes="100vw" quality={70} className="-z-20 object-cover object-center" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/55 via-black/45 to-black/70" />
        <div className="mx-auto max-w-2xl">
          <h2 className={`${heading.className} text-4xl leading-tight [text-shadow:0_4px_30px_rgba(0,0,0,0.7)] sm:text-6xl`}>
            Where will you go next?
          </h2>
          <p className="mt-5 text-base text-white/90 [text-shadow:0_2px_14px_rgba(0,0,0,0.8)] sm:text-lg">
            Tell us your dream trip and we&apos;ll take care of the rest.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link href="/DestinationPage" className="rounded-full bg-[#F5EFE7] px-9 py-3.5 font-medium text-[#1f1a16] shadow-xl transition hover:-translate-y-0.5 hover:scale-105">
              Explore Destinations
            </Link>
            <Link href="/contact" className="rounded-full px-9 py-3.5 font-semibold text-white shadow-xl transition hover:-translate-y-0.5 hover:brightness-110" style={{ background: CORAL }}>
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}