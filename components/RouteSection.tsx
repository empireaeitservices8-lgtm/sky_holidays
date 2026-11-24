"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Playfair_Display, Inter } from "next/font/google";
import { Hotel, Landmark, MapPin, Mountain, Store, Waves } from "lucide-react";

const heading = Playfair_Display({ subsets: ["latin"], weight: ["500", "600"], display: "swap" });
const body = Inter({ subsets: ["latin"], weight: ["400", "500", "600"], display: "swap" });

/* -------------------------------------------------------------------------- */
/*  Edit these details                                                         */
/* -------------------------------------------------------------------------- */

const ACCENT = "#F07850"; // coral, same as the Search button
const CREAM = "#F5EFE7";
const INK = "#1f1a16";

// Blurred behind the map. Any URL or a local path like "/images/bali.jpg".
const MAP_IMAGE =
  "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1400&q=80";

type Stop = {
  name: string;
  days: string;
  blurb: string;
  icon: typeof MapPin;
  /** Pin position on the map, in % of the map card (x, y). */
  x: number;
  y: number;
  /** Where the label sits relative to the pin. */
  label: "right" | "left" | "below";
};

// Listed in travel order: the route runs from the first stop to the last.
const STOPS: Stop[] = [
  { name: "Kuta", days: "Day 1", blurb: "Land, settle in and catch the first sunset on the beach.", icon: Waves, x: 16, y: 81, label: "below" },
  { name: "Kintamani", days: "Day 2", blurb: "Sunrise over the volcano and the crater lake.", icon: Mountain, x: 35, y: 74, label: "right" },
  { name: "Ubud", days: "Days 3 and 4", blurb: "Rice terraces, art markets and slow mornings.", icon: Store, x: 40, y: 50, label: "left" },
  { name: "Tanah Lot", days: "Day 5", blurb: "The sea temple at golden hour.", icon: Landmark, x: 62, y: 41, label: "right" },
  { name: "Seminyak", days: "Days 6 and 7", blurb: "Beach clubs, spas and a final dinner by the water.", icon: Hotel, x: 75, y: 17, label: "below" },
];

// Dashed route, drawn in the same 1080 x 1346 space as the map card.
const ROUTE_PATH =
  "M174 1095 C230 1040 290 1015 380 1020 C440 930 450 870 380 850 S290 830 300 760 S380 700 430 672 C500 650 540 610 667 580 C740 560 780 500 760 440 S620 420 610 380 S700 280 811 225";

const LABEL_POS = {
  right: "left-full top-1 ml-1.5",
  left: "right-full top-1 mr-1.5",
  below: "left-1/2 top-[calc(100%+6px)] -translate-x-1/2",
} as const;

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

export default function RouteSection() {
  const [active, setActive] = useState<number | null>(null);
  const reduce = useReducedMotion();

  return (
    <section className={`${body.className} px-4 py-20 md:px-8 md:py-28`} style={{ background: CREAM, color: INK }}>
      <div className="mx-auto grid max-w-[1180px] items-center gap-12 lg:grid-cols-[1fr_minmax(0,480px)] lg:gap-20">
        {/* ----------------------------- Text + stops ----------------------------- */}
        <div>
          <h2 className={`${heading.className} max-w-lg text-4xl font-medium leading-tight sm:text-5xl`}>
            One island, seven days, five stops
          </h2>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-[#1f1a16]/75">
            Our Bali route moves from the surf of Kuta up to the volcano, through Ubud&apos;s rice terraces and
            along the coast to Seminyak. Hotels, drivers and transfers are booked for you.
          </p>

          <ol className="mt-10 max-w-lg">
            {STOPS.map((s, i) => {
              const Icon = s.icon;
              const on = active === i;
              return (
                <li
                  key={s.name}
                  onMouseEnter={() => setActive(i)}
                  onMouseLeave={() => setActive(null)}
                  onFocus={() => setActive(i)}
                  onBlur={() => setActive(null)}
                  tabIndex={0}
                  className="relative flex gap-4 pb-7 outline-none last:pb-0"
                >
                  {/* connecting line between stops */}
                  {i < STOPS.length - 1 && (
                    <span aria-hidden className="absolute left-[19px] top-10 h-[calc(100%-2.5rem)] border-l-2 border-dashed border-[#1f1a16]/25" />
                  )}
                  <span
                    className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-white transition-transform duration-300"
                    style={{ background: ACCENT, transform: on ? "scale(1.15)" : "scale(1)" }}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="flex flex-wrap items-baseline gap-x-3">
                      <span className={`${heading.className} text-xl`}>{s.name}</span>
                      <span className="text-sm font-medium text-[#1f1a16]/60">{s.days}</span>
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-[#1f1a16]/75">{s.blurb}</p>
                  </div>
                </li>
              );
            })}
          </ol>

          <Link
            href="/contact"
            className="mt-10 inline-flex rounded-full px-8 py-3.5 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            style={{ background: ACCENT }}
          >
            Plan this route
          </Link>
        </div>

        {/* --------------------------------- Map ---------------------------------- */}
        <div className="relative mx-auto aspect-[1080/1346] w-full max-w-[480px] overflow-hidden rounded-3xl bg-neutral-900 shadow-2xl">
          <Image
            src={MAP_IMAGE}
            alt=""
            fill
            sizes="(min-width: 1024px) 480px, 100vw"
            quality={70}
            className="scale-110 object-cover blur-md"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/20 to-black/60" />

          {/* Dashed route that draws itself once when scrolled into view */}
          <svg viewBox="0 0 1080 1346" className="absolute inset-0 h-full w-full" fill="none" aria-hidden>
            <defs>
              <mask id="route-reveal">
                <motion.path
                  d={ROUTE_PATH}
                  stroke="white"
                  strokeWidth={30}
                  strokeLinecap="round"
                  initial={{ pathLength: reduce ? 1 : 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true, margin: "-120px" }}
                  transition={{ duration: 2.6, ease: "easeInOut" }}
                />
              </mask>
            </defs>
            <path
              d={ROUTE_PATH}
              stroke="white"
              strokeWidth={6}
              strokeLinecap="round"
              strokeDasharray="2 20"
              mask="url(#route-reveal)"
            />
          </svg>

          {/* Pins + labels */}
          {STOPS.map((s, i) => {
            const on = active === i;
            return (
              <div
                key={s.name}
                className="absolute h-8 w-8 -translate-x-1/2 -translate-y-full sm:h-9 sm:w-9"
                style={{ left: `${s.x}%`, top: `${s.y}%` }}
              >
                <MapPin
                  className="h-full w-full text-white drop-shadow-lg transition-transform duration-300"
                  style={{
                    fill: ACCENT,
                    transform: on ? "scale(1.25)" : "scale(1)",
                    transformOrigin: "50% 100%",
                  }}
                />
                <span
                  className={`${heading.className} pointer-events-none absolute whitespace-nowrap text-base font-semibold text-white [text-shadow:0_2px_10px_rgba(0,0,0,0.7)] sm:text-xl ${LABEL_POS[s.label]}`}
                >
                  {s.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}