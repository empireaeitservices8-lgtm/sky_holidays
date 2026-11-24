"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Icon from "./Icon";

/* -------------------------------------------------------------------------- */
/*  Navbar settings – change everything about the navbar here                 */
/* -------------------------------------------------------------------------- */

const BRAND = "Globe Express"; // used as the logo's alt text
const LOGO_SRC = "/images/logo/whitetext.png"; // white-text logo (turned black automatically on light pages)
const NAV_LINKS = [
    { label: "Home", href: "/" },
    { label: "Destinations", href: "/DestinationPage" },
    { label: "Services", href: "/ServicesPage" },
    { label: "About Us", href: "/about" },
    { label: "Contact us", href: "/contact" },
] as const;
const ACCENT = "#f5a623";

// Pages that have a WHITE / LIGHT background -> navbar text and logo turn black there.
// All other pages (dark or photo backgrounds) keep white text.
// Example: const LIGHT_PAGES = ["/contact", "/about"];
const LIGHT_PAGES: string[] = [];

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const pathname = usePathname();
    const isLight = LIGHT_PAGES.includes(pathname);

    // Colour tokens for the current page
    const text = isLight ? "text-black" : "text-white";
    const textSoft = isLight ? "text-black/70" : "text-white/75";
    const textHover = isLight ? "hover:text-black" : "hover:text-white";
    const iconBtn = isLight ? "text-black/90 hover:bg-black/10" : "text-white/90 hover:bg-white/10";
    const exploreBtn = isLight
        ? "border-black/40 text-black hover:bg-black hover:text-white"
        : "border-white/40 text-white hover:bg-white hover:text-black";

    return (
        <header className="absolute inset-x-0 top-0 z-40">
            <nav className="mx-auto flex items-center justify-between px-6 py-2 md:px-12 md:py-3">
                {/* Logo (white logo is turned black with brightness-0 on light pages) */}
                <Link href="/" aria-label={BRAND}>
                    <Image
                        src={LOGO_SRC}
                        alt={BRAND}
                        width={520}
                        height={240}
                        priority
                        className={`h-24 w-auto transition md:h-28 lg:h-32 ${isLight ? "brightness-0" : ""}`}
                    />
                </Link>

                {/* Desktop links */}
                <ul className="hidden items-center gap-9 md:flex">
                    {NAV_LINKS.map((link) => {
                        const active = link.href !== "#" && pathname === link.href;
                        return (
                            <li key={link.label}>
                                <Link
                                    href={link.href}
                                    className={`relative pb-1 text-[11px] font-semibold uppercase tracking-[0.18em] transition-colors ${textHover} ${active ? text : textSoft}`}
                                >
                                    {link.label}
                                    {active && (
                                        <span
                                            className="absolute -bottom-0.5 left-0 h-[2px] w-full"
                                            style={{ background: ACCENT }}
                                        />
                                    )}
                                </Link>
                            </li>
                        );
                    })}
                </ul>

                {/* Right side buttons */}
                <div className="flex items-center gap-3 md:gap-4">
                    <button
                        aria-label="Search"
                        className={`rounded-full p-2 transition ${iconBtn}`}
                    >
                        <Icon className="h-4 w-4">
                            <circle cx="11" cy="11" r="7" />
                            <path d="m20 20-3.5-3.5" />
                        </Icon>
                    </button>
                    <Link
                        href="/login-register"
                        aria-label="Login"
                        className={`hidden rounded-full p-2 transition sm:block ${iconBtn}`}
                    >
                        <Icon className="h-4 w-4">
                            <circle cx="12" cy="8" r="4" />
                            <path d="M4 21a8 8 0 0 1 16 0" />
                        </Icon>
                    </Link>
                    <a
                        href="/DestinationPage"
                        className={`hidden rounded-full border px-5 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] transition sm:inline-block ${exploreBtn}`}
                    >
                        Explore
                    </a>
                    <button
                        aria-label={menuOpen ? "Close menu" : "Open menu"}
                        onClick={() => setMenuOpen((v) => !v)}
                        className={`rounded-full p-2 transition md:hidden ${iconBtn}`}
                    >
                        <Icon className="h-5 w-5">
                            {menuOpen ? (
                                <>
                                    <path d="M6 6l12 12" />
                                    <path d="M18 6L6 18" />
                                </>
                            ) : (
                                <>
                                    <path d="M4 7h16" />
                                    <path d="M4 12h16" />
                                    <path d="M4 17h16" />
                                </>
                            )}
                        </Icon>
                    </button>
                </div>
            </nav>

            {/* Mobile menu (dark glass panel, readable on any page) */}
            {menuOpen && (
                <ul className="mx-6 rounded-2xl bg-black/70 p-4 backdrop-blur-md md:hidden">
                    {NAV_LINKS.map((link) => (
                        <li key={link.label}>
                            <Link
                                href={link.href}
                                onClick={() => setMenuOpen(false)}
                                className="block px-3 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-white/90"
                            >
                                {link.label}
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </header>
    );
}