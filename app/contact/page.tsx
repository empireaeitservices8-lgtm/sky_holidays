"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Playfair_Display, Inter } from "next/font/google";
import {
  CheckCircle2,
  ChevronDown,
  Clock,
  Headset,
  Mail,
  MapPin,
  Phone,
  Send,
  ShieldCheck,
  Sparkles,
  Tag,
  Users,
} from "lucide-react";

const heading = Playfair_Display({ subsets: ["latin"], weight: ["500", "600"], display: "swap" });
const body = Inter({ subsets: ["latin"], weight: ["400", "500", "600"], display: "swap" });

/* -------------------------------------------------------------------------- */
/*  Edit these details                                                         */
/* -------------------------------------------------------------------------- */

const BRAND = "Your Travel Brand";
const PHONE = "+91 00000 00000";
const EMAIL = "hello@yourdomain.com";
const ADDRESS = "Your office address, Business Bay, Dubai, UAE";
const MAP_QUERY = "Business Bay, Dubai, United Arab Emirates";// what the map should show
const HOURS = "Mon – Sat, 9:30 AM – 6:30 PM";

// Full-page background photo (stays fixed while the content scrolls).
// Paste any image URL, or a local path like "/images/contact-bg.jpg".
const BG_IMAGE =
  "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=2400&q=80";

const ACCENT = "#F07850"; // coral, same as the Search button
const CREAM = "#F5EFE7";
const EASE = [0.22, 1, 0.36, 1] as const;

const SUBJECTS = [
  "Trip enquiry",
  "Custom package",
  "Booking support",
  "Flights & visas",
  "Feedback",
  "Something else",
] as const;

const REASONS = [
  { icon: Sparkles, label: "Personalized Travel Planning" },
  { icon: ShieldCheck, label: "Fast & Secure Booking" },
  { icon: Headset, label: "24/7 Customer Support" },
  { icon: Users, label: "Local Travel Experts" },
  { icon: Tag, label: "Exclusive Travel Deals" },
] as const;

type Status = "idle" | "sending" | "success" | "error";

/* -------------------------------------------------------------------------- */
/*  Small pieces                                                              */
/* -------------------------------------------------------------------------- */

const glass =
  "rounded-3xl border border-white/30 bg-black/40 backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.35)]";

const fieldClass =
  "w-full rounded-xl border border-white/30 bg-white/10 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/60 focus:border-white focus:bg-white/15 focus:ring-2 focus:ring-white/20";

function Field({ label, htmlFor, children }: { label: string; htmlFor: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block text-[11px] font-semibold uppercase tracking-widest text-white/80">
        {label}
      </label>
      {children}
    </div>
  );
}

function InfoCard({ icon: Icon, title, text, href }: { icon: typeof MapPin; title: string; text: string; href?: string }) {
  const body = (
    <>
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-white" style={{ background: ACCENT }}>
        <Icon className="h-5 w-5" />
      </span>
      <span>
        <span className="block text-sm font-semibold text-white">{title}</span>
        <span className="mt-1 block text-sm leading-relaxed text-white/80">{text}</span>
      </span>
    </>
  );
  const cls = `flex items-start gap-4 p-5 ${glass} !rounded-2xl`;
  return href ? (
    <a href={href} className={`${cls} transition duration-300 hover:-translate-y-1 hover:bg-black/50`}>{body}</a>
  ) : (
    <div className={cls}>{body}</div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

export default function ContactSection() {
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const payload = Object.fromEntries(new FormData(form).entries());
    setStatus("sending");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Request failed");
      form.reset();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    // clip-path keeps the fixed background from covering the footer below
    <div className={`${body.className} relative isolate text-white [clip-path:inset(0)]`}>
      {/* Fixed background photo + readability overlays */}
      <div className="fixed inset-0 -z-10 bg-neutral-900">
        <Image src={BG_IMAGE} alt="" fill priority sizes="100vw" quality={75} className="object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/75" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.35),transparent_70%)]" />
      </div>

      {/* ------------------------------ Hero ------------------------------ */}
      <section className="px-4 pb-12 pt-28 text-center sm:pt-36 md:pb-20 md:pt-44">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="mx-auto max-w-2xl"
        >
          <h1 className={`${heading.className} text-4xl font-medium leading-tight [text-shadow:0_4px_30px_rgba(0,0,0,0.7)] sm:text-6xl md:text-7xl`}>
            Contact Us
          </h1>
          <nav aria-label="Breadcrumb" className="mt-4 flex items-center justify-center gap-2 text-sm text-white/80">
            <Link href="/" className="transition-colors hover:text-white">Home</Link>
            <span aria-hidden>/</span>
            <span className="text-white">Contact Us</span>
          </nav>
          <p className="mx-auto mt-6 max-w-lg text-base leading-relaxed text-white [text-shadow:0_2px_14px_rgba(0,0,0,0.8)] sm:text-lg">
            Planning a trip or have a question? Send us a message and our team will get back to you shortly.
          </p>
        </motion.div>
      </section>

      {/* --------------------------- Map + cards --------------------------- */}
      <section className="px-4 md:px-8">
        <div className="relative mx-auto max-w-[1180px]">
          <div className="h-[300px] overflow-hidden rounded-3xl border border-white/30 shadow-2xl md:h-[460px]">
            <iframe
              title={`${BRAND} location map`}
              src={`https://www.google.com/maps?q=${encodeURIComponent(MAP_QUERY)}&output=embed`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-full w-full border-0 grayscale-[0.4]"
            />
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:absolute lg:inset-x-6 lg:bottom-6 lg:mt-0 lg:grid-cols-3">
            <InfoCard icon={MapPin} title="Office Address" text={ADDRESS} />
            <InfoCard icon={Mail} title="Message Us" text={EMAIL} href={`mailto:${EMAIL}`} />
            <InfoCard icon={Phone} title="Call Us" text={PHONE} href={`tel:${PHONE.replace(/\s/g, "")}`} />
          </div>
        </div>
      </section>

      {/* --------------------------- Form + info --------------------------- */}
      <section className="px-4 py-16 md:px-8 md:py-24">
        <div className="mx-auto grid max-w-[1180px] gap-10 lg:grid-cols-2 lg:gap-14">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: EASE }}
            className={`${glass} p-6 sm:p-9`}
          >
            <h2 className={`${heading.className} text-3xl`}>Send Us a Message</h2>

            <form onSubmit={handleSubmit} className="mt-7 space-y-5">
              {/* Honeypot: real users never see or fill this */}
              <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />

              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Your Name *" htmlFor="name">
                  <input id="name" name="name" type="text" required minLength={2} autoComplete="name" placeholder="Enter your name" className={fieldClass} />
                </Field>
                <Field label="Email *" htmlFor="email">
                  <input id="email" name="email" type="email" required autoComplete="email" placeholder="Your email address" className={fieldClass} />
                </Field>
              </div>

              <Field label="Subject *" htmlFor="subject">
                <div className="relative">
                  <select
                    id="subject"
                    name="subject"
                    required
                    defaultValue=""
                    className={`${fieldClass} appearance-none pr-10 [&>option]:text-black`}
                  >
                    <option value="" disabled>Choose a subject</option>
                    {SUBJECTS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/70" />
                </div>
              </Field>

              <Field label="Message *" htmlFor="message">
                <textarea
                  id="message"
                  name="message"
                  required
                  minLength={10}
                  rows={5}
                  placeholder="Tell us about your trip: where, when and how many travelers"
                  className={`${fieldClass} resize-none`}
                />
              </Field>

              <button
                type="submit"
                disabled={status === "sending"}
                className="inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:brightness-110 active:translate-y-0 disabled:opacity-60"
                style={{ background: ACCENT }}
              >
                {status === "sending" ? "Sending…" : "Send Message"}
                <Send className="h-4 w-4" />
              </button>

              <p aria-live="polite" className="min-h-5 text-sm">
                {status === "success" && (
                  <span className="text-emerald-300">Thank you! Your message has been sent. We&apos;ll be in touch soon.</span>
                )}
                {status === "error" && (
                  <span className="text-red-300">Something went wrong. Please try again, or call us directly.</span>
                )}
              </p>
            </form>
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
            className="flex flex-col justify-center"
          >
            <h2 className={`${heading.className} text-3xl leading-tight [text-shadow:0_4px_24px_rgba(0,0,0,0.7)] sm:text-4xl`}>
              Get in Touch with {BRAND}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-white/90 [text-shadow:0_2px_12px_rgba(0,0,0,0.8)]">
              Have questions about planning your next trip? Contact us and let&apos;s start building your travel experience together.
            </p>

            <h3 className={`${heading.className} mt-9 text-xl`}>Why Reach Out to Us</h3>
            <ul className="mt-5 grid gap-x-8 gap-y-4 sm:grid-cols-2">
              {REASONS.map(({ icon: Icon, label }) => (
                <li key={label} className="flex items-center gap-3 text-sm font-medium [text-shadow:0_1px_8px_rgba(0,0,0,0.8)]">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-white/30 bg-white/15 backdrop-blur">
                    <Icon className="h-4 w-4" />
                  </span>
                  {label}
                </li>
              ))}
            </ul>

            <div className={`${glass} mt-10 !rounded-2xl p-6`}>
              <p className="flex items-center gap-2 text-sm font-semibold">
                <CheckCircle2 className="h-4 w-4" style={{ color: ACCENT }} />
                Need urgent assistance?
              </p>
              <a
                href={`tel:${PHONE.replace(/\s/g, "")}`}
                className="mt-4 inline-flex items-center gap-2 rounded-full px-7 py-3 text-base font-medium text-[#1f1a16] shadow-xl transition hover:-translate-y-0.5 hover:scale-105"
                style={{ background: CREAM }}
              >
                <Phone className="h-4 w-4" />
                Call Us Now
              </a>
              <p className="mt-4 flex items-center gap-2 text-sm text-white/80">
                <Clock className="h-4 w-4" />
                {HOURS}
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}