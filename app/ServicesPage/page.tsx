"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, MotionConfig } from "framer-motion";
import { Playfair_Display, Inter } from "next/font/google";
import {
  Car,
  Check,
  FileCheck2,
  Hotel,
  Luggage,
  Plane,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

const heading = Playfair_Display({
  subsets: ["latin"],
  weight: ["500", "600"],
  display: "swap",
});

const body = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

/* ========================================================================== */
/* CONFIGURATION */
/* ========================================================================== */

const BRAND = "Your Travel Brand";

const CREAM = "#F7F3EE";
const INK = "#3b2a20";
const NAVY = "#0f2747";
const BLUE = "#083858";
const STEP_NUMBER = "#8fb8d9";

const EASE = [0.22, 1, 0.36, 1] as const;

// Image URL helper
const u = (id: string, w = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

/**
 * HERO IMAGE
 * The hero image URL is picked in this order:
 *   1. the `heroImage` prop      <ServicesPage heroImage="https://..." />
 *   2. the env variable          NEXT_PUBLIC_SERVICES_HERO_URL (in .env.local or your hosting dashboard)
 *   3. DEFAULT_HERO below        (used if nothing is set, or if the URL fails to load)
 *
 * The image's domain must be allowed in next.config.js under images.remotePatterns.
 * Local images such as "/images/services-hero.jpg" (inside /public) work without any config.
 */
const DEFAULT_HERO = "/images/about.png";

const CTA_IMAGE = u("photo-1476514525535-07fb3b4ae5f1", 2400);

/* ========================================================================== */
/* SERVICE TYPE */
/* ========================================================================== */

interface Service {
  id: string;
  icon: LucideIcon;
  title: string;
  tagline: string;
  text: string;
  points: string[];
  pills?: {
    label: string;
    items: string[];
  };
  image: string;
  cta: {
    label: string;
    href: string;
  };
  buttonColor?: string;
}

/* ========================================================================== */
/* SERVICES DATA */
/* ========================================================================== */

const SERVICES: Service[] = [
  {
    id: "packages",
    icon: Luggage,
    title: "Tour packages",
    tagline: "Ready-made or built around you",
    text: "Pick one of our handpicked itineraries or tell us what you want and we will build it. Stays, sightseeing, transfers and local guides are all arranged for you.",
    points: [
      "Domestic and international packages",
      "Honeymoon, family, friends and group trips",
      "Custom itineraries with your budget in mind",
      "One clear price with everything listed",
    ],
    image: "/images/package.jpg",
    cta: {
      label: "View packages",
      href: "/DestinationPage",
    },
  },
  {
    id: "visa",
    icon: FileCheck2,
    title: "Visa assistance",
    tagline: "Fewer forms, fewer mistakes",
    text: "We tell you exactly which documents you need, check them before you apply, and handle the application and appointment booking. The final decision always rests with the embassy.",
    points: [
      "Document checklist for your passport and trip",
      "Application filing and appointment booking",
      "Photo, forms and cover letter checks",
      "Follow-up until your passport is back",
    ],
    pills: {
      label: "Popular visas",
      items: [
        "Dubai",
        "Schengen",
        "UK",
        "USA",
        "Singapore",
        "Thailand",
        "Australia",
      ],
    },
    image: "/images/visaa.jpg",
    cta: {
      label: "Ask about a visa",
      href: "/contact",
    },
  },
  {
    id: "hotels",
    icon: Hotel,
    title: "Hotels and stays",
    tagline: "From hostels to resorts",
    text: "Hostels for backpackers, homestays for a local feel, hotels and resorts for comfort. We match the stay to your trip and your budget, and confirm everything before you leave.",
    points: [
      "Hostels, homestays, hotels and resorts",
      "Rooms matched to your group size",
      "Location checked against your plans",
      "Written confirmation for every booking",
    ],
    image: u("photo-1566073771259-6a8506099945"),
    cta: {
      label: "Find a stay",
      href: "/contact",
    },
  },
  {
    id: "flights",
    icon: Plane,
    title: "Flight tickets",
    tagline: "Good fares, sensible timings",
    text: "Domestic and international flights, one-way, return or multi-city. We compare airlines and timings, and help with changes and cancellations after you book.",
    points: [
      "Domestic and international fares",
      "Multi-city and flexible-date options",
      "Group bookings",
      "Help with changes and cancellations",
    ],
    image: "/images/ticket.jpg",
    cta: {
      label: "Get a fare quote",
      href: "/contact",
    },
  },
  {
    id: "insurance",
    icon: ShieldCheck,
    title: "Travel insurance",
    tagline: "Cover for the unexpected",
    text: "Medical cover, trip delays, lost baggage and cancellations. We explain what each plan covers in plain words and arrange the policy for you.",
    points: [
      "Medical and emergency cover abroad",
      "Trip cancellation and delay cover",
      "Baggage and passport loss cover",
      "Plans that meet visa requirements",
    ],
    image: u("photo-1450101499163-c8848c66ca85"),
    cta: {
      label: "Get a quote",
      href: "/contact",
    },
  },
  {
    id: "transfers",
    icon: Car,
    title: "Cabs and transfers",
    tagline: "Pickup is sorted before you land",
    text: "Airport pickups, sightseeing cars and tempo travellers with experienced drivers, so you spend your time on the trip and not on finding a ride.",
    points: [
      "Airport and station pickup and drop",
      "Cars and tempo travellers for groups",
      "Full-day sightseeing cabs",
      "Fixed prices agreed in advance",
    ],
    image: u("photo-1449965408869-eaa3f722e40d"),
    cta: {
      label: "Book a transfer",
      href: "/contact",
    },
  },
];

/* ========================================================================== */
/* HOW IT WORKS */
/* ========================================================================== */

const STEPS = [
  {
    title: "Tell us your plan",
    text: "Share where you want to go, when and who is travelling.",
  },
  {
    title: "We prepare options",
    text: "You get a clear plan and price, with no hidden extras.",
  },
  {
    title: "You confirm",
    text: "Pay securely and we book every part of the trip.",
  },
  {
    title: "Travel with support",
    text: "We are a call away from the first day to the last.",
  },
];

/* ========================================================================== */
/* IMAGE COMPONENT */
/* ========================================================================== */

function Photo({
  src,
  alt,
  sizes = "50vw",
}: {
  src: string;
  alt: string;
  sizes?: string;
}) {
  const [failed, setFailed] = useState(false);

  // Handle empty image paths and failed image loading.
  if (!src || failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className="absolute inset-0 bg-gradient-to-br from-[#d8c3a5] to-[#8aa6b8]"
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      className="object-cover"
      onError={() => setFailed(true)}
    />
  );
}

/* ========================================================================== */
/* SERVICE ROW COMPONENT */
/* ========================================================================== */

function ServiceRow({
  s,
  index,
}: {
  s: Service;
  index: number;
}) {
  const Icon = s.icon;
  const reversed = index % 2 === 1;

  return (
    <motion.article
      id={s.id}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, ease: EASE }}
      className={`grid scroll-mt-24 items-center gap-12 lg:grid-cols-2 lg:gap-16 ${
        reversed ? "lg:[&>div:first-child]:order-2" : ""
      }`}
    >
      {/* Photo */}

      <div className="relative min-w-0">
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-white shadow-xl sm:rounded-3xl">
          <Photo
            src={s.image}
            alt={s.title}
            sizes="(min-width:1024px) 45vw, 100vw"
          />
        </div>

        <span
          className="absolute -bottom-6 left-5 grid h-12 w-12 place-items-center rounded-full text-white shadow-lg sm:left-6 sm:h-14 sm:w-14"
          style={{ background: BLUE }}
          aria-hidden="true"
        >
          <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
        </span>
      </div>

      {/* Text */}

      <div className="min-w-0">
        <p
          className="text-sm font-medium"
          style={{ color: BLUE }}
        >
          {s.tagline}
        </p>

        <h2
          className={`${heading.className} mt-2 text-[1.75rem] leading-tight sm:text-4xl`}
        >
          {s.title}
        </h2>

        <p
          className="mt-3 max-w-lg text-[15px] leading-relaxed sm:mt-4 sm:text-base"
          style={{ color: `${INK}cc` }}
        >
          {s.text}
        </p>

        {/* Service points */}

        <ul className="mt-5 space-y-3 sm:mt-6">
          {s.points.map((p) => (
            <li
              key={p}
              className="flex items-start gap-3 text-sm leading-snug sm:text-base"
            >
              <Check
                className="mt-0.5 h-5 w-5 shrink-0"
                style={{ color: BLUE }}
              />

              <span>{p}</span>
            </li>
          ))}
        </ul>

        {/* Optional visa pills */}

        {s.pills && (
          <div className="mt-6">
            <p
              className="text-sm font-medium"
              style={{ color: `${INK}b3` }}
            >
              {s.pills.label}
            </p>

            <div className="mt-2 flex flex-wrap gap-2">
              {s.pills.items.map((item) => (
                <span
                  key={item}
                  className="rounded-full border px-3 py-1.5 text-[13px] sm:px-3.5 sm:text-sm"
                  style={{ borderColor: `${INK}33` }}
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}

        <Link
          href={s.cta.href}
          className="mt-7 flex w-full items-center justify-center rounded-full px-8 py-3.5 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 sm:mt-8 sm:inline-flex sm:w-auto"
          style={{ background: s.buttonColor ?? BLUE }}
        >
          {s.cta.label}
        </Link>
      </div>
    </motion.article>
  );
}

/* ========================================================================== */
/* MAIN SERVICES PAGE */
/* ========================================================================== */

export default function ServicesPage({ heroImage }: { heroImage?: string }) {
  // Hero image: prop → env variable → default. Falls back to the default if the URL fails to load.
  const [heroFailed, setHeroFailed] = useState(false);
  const heroSrc =
    (!heroFailed && (heroImage || process.env.NEXT_PUBLIC_SERVICES_HERO_URL)) ||
    DEFAULT_HERO;

  return (
    <MotionConfig reducedMotion="user">
      <div
        className={`${body.className} overflow-x-hidden`}
        style={{ background: CREAM, color: INK }}
      >
        {/* ============================ HERO ============================ */}

        <section className="relative isolate flex min-h-[50svh] items-center justify-center overflow-hidden px-4 pb-12 pt-28 text-center text-white sm:min-h-[62svh] sm:px-6 sm:pt-36 md:pt-40">
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

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE }}
            className="max-w-3xl"
          >
            <h1
              className={`${heading.className} text-4xl font-medium leading-tight [text-shadow:0_4px_30px_rgba(0,0,0,0.7)] sm:text-6xl md:text-7xl`}
            >
              Our Services
            </h1>

            <nav
              aria-label="Breadcrumb"
              className="mt-4 flex items-center justify-center gap-2 text-sm text-white/90 [text-shadow:0_2px_12px_rgba(0,0,0,0.8)]"
            >
              <Link
                href="/"
                className="transition-colors hover:text-white"
              >
                Home
              </Link>

              <span aria-hidden>/</span>

              <span className="text-white">Services</span>
            </nav>

            <p className="mx-auto mt-5 max-w-xl text-[15px] font-medium leading-relaxed text-white [text-shadow:0_2px_16px_rgba(0,0,0,0.9)] sm:mt-6 sm:text-lg">
              Everything for your trip in one place, from the visa to the ride home.
            </p>
          </motion.div>
        </section>

        {/* ======================== SERVICE NAVIGATION ======================== */}

        <nav
          aria-label="Services"
          className="pt-8 sm:pt-12"
        >
          {/* 2-column grid on mobile (no swiping), centred wrapping row from sm up */}
          <ul className="mx-auto grid max-w-[1180px] grid-cols-2 gap-2.5 px-4 sm:flex sm:flex-wrap sm:justify-center sm:gap-3 sm:px-6 md:px-8">
            {SERVICES.map((s) => {
              const Icon = s.icon;

              return (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className="flex h-full items-center gap-2 rounded-2xl border bg-white px-3.5 py-2.5 text-[13px] font-medium leading-tight shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#083858] sm:inline-flex sm:rounded-full sm:px-5 sm:text-sm"
                    style={{ borderColor: `${INK}1f` }}
                  >
                    <Icon
                      className="h-4 w-4 shrink-0"
                      style={{ color: BLUE }}
                    />

                    {s.title}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* ============================ SERVICES ============================ */}

        <section className="px-4 py-14 sm:px-6 sm:py-20 md:px-8 md:py-28">
          <div className="mx-auto max-w-[1180px] space-y-20 md:space-y-32">
            {SERVICES.map((s, i) => (
              <ServiceRow
                key={s.id}
                s={s}
                index={i}
              />
            ))}
          </div>
        </section>

        {/* ========================== HOW IT WORKS ========================== */}

        <section
          className="px-4 py-14 text-white sm:px-6 sm:py-20 md:px-8 md:py-28"
          style={{ background: NAVY }}
        >
          <div className="mx-auto max-w-[1180px]">
            <h2
              className={`${heading.className} max-w-xl text-3xl leading-tight sm:text-4xl md:text-5xl`}
            >
              How {BRAND} works
            </h2>

            <ol className="mt-10 grid grid-cols-1 gap-8 sm:mt-12 sm:grid-cols-2 sm:gap-10 lg:grid-cols-4">
              {STEPS.map((step, i) => (
                <li
                  key={step.title}
                  className="flex gap-5 sm:block"
                >
                  <span
                    className={`${heading.className} block w-10 shrink-0 text-4xl leading-none sm:w-auto sm:text-5xl`}
                    style={{ color: STEP_NUMBER }}
                  >
                    {i + 1}
                  </span>

                  <div>
                    <h3 className="text-lg font-semibold sm:mt-3">
                      {step.title}
                    </h3>

                    <p className="mt-1.5 text-sm leading-relaxed text-white/75 sm:mt-2">
                      {step.text}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ============================ CTA ============================ */}

        <section className="relative isolate overflow-hidden px-4 py-20 text-center text-white sm:px-6 sm:py-28 md:px-8 md:py-36">
          <Image
            src={CTA_IMAGE}
            alt=""
            fill
            sizes="100vw"
            quality={75}
            className="-z-20 object-cover object-center"
          />

          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/55 via-black/45 to-black/70" />

          <div className="mx-auto max-w-2xl">
            <h2
              className={`${heading.className} text-3xl leading-tight [text-shadow:0_4px_30px_rgba(0,0,0,0.7)] sm:text-5xl md:text-6xl`}
            >
              Not sure which service you need?
            </h2>

            <p className="mt-4 text-[15px] text-white/90 [text-shadow:0_2px_14px_rgba(0,0,0,0.8)] sm:mt-5 sm:text-lg">
              Tell us about your trip and we will tell you what you need and what it costs.
            </p>

            <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center sm:gap-4">
              <Link
                href="/contact"
                className="rounded-full px-9 py-3.5 text-center font-semibold text-white shadow-xl ring-1 ring-white/40 transition hover:-translate-y-0.5 hover:brightness-125"
                style={{ background: BLUE }}
              >
                Contact us
              </Link>

              <Link
                href="/DestinationPage"
                className="rounded-full bg-[#F5EFE7] px-9 py-3.5 text-center font-medium text-[#1f1a16] shadow-xl transition hover:-translate-y-0.5 [@media(hover:hover)]:hover:scale-105"
              >
                Explore destinations
              </Link>
            </div>
          </div>
        </section>
      </div>
    </MotionConfig>
  );
}