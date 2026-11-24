"use client";

/* eslint-disable @next/next/no-img-element */

import { useState } from "react";
import Link from "next/link";

/* -------------------------------------------------------------------------- */
/*  Data – add, remove or rename categories here (4 or 5 cards look best).     */
/*  To use your own photos, put them in /public/categories and set              */
/*  `image` to e.g. "/categories/beach.jpg".                                   */
/* -------------------------------------------------------------------------- */

interface Category {
  id: string;
  title: string;
  description: string;
  /** Where the card leads to */
  href: string;
  image: string;
  /** Shown behind the image if it fails to load */
  fallback: string;
}

const unsplash = (photoId: string) =>
  `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=800&q=80`;

const categories: Category[] = [
  {
    id: "beach",
    title: "Beaches",
    description: "Golden sand, warm sea and slow sunsets.",
    href: "/DestinationPage",
    image: unsplash("photo-1507525428034-b723cf961d3e"),
    fallback: "linear-gradient(160deg,#3a7ca5,#0d2430)",
  },
  {
    id: "mountain",
    title: "Mountains",
    description: "Green valleys, high trails and fresh air.",
    href: "/DestinationPage",
    image: unsplash("photo-1464822759023-fed622ff2c3b"),
    fallback: "linear-gradient(160deg,#2f4b3a,#0b130f)",
  },
  {
    id: "snow",
    title: "Snow",
    description: "Ski slopes, frozen lakes and cosy cabins.",
    href: "/DestinationPage",
    image: unsplash("photo-1483728642387-6c3bdd6c93e5"),
    fallback: "linear-gradient(160deg,#8fb3c9,#1b2a33)",
  },
  {
    id: "adventure",
    title: "Adventure",
    description: "Trekking, rafting, camping and more.",
    href: "/DestinationPage",
    image: unsplash("photo-1551632811-561732d1e306"),
    fallback: "linear-gradient(160deg,#6b5b3a,#17130b)",
  },
  {
    id: "desert",
    title: "Desert",
    description: "Endless dunes and starry camp nights.",
    href: "/DestinationPage",
    image: unsplash("photo-1509316785289-025f5b846b35"),
    fallback: "linear-gradient(160deg,#c98f68,#2a160b)",
  },
];

const ACCENT = "#f5a623";
const DEFAULT_ACTIVE = Math.floor(categories.length / 2); // middle card starts raised

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

export default function CategorySection() {
  const [active, setActive] = useState(DEFAULT_ACTIVE);

  return (
    <section id="categories" className="relative z-10 bg-black px-4 py-20 text-white md:px-8 md:py-28">
      <div className="mx-auto max-w-[1180px]">
        {/* Heading */}
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <p
            className="mb-3 text-xs font-semibold uppercase tracking-[0.3em]"
            style={{ color: ACCENT }}
          >
            Choose your vibe
          </p>
          <h2 className="text-3xl font-bold uppercase tracking-wide sm:text-4xl">
            Popular Categories
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-white/60 sm:text-base">
            What kind of place do you love? Pick a category and we will show you
            the best destinations for it.
          </p>
        </div>

        {/* Cards: horizontal scroll on mobile, 5-column grid on desktop */}
        <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-6 pt-6 [scrollbar-width:none] md:-mx-8 md:px-8 lg:mx-0 lg:grid lg:snap-none lg:grid-cols-5 lg:overflow-visible lg:px-0 [&::-webkit-scrollbar]:hidden">
          {categories.map((c, i) => {
            const isActive = i === active;
            return (
              <Link
                key={c.id}
                href={c.href}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onTouchStart={() => setActive(i)}
                aria-label={`Explore ${c.title}`}
                className={`group relative block h-[380px] w-[230px] shrink-0 snap-center overflow-hidden rounded-2xl border transition-all duration-500 sm:h-[420px] lg:w-auto ${
                  isActive
                    ? "-translate-y-3 border-white/50 shadow-[0_25px_60px_-15px_rgba(255,255,255,0.2)]"
                    : "border-white/10"
                }`}
                style={{ background: c.fallback }}
              >
                <img
                  src={c.image}
                  alt=""
                  draggable={false}
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                  className="absolute inset-0 h-full w-full object-cover transition-all duration-700"
                  style={{
                    transform: isActive ? "scale(1.1)" : "scale(1)",
                    filter: isActive ? "brightness(1)" : "brightness(0.7)",
                  }}
                />

                {/* Dark gradient so the text is readable */}
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(0,0,0,0) 35%, rgba(0,0,0,0.92) 100%)",
                  }}
                />

                {/* Text */}
                <div className="absolute inset-x-0 bottom-0 p-5 text-center">
                  <h3 className="text-lg font-bold uppercase tracking-wide">
                    {c.title}
                  </h3>
                  <p className="mx-auto mt-2 max-w-[180px] text-[11px] leading-relaxed text-white/65">
                    {c.description}
                  </p>
                  <span
                    className={`mt-3 inline-block text-[10px] font-semibold uppercase tracking-[0.25em] transition-all duration-500 ${
                      isActive ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
                    }`}
                    style={{ color: ACCENT }}
                  >
                    Explore →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}