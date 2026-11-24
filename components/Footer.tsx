import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*  Edit these details                                                         */
/* -------------------------------------------------------------------------- */

const BRAND = "Your Travel Brand"; // replace with your company name
const TAGLINE = "Handpicked holidays across India and the world.";
const COPYRIGHT_YEAR = 2026; // fixed on purpose, see note below

const CONTACT = {
  phone: "+91 00000 00000",
  email: "hello@yourdomain.com",
  address: "Your office address, City, State",
};

const QUICK_LINKS = [
  { label: "Home", href: "/" },
  { label: "Destinations", href: "/#destinations" },
  { label: "Flights", href: "/#flights" },
  { label: "Traveler Stories", href: "/#stories" },
  { label: "Contact", href: "/#contact" },
] as const;

const POLICY_LINKS = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms & Conditions", href: "/terms" },
  { label: "Cancellation Policy", href: "/cancellation-policy" },
] as const;

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

export default function Footer() {
  return (
    <footer className="border-t border-[#083858]/15 bg-white text-[#083858]">
      <div className="mx-auto grid max-w-[1180px] gap-12 px-4 py-16 md:grid-cols-12 md:px-8">
        {/* Brand */}
        <div className="md:col-span-5">
          <p className="font-serif text-3xl">{BRAND}</p>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-[#083858]/75">
            {TAGLINE}
          </p>
        </div>

        {/* Quick links */}
        <nav aria-label="Quick links" className="md:col-span-2">
          <h3 className="text-xs font-semibold uppercase tracking-[0.25em] text-[#083858]/55">
            Explore
          </h3>
          <ul className="mt-5 space-y-3 text-sm">
            {QUICK_LINKS.map((l) => (
              <li key={l.label}>
                <Link
                  href={l.href}
                  className="text-[#083858]/85 transition-colors hover:text-[#083858] hover:underline"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Contact */}
        <div className="md:col-span-5 lg:col-span-5">
          <h3 className="text-xs font-semibold uppercase tracking-[0.25em] text-[#083858]/55">
            Contact
          </h3>
          <ul className="mt-5 space-y-4 text-sm text-[#083858]/85">
            <li className="flex items-start gap-3">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-[#083858]/60" />
              <a
                href={`tel:${CONTACT.phone.replace(/\s/g, "")}`}
                className="transition-colors hover:text-[#083858] hover:underline"
              >
                {CONTACT.phone}
              </a>
            </li>
            <li className="flex items-start gap-3">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-[#083858]/60" />
              <a
                href={`mailto:${CONTACT.email}`}
                className="transition-colors hover:text-[#083858] hover:underline"
              >
                {CONTACT.email}
              </a>
            </li>
            <li className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#083858]/60" />
              <span>{CONTACT.address}</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[#083858]/15">
        <div className="mx-auto flex max-w-[1180px] flex-col gap-4 px-4 py-6 text-xs text-[#083858]/70 md:flex-row md:items-center md:justify-between md:px-8">
          <p>
            © {COPYRIGHT_YEAR} {BRAND}. All rights reserved.
          </p>

          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {POLICY_LINKS.map((l) => (
              <li key={l.label}>
                <Link
                  href={l.href}
                  className="transition-colors hover:text-[#083858] hover:underline"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>

          <p>
            Powered by{" "}
            <span className="font-semibold text-[#083858]">
              Empire AE IT Services
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}