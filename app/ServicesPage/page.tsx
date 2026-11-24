"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
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

const heading = Playfair_Display({ subsets: ["latin"], weight: ["500", "600"], display: "swap" });
const body = Inter({ subsets: ["latin"], weight: ["400", "500", "600"], display: "swap" });

/* ========================================================================== */
/*  EDIT EVERYTHING HERE                                                       */
/* ========================================================================== */

const BRAND = "Your Travel Brand";

const CREAM = "#F7F3EE";
const INK = "#3b2a20";
const NAVY = "#0f2747";
const BLUE = "#083858"; // buttons and icons
const STEP_NUMBER = "#8fb8d9"; // light blue, readable on the dark section
const EASE = [0.22, 1, 0.36, 1] as const;

// Photos: replace any URL with your own (full URL, or a path like "/images/services/visa.jpg").
// If a photo fails to load, a soft colour block is shown instead.
const u = (id: string, w = 1200) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

const HERO_IMAGE = u("photo-1436491865332-7a61a109cc05", 2400);
const CTA_IMAGE = u("photo-1476514525535-07fb3b4ae5f1", 2400);

interface Service {
  id: string;
  icon: LucideIcon;
  title: string;
  tagline: string;
  text: string;
  points: string[];
  /** Small pills shown under the points (optional) */
  pills?: { label: string; items: string[] };
  image: string;
  cta: { label: string; href: string };
  /** Button colour (optional, defaults to blue) */
  buttonColor?: string;
}

// SAMPLE copy: replace with your real services
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
    cta: { label: "View packages", href: "/DestinationPage" },
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
    pills: { label: "Popular visas", items: ["Dubai", "Schengen", "UK", "USA", "Singapore", "Thailand", "Australia"] },
    image: "/images/visaa.jpg",
    cta: { label: "Ask about a visa", href: "/contact" },
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
    cta: { label: "Find a stay", href: "/contact" },
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
    cta: { label: "Get a fare quote", href: "/contact" },
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
    cta: { label: "Get a quote", href: "/contact" },
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
    cta: { label: "Book a transfer", href: "/contact" },
  },
];

const STEPS = [
  { title: "Tell us your plan", text: "Share where you want to go, when and who is travelling." },
  { title: "We prepare options", text: "You get a clear plan and price, with no hidden extras." },
  { title: "You confirm", text: "Pay securely and we book every part of the trip." },
  { title: "Travel with support", text: "We are a call away from the first day to the last." },
];

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

function ServiceRow({ s, index }: { s: Service; index: number }) {
  const Icon = s.icon;
  const reversed = index % 2 === 1;

  return (
    <motion.article
      id={s.id}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: EASE }}
      className={`grid scroll-mt-28 items-center gap-10 lg:grid-cols-2 lg:gap-16 ${
        reversed ? "lg:[&>div:first-child]:order-2" : ""
      }`}
    >
      {/* Photo */}
      <div className="relative">
        <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-white shadow-xl">
          <Photo src={s.image} alt={s.title} sizes="(min-width:1024px) 45vw, 100vw" />
        </div>
        <span
          className="absolute -bottom-5 left-6 grid h-14 w-14 place-items-center rounded-full text-white shadow-lg"
          style={{ background: BLUE }}
          aria-hidden="true"
        >
          <Icon className="h-6 w-6" />
        </span>
      </div>

      {/* Text */}
      <div>
        <p className="text-sm font-medium" style={{ color: BLUE }}>
          {s.tagline}
        </p>
        <h2 className={`${heading.className} mt-2 text-3xl leading-tight sm:text-4xl`}>{s.title}</h2>
        <p className="mt-4 max-w-lg text-base leading-relaxed" style={{ color: `${INK}cc` }}>
          {s.text}
        </p>

        <ul className="mt-6 space-y-3">
          {s.points.map((p) => (
            <li key={p} className="flex items-start gap-3 text-sm sm:text-base">
              <Check className="mt-0.5 h-5 w-5 shrink-0" style={{ color: BLUE }} />
              <span>{p}</span>
            </li>
          ))}
        </ul>

        {s.pills && (
          <div className="mt-6">
            <p className="text-sm font-medium" style={{ color: `${INK}b3` }}>
              {s.pills.label}
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {s.pills.items.map((item) => (
                <span key={item} className="rounded-full border px-3.5 py-1.5 text-sm" style={{ borderColor: `${INK}33` }}>
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}

        <Link
          href={s.cta.href}
          className="mt-8 inline-flex rounded-full px-8 py-3.5 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
          style={{ background: s.buttonColor ?? BLUE }}
        >
          {s.cta.label}
        </Link>
      </div>
    </motion.article>
  );
}

/* ========================================================================== */
/*  Page                                                                       */
/* ========================================================================== */

export default function ServicesPage() {
  return (
    <div className={body.className} style={{ background: CREAM, color: INK }}>
      {/* ------------------------------ Hero ------------------------------ */}
      <section className="relative isolate flex min-h-[62vh] items-center justify-center overflow-hidden px-4 pb-16 pt-40 text-center text-white">
        <Image src={HERO_IMAGE} alt="" fill priority sizes="100vw" quality={75} className="-z-20 object-cover object-center" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/60 via-black/35 to-black/70" />
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE }}
          className="max-w-3xl"
        >
          <h1 className={`${heading.className} text-5xl font-medium leading-tight [text-shadow:0_4px_30px_rgba(0,0,0,0.7)] sm:text-7xl`}>
            Our Services
          </h1>
          <nav aria-label="Breadcrumb" className="mt-4 flex items-center justify-center gap-2 text-sm text-white/80">
            <Link href="/" className="transition-colors hover:text-white">Home</Link>
            <span aria-hidden>/</span>
            <span className="text-white">Services</span>
          </nav>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed [text-shadow:0_2px_14px_rgba(0,0,0,0.8)] sm:text-lg">
            Everything for your trip in one place, from the visa to the ride home.
          </p>
        </motion.div>
      </section>

      {/* ------------------------- Jump to a service ------------------------- */}
      <nav aria-label="Services" className="px-4 pt-12 md:px-8">
        <ul className="mx-auto flex max-w-[1180px] flex-wrap justify-center gap-3">
          {SERVICES.map((s) => {
            const Icon = s.icon;
            return (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className="inline-flex items-center gap-2 rounded-full border bg-white px-5 py-2.5 text-sm font-medium shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#083858]"
                  style={{ borderColor: `${INK}1f` }}
                >
                  <Icon className="h-4 w-4" style={{ color: BLUE }} />
                  {s.title}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* ----------------------------- Services ----------------------------- */}
      <section className="px-4 py-20 md:px-8 md:py-28">
        <div className="mx-auto max-w-[1180px] space-y-24 md:space-y-32">
          {SERVICES.map((s, i) => (
            <ServiceRow key={s.id} s={s} index={i} />
          ))}
        </div>
      </section>

      {/* ---------------------------- How it works ---------------------------- */}
      <section className="px-4 py-20 text-white md:px-8 md:py-28" style={{ background: NAVY }}>
        <div className="mx-auto max-w-[1180px]">
          <h2 className={`${heading.className} max-w-xl text-4xl leading-tight sm:text-5xl`}>
            How {BRAND} works
          </h2>
          <ol className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step, i) => (
              <li key={step.title}>
                <span className={`${heading.className} block text-5xl`} style={{ color: STEP_NUMBER }}>
                  {i + 1}
                </span>
                <h3 className="mt-3 text-lg font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/75">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ------------------------------- CTA ------------------------------- */}
      <section className="relative isolate overflow-hidden px-4 py-28 text-center text-white md:px-8 md:py-36">
        <Image src={CTA_IMAGE} alt="" fill sizes="100vw" quality={70} className="-z-20 object-cover object-center" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/55 via-black/45 to-black/70" />
        <div className="mx-auto max-w-2xl">
          <h2 className={`${heading.className} text-4xl leading-tight [text-shadow:0_4px_30px_rgba(0,0,0,0.7)] sm:text-6xl`}>
            Not sure which service you need?
          </h2>
          <p className="mt-5 text-base text-white/90 [text-shadow:0_2px_14px_rgba(0,0,0,0.8)] sm:text-lg">
            Tell us about your trip and we will tell you what you need and what it costs.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/contact"
              className="rounded-full px-9 py-3.5 font-semibold text-white shadow-xl ring-1 ring-white/40 transition hover:-translate-y-0.5 hover:brightness-125"
              style={{ background: BLUE }}
            >
              Contact us
            </Link>
            <Link
              href="/DestinationPage"
              className="rounded-full bg-[#F5EFE7] px-9 py-3.5 font-medium text-[#1f1a16] shadow-xl transition hover:-translate-y-0.5 hover:scale-105"
            >
              Explore destinations
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}