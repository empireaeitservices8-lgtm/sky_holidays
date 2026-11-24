"use client";

/* eslint-disable @next/next/no-img-element */

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

/* -------------------------------------------------------------------------- */
/*  Colours                                                                   */
/* -------------------------------------------------------------------------- */

const BLUE = "#083858"; // main blue
const BLUE_TINT = "#e8f0f6"; // soft background

const EASE = [0.22, 1, 0.36, 1] as const;

/* -------------------------------------------------------------------------- */
/*  Filters                                                                   */
/* -------------------------------------------------------------------------- */

const REGIONS = [
  { value: "all", label: "Everywhere" },
  { value: "europe", label: "Europe" },
  { value: "asia", label: "Asia" },
  { value: "middle-east", label: "Middle East" },
  { value: "africa", label: "Africa" },
  { value: "americas", label: "Americas" },
  { value: "oceania", label: "Oceania" },
] as const;

const THEMES = [
  "Romantic",
  "Family",
  "Friends",
  "Solo & Women",
  "Seniors",
  "Group",
  "Corporate",
  "Adventure",
  "Spiritual",
] as const;

type Region = (typeof REGIONS)[number]["value"];
type PackageRegion = Exclude<Region, "all">;
type Theme = (typeof THEMES)[number];
type ThemeFilter = Theme | "all";

const PAGE_SIZE = 6;

const regionLabel = (value: PackageRegion) =>
  REGIONS.find((r) => r.value === value)?.label ?? value;

/* -------------------------------------------------------------------------- */
/*  Packages: SAMPLE DATA. Replace names, prices, nights and images with      */
/*  your real packages. For your own photos, put them in /public/destinations */
/*  and use e.g. image: "/destinations/paris.jpg".                            */
/* -------------------------------------------------------------------------- */

interface TourPackage {
  id: string;
  name: string;
  /** Decides which region tab shows it */
  region: PackageRegion;
  places: string;
  nights: number;
  /** Price per person in INR */
  price: number;
  themes: Theme[];
  image: string;
  fallback: string;
}

const unsplash = (photoId: string) =>
  `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=1200&q=80`;

const IMG = {
  paris: unsplash("photo-1502602898657-3e91760cbb34"),
  santorini: unsplash("photo-1570077188670-e3a8d69ac5ff"),
  venice: unsplash("photo-1514890547357-a9ee288728e0"),
  tokyo: unsplash("photo-1540959733332-eab4deabeeaf"),
  bali: unsplash("photo-1537996194471-e657df975ab4"),
  maldives: unsplash("photo-1514282401047-d79a71a590e8"),
  dubai: unsplash("photo-1512453979798-5ea266f8880c"),
  turkey: unsplash("photo-1570939274717-7eda259b50ed"),
  safari: unsplash("photo-1516426122078-c23e76319801"),
  desert: unsplash("photo-1509316785289-025f5b846b35"),
  newyork: unsplash("photo-1496442226666-8d4d0e62e6e6"),
  peru: unsplash("photo-1526392060635-9d6019884377"),
  sydney: unsplash("photo-1506973035872-a4ec16b8e8d9"),
  mountain: unsplash("photo-1464822759023-fed622ff2c3b"),
};

const gradient = (a: string, b: string) => `linear-gradient(135deg, ${a}, ${b})`;

const packages: TourPackage[] = [
  /* ------------------------------- Europe ------------------------------- */
  {
    id: "paris-switzerland",
    name: "Paris & Switzerland",
    region: "europe",
    places: "Paris · Interlaken · Lucerne",
    nights: 8,
    price: 189999,
    themes: ["Romantic", "Family", "Seniors"],
    image: IMG.paris,
    fallback: gradient("#5a6f8c", "#0b1522"),
  },
  {
    id: "greece",
    name: "Greece",
    region: "europe",
    places: "Athens · Santorini · Mykonos",
    nights: 7,
    price: 149999,
    themes: ["Romantic", "Friends", "Solo & Women"],
    image: IMG.santorini,
    fallback: gradient("#2f7fb5", "#0a2437"),
  },
  {
    id: "italy",
    name: "Italy",
    region: "europe",
    places: "Rome · Florence · Venice",
    nights: 8,
    price: 169999,
    themes: ["Romantic", "Family", "Seniors", "Group"],
    image: IMG.venice,
    fallback: gradient("#b07a4f", "#2a1608"),
  },

  /* -------------------------------- Asia -------------------------------- */
  {
    id: "japan",
    name: "Japan",
    region: "asia",
    places: "Tokyo · Kyoto · Osaka",
    nights: 7,
    price: 129999,
    themes: ["Friends", "Family", "Solo & Women", "Group"],
    image: IMG.tokyo,
    fallback: gradient("#8a4f6a", "#1f0c16"),
  },
  {
    id: "bali",
    name: "Bali",
    region: "asia",
    places: "Ubud · Kintamani · Seminyak",
    nights: 5,
    price: 39999,
    themes: ["Romantic", "Friends", "Family"],
    image: IMG.bali,
    fallback: gradient("#2a8a8f", "#06292b"),
  },
  {
    id: "maldives",
    name: "Maldives",
    region: "asia",
    places: "Male · Maafushi",
    nights: 4,
    price: 69999,
    themes: ["Romantic"],
    image: IMG.maldives,
    fallback: gradient("#1f9fb5", "#062c35"),
  },

  /* ----------------------------- Middle East ----------------------------- */
  {
    id: "dubai",
    name: "Dubai",
    region: "middle-east",
    places: "Dubai · Abu Dhabi",
    nights: 5,
    price: 54999,
    themes: ["Family", "Corporate", "Solo & Women", "Group"],
    image: IMG.dubai,
    fallback: gradient("#c08a52", "#24150a"),
  },
  {
    id: "turkey",
    name: "Turkey",
    region: "middle-east",
    places: "Istanbul · Cappadocia",
    nights: 6,
    price: 89999,
    themes: ["Romantic", "Friends", "Spiritual", "Group"],
    image: IMG.turkey,
    fallback: gradient("#b5683f", "#2b1208"),
  },

  /* -------------------------------- Africa ------------------------------- */
  {
    id: "kenya-safari",
    name: "Kenya Safari",
    region: "africa",
    places: "Masai Mara · Nairobi",
    nights: 6,
    price: 159999,
    themes: ["Adventure", "Family", "Friends", "Group"],
    image: IMG.safari,
    fallback: gradient("#a8782f", "#241706"),
  },
  {
    id: "egypt",
    name: "Egypt",
    region: "africa",
    places: "Cairo · Luxor · Aswan",
    nights: 7,
    price: 99999,
    themes: ["Family", "Seniors", "Spiritual", "Group"],
    image: IMG.desert,
    fallback: gradient("#b9794f", "#2b1608"),
  },

  /* ------------------------------- Americas ------------------------------ */
  {
    id: "new-york",
    name: "New York",
    region: "americas",
    places: "Manhattan · Brooklyn · Niagara",
    nights: 6,
    price: 179999,
    themes: ["Friends", "Family", "Corporate", "Solo & Women"],
    image: IMG.newyork,
    fallback: gradient("#4d5f7a", "#0a1018"),
  },
  {
    id: "peru",
    name: "Peru",
    region: "americas",
    places: "Lima · Cusco · Machu Picchu",
    nights: 8,
    price: 199999,
    themes: ["Adventure", "Spiritual", "Friends"],
    image: IMG.peru,
    fallback: gradient("#4f7f5f", "#0b1c14"),
  },

  /* ------------------------------- Oceania ------------------------------- */
  {
    id: "australia",
    name: "Australia",
    region: "oceania",
    places: "Sydney · Melbourne · Gold Coast",
    nights: 8,
    price: 189999,
    themes: ["Family", "Friends", "Corporate", "Group"],
    image: IMG.sydney,
    fallback: gradient("#2f7fa8", "#0a2a3d"),
  },
  {
    id: "new-zealand",
    name: "New Zealand",
    region: "oceania",
    places: "Auckland · Queenstown · Rotorua",
    nights: 9,
    price: 219999,
    themes: ["Adventure", "Romantic", "Family"],
    image: IMG.mountain,
    fallback: gradient("#6a7f93", "#101b26"),
  },
];

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                   */
/* -------------------------------------------------------------------------- */

const formatPrice = (n: number) => `₹ ${new Intl.NumberFormat("en-IN").format(n)}`;
const duration = (nights: number) => `${nights} Nights / ${nights + 1} Days`;

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

export default function DestinationsSection() {
  const [region, setRegion] = useState<Region>("all");
  const [theme, setTheme] = useState<ThemeFilter>("all");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const filtered = useMemo(
    () =>
      packages.filter(
        (p) =>
          (region === "all" || p.region === region) &&
          (theme === "all" || p.themes.includes(theme))
      ),
    [region, theme]
  );
  const visible = filtered.slice(0, visibleCount);

  const chooseRegion = (value: Region) => {
    setRegion(value);
    setVisibleCount(PAGE_SIZE);
  };
  const chooseTheme = (value: ThemeFilter) => {
    setTheme(value);
    setVisibleCount(PAGE_SIZE);
  };
  const reset = () => {
    setRegion("all");
    setTheme("all");
    setVisibleCount(PAGE_SIZE);
  };

  return (
    <section
      id="destinations"
      className="relative z-10 overflow-x-hidden bg-white px-4 py-14 sm:px-6 sm:py-20 md:px-8 md:py-28"
    >
      {/* Small fade-up animation for cards (skipped for reduced-motion users) */}
      <style>{`
        @keyframes destFadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:none}}
        @media (prefers-reduced-motion: reduce){.dest-card{animation:none !important}}
      `}</style>

      <div className="mx-auto w-full max-w-[1180px]">
        {/* Heading */}
        <div>
          <p
            className="mb-2 text-[11px] font-semibold uppercase tracking-[0.25em] sm:mb-3 sm:text-xs sm:tracking-[0.3em]"
            style={{ color: BLUE }}
          >
            Our packages
          </p>
          <h2
            className="text-3xl font-light leading-tight sm:text-4xl md:text-5xl"
            style={{ color: BLUE }}
          >
            Find your perfect holiday
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-neutral-500 sm:mt-4 sm:text-base">
            Handpicked packages across the world. Pick a part of the world and
            a travel style to see what suits you best.
          </p>
        </div>

        {/* Region switch with sliding highlight (scrolls sideways on small screens) */}
        <div
          role="group"
          aria-label="Region"
          className="-mx-4 mt-6 overflow-x-auto overscroll-x-contain px-4 sm:-mx-6 sm:mt-8 sm:px-6 md:mx-0 md:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <div
            className="inline-flex rounded-full p-1"
            style={{ background: BLUE_TINT }}
          >
            {REGIONS.map((r) => {
              const isOn = region === r.value;
              return (
                <button
                  key={r.value}
                  type="button"
                  aria-pressed={isOn}
                  onClick={() => chooseRegion(r.value)}
                  className="relative shrink-0 whitespace-nowrap rounded-full px-4 py-2.5 text-[13px] font-medium sm:px-5 sm:text-sm"
                >
                  {isOn && (
                    <motion.span
                      layoutId="region-pill"
                      transition={{ duration: 0.45, ease: EASE }}
                      className="absolute inset-0 rounded-full"
                      style={{ background: BLUE }}
                    />
                  )}
                  <span
                    className="relative transition-colors duration-300"
                    style={{ color: isOn ? "#fff" : BLUE }}
                  >
                    {r.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Travel style tabs with sliding underline */}
        <div
          role="group"
          aria-label="Travel style"
          className="-mx-4 mt-6 flex gap-5 overflow-x-auto overscroll-x-contain border-b border-neutral-200 px-4 sm:-mx-6 sm:mt-8 sm:gap-7 sm:px-6 md:mx-0 md:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {(["all", ...THEMES] as const).map((t) => {
            const isOn = theme === t;
            return (
              <button
                key={t}
                type="button"
                aria-pressed={isOn}
                onClick={() => chooseTheme(t)}
                className="relative shrink-0 whitespace-nowrap pb-3 pt-1 text-[13px] font-medium transition-colors duration-300 sm:text-sm"
                style={{ color: isOn ? BLUE : "#8a949c" }}
              >
                {t === "all" ? "All styles" : t}
                {isOn && (
                  <motion.span
                    layoutId="theme-underline"
                    transition={{ duration: 0.45, ease: EASE }}
                    className="absolute inset-x-0 bottom-0 h-0.5"
                    style={{ background: BLUE }}
                  />
                )}
              </button>
            );
          })}
        </div>

        <p className="mt-5 text-sm text-neutral-500 sm:mt-6" aria-live="polite">
          {filtered.length} {filtered.length === 1 ? "journey" : "journeys"}
        </p>

        {/* Cards */}
        {visible.length > 0 ? (
          <div
            key={`${region}-${theme}`}
            className="mt-5 grid grid-cols-1 gap-4 sm:mt-6 sm:gap-6 md:grid-cols-2"
          >
            {visible.map((p, i) => (
              <article
                key={p.id}
                className="dest-card group relative isolate flex min-h-[400px] flex-col justify-between overflow-hidden rounded-2xl sm:min-h-[430px] sm:rounded-3xl"
                style={{
                  background: p.fallback,
                  animation: "destFadeUp 600ms ease both",
                  animationDelay: `${(i % PAGE_SIZE) * 70}ms`,
                }}
              >
                <img
                  src={p.image}
                  alt={p.name}
                  loading="lazy"
                  draggable={false}
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                  className="absolute inset-0 -z-20 h-full w-full object-cover transition-transform duration-[900ms] ease-out [@media(hover:hover)]:group-hover:scale-110"
                />

                {/* Gradient: dark at the bottom, with a blue tint */}
                <div
                  className="absolute inset-0 -z-10"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(5,38,56,0.2) 0%, rgba(5,38,56,0) 30%, rgba(5,38,56,0.9) 100%)",
                  }}
                />

                {/* Tags */}
                <div className="flex flex-wrap gap-2 p-4 sm:p-5">
                  <span
                    className="rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white"
                    style={{ background: BLUE }}
                  >
                    {regionLabel(p.region)}
                  </span>
                  {p.themes.slice(0, 2).map((t, idx) => (
                    <span
                      key={t}
                      className={`rounded-full bg-white/20 px-3 py-1 text-[11px] font-medium text-white backdrop-blur-md ${idx === 1 ? "hidden min-[400px]:inline-block" : ""
                        }`}
                    >
                      {t}
                    </span>
                  ))}
                </div>

                {/* Text + button */}
                <div className="p-5 pt-10 text-white sm:p-8 sm:pt-12">
                  <h3 className="text-2xl font-light leading-tight sm:text-4xl">
                    {p.name}
                  </h3>

                  <div className="mt-2 flex flex-col gap-1.5 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between sm:gap-x-6">
                    <p className="text-[13px] leading-snug text-white/85 sm:text-sm">
                      <span className="block sm:inline">{duration(p.nights)}</span>
                      <span className="mx-2 hidden text-white/40 sm:inline">|</span>
                      <span className="block text-white/75 sm:inline sm:text-white/85">
                        {p.places}
                      </span>
                    </p>
                    <p className="text-[13px] text-white/85 sm:text-sm">
                      Starting from{" "}
                      <span className="whitespace-nowrap text-lg font-semibold text-white sm:text-xl">
                        {formatPrice(p.price)}
                      </span>
                    </p>
                  </div>

                  {/* "Book now" slides in on hover (always visible on touch devices) */}
                  <div className="grid grid-rows-[0fr] opacity-0 transition-all duration-500 ease-out group-focus-within:mt-5 group-focus-within:grid-rows-[1fr] group-focus-within:opacity-100 [@media(hover:hover)]:group-hover:mt-5 [@media(hover:hover)]:group-hover:grid-rows-[1fr] [@media(hover:hover)]:group-hover:opacity-100 [@media(hover:none)]:mt-4 [@media(hover:none)]:grid-rows-[1fr] [@media(hover:none)]:opacity-100">
                    <div className="overflow-hidden">
                      <Link
                        href={`/destinations/${p.id}`}
                        className="block rounded-full bg-white py-3 text-center text-[15px] font-semibold transition-colors hover:bg-[#e8f0f6] active:bg-[#e8f0f6] sm:py-3.5 sm:text-base"
                        style={{ color: BLUE }}
                      >
                        Book now
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div
            className="mt-5 rounded-2xl px-5 py-12 text-center sm:mt-6 sm:rounded-3xl sm:px-6 sm:py-16"
            style={{ background: BLUE_TINT }}
          >
            <p className="text-lg font-light sm:text-xl" style={{ color: BLUE }}>
              No packages match these filters yet.
            </p>
            <button
              type="button"
              onClick={reset}
              className="mt-6 rounded-full px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#052638] active:bg-[#052638]"
              style={{ background: BLUE }}
            >
              Reset filters
            </button>
          </div>
        )}

        {/* View more */}
        {filtered.length > visibleCount && (
          <div className="mt-8 text-center sm:mt-12">
            <button
              type="button"
              onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
              className="w-full rounded-full border-2 px-10 py-3.5 text-sm font-semibold transition-colors duration-300 hover:!bg-[#083858] hover:!text-white active:!bg-[#083858] active:!text-white sm:w-auto"
              style={{ borderColor: BLUE, color: BLUE }}
            >
              View more packages
            </button>
          </div>
        )}
      </div>
    </section>
  );
}