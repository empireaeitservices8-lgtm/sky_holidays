"use client";
import { useEffect, useState } from "react";
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

    // Close mobile menu whenever pathname changes
    useEffect(() => {
        setMenuOpen(false);
    }, [pathname]);

    // Colour tokens for the current page
    const text = isLight ? "text-black" : "text-white";
    const textSoft = isLight ? "text-black/70" : "text-white/75";
    const textHover = isLight ? "hover:text-black" : "hover:text-white";
    const iconBtn = isLight ? "text-black/90 hover:bg-black/10" : "text-white/90 hover:bg-white/10";

    return (
        <header className="absolute inset-x-0 top-0 z-40 w-full">
            <nav
                aria-label="Main Navigation"
                className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 sm:px-6 sm:py-2.5 md:px-10 md:py-3 lg:px-12"
            >
                {/* Logo: same height on mobile and laptop (white logo is turned black with brightness-0 on light pages).
                    min-w-0 / shrink / max-w-full let it scale down only if the screen is too narrow to fit the icons. */}
                <Link href="/" aria-label={BRAND} className="flex min-w-0 shrink items-center">
                    <Image
                        src={LOGO_SRC}
                        alt={BRAND}
                        width={520}
                        height={240}
                        priority
                        className={`h-40 w-auto max-w-full object-contain transition ${isLight ? "brightness-0" : ""}`}
                    />
                </Link>

                {/* Desktop links */}
                <ul className="hidden items-center gap-5 md:flex lg:gap-8 xl:gap-9">
                    {NAV_LINKS.map((link) => {
                        const active = pathname === link.href;
                        return (
                            <li key={link.label}>
                                <Link
                                    href={link.href}
                                    aria-current={active ? "page" : undefined}
                                    className={`relative pb-1 text-[11px] font-semibold uppercase tracking-[0.14em] transition-colors lg:tracking-[0.18em] ${textHover} ${active ? text : textSoft}`}
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

                {/* Right side buttons (shrink-0 so the icons are never squeezed by the logo) */}
                <div className="flex shrink-0 items-center gap-2 sm:gap-3 md:gap-4">
                    {/* <button
                        aria-label="Search"
                        className={`rounded-full p-2 transition ${iconBtn}`}
                    >
                        <Icon className="h-4 w-4">
                            <circle cx="11" cy="11" r="7" />
                            <path d="m20 20-3.5-3.5" />
                        </Icon>
                    </button> */}
                    {/* <Link
                        href="/login-register"
                        aria-label="Login"
                        className={`hidden rounded-full p-2 transition sm:block ${iconBtn}`}
                    >
                        <Icon className="h-4 w-4">
                            <circle cx="12" cy="8" r="4" />
                            <path d="M4 21a8 8 0 0 1 16 0" />
                        </Icon>
                    </Link> */}
                    {/* <Link
                        href="/DestinationPage"
                        className={`hidden rounded-full border px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] transition sm:inline-block md:px-5 md:tracking-[0.2em] ${exploreBtn}`}
                    >
                        Explore
                    </Link> */}
                    <button
                        aria-label={menuOpen ? "Close menu" : "Open menu"}
                        aria-expanded={menuOpen}
                        aria-controls="mobile-nav"
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
                <div
                    id="mobile-nav"
                    className="mx-4 mt-1 rounded-2xl border border-white/15 bg-neutral-950/90 p-5 shadow-2xl backdrop-blur-xl sm:mx-6 md:hidden"
                >
                    <ul className="space-y-1">
                        {NAV_LINKS.map((link) => {
                            const active = pathname === link.href;
                            return (
                                <li key={link.label}>
                                    <Link
                                        href={link.href}
                                        aria-current={active ? "page" : undefined}
                                        onClick={() => setMenuOpen(false)}
                                        className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] transition ${
                                            active
                                                ? "bg-white/15 text-white"
                                                : "text-white/80 hover:bg-white/10 hover:text-white"
                                        }`}
                                    >
                                        <span>{link.label}</span>
                                        {active && (
                                            <span
                                                className="h-1.5 w-1.5 rounded-full"
                                                style={{ background: ACCENT }}
                                            />
                                        )}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>

                    {/* Mobile menu bottom action buttons */}
                    <div className="mt-4 flex flex-col gap-2.5 border-t border-white/15 pt-4">
                        {/* <Link
                            href="/DestinationPage"
                            onClick={() => setMenuOpen(false)}
                            className="flex items-center justify-center rounded-full bg-white px-5 py-2.5 text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-black shadow-md transition hover:bg-white/90"
                        >
                            Explore Destinations
                        </Link>
                        <Link
                            href="/login-register"
                            onClick={() => setMenuOpen(false)}
                            className="flex items-center justify-center gap-2 rounded-full border border-white/30 px-5 py-2 text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-white/10"
                        >
                            <Icon className="h-3.5 w-3.5">
                                <circle cx="12" cy="8" r="4" />
                                <path d="M4 21a8 8 0 0 1 16 0" />
                            </Icon>
                            <span>Login / Register</span>
                        </Link> */}
                    </div>
                </div>
            )}
        </header>
    );
}