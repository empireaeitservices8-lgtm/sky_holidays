"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Icon from "./Icon";

/* -------------------------------------------------------------------------- */
/*  Navbar settings – change everything about the navbar here                 */
/* -------------------------------------------------------------------------- */

const BRAND = "Globe Express"; // used as the logo's alt text
const LOGO_SRC = "/images/logo/whitetext.png"; // white-text logo (turned black automatically on light backgrounds)
const NAV_LINKS = [
    { label: "Home", href: "/" },
    { label: "Destinations", href: "/DestinationPage" },
    { label: "Services", href: "/ServicesPage" },
    { label: "About Us", href: "/about" },
    { label: "Contact us", href: "/contact" },
] as const;
const ACCENT = "#f5a623";

type Theme = "dark" | "light"; // "dark" = dark background behind the navbar -> white text

/**
 * HOW THE COLOUR WORKS
 * While you scroll, the navbar checks what is behind it:
 *   - photo / dark colour behind it  -> white text and logo
 *   - white / light colour behind it -> black text and logo
 * To force a colour for one section, add  data-nav-theme="light"  or  data-nav-theme="dark"  to it.
 */

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [theme, setTheme] = useState<Theme>("dark");
    const [scrolled, setScrolled] = useState(false);
    const [hidden, setHidden] = useState(false);
    const headerRef = useRef<HTMLElement>(null);
    const pathname = usePathname();

    // Close mobile menu whenever pathname changes
    useEffect(() => {
        setMenuOpen(false);
    }, [pathname]);

    // Auto colour + hide on scroll down / show on scroll up
    useEffect(() => {
        // 1x1 canvas converts any CSS colour (rgb, oklch, ...) into plain RGBA numbers
        const canvas = document.createElement("canvas");
        canvas.width = canvas.height = 1;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });

        const toRGBA = (color: string) => {
            if (!ctx) return null;
            ctx.clearRect(0, 0, 1, 1);
            ctx.fillStyle = "#000";
            ctx.fillStyle = color;
            ctx.fillRect(0, 0, 1, 1);
            const d = ctx.getImageData(0, 0, 1, 1).data;
            return { r: d[0], g: d[1], b: d[2], a: d[3] / 255 };
        };

        const detect = () => {
            const header = headerRef.current;
            if (!header) return;
            const y = Math.min(header.offsetHeight / 2, 80);
            const els = document.elementsFromPoint(window.innerWidth / 2, y);
            let result: Theme = "dark";

            for (const el of els) {
                if (header.contains(el)) continue;

                const flagged = el.closest("[data-nav-theme]") as HTMLElement | null;
                if (flagged) {
                    result = flagged.dataset.navTheme === "light" ? "light" : "dark";
                    break;
                }

                const tag = el.tagName;
                if (tag === "IMG" || tag === "VIDEO" || tag === "CANVAS" || tag === "IFRAME") {
                    result = "dark";
                    break;
                }

                const cs = getComputedStyle(el);
                if (cs.backgroundImage.includes("url(")) {
                    result = "dark";
                    break;
                }

                const c = toRGBA(cs.backgroundColor);
                if (c && c.a > 0.6) {
                    const luminance = (0.299 * c.r + 0.587 * c.g + 0.114 * c.b) / 255;
                    result = luminance > 0.6 ? "light" : "dark";
                    break;
                }
            }
            setTheme(result);
        };

        let lastY = window.scrollY;
        let ticking = false;

        const onScroll = () => {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(() => {
                const y = window.scrollY;
                setScrolled(y > 10);
                if (y > lastY && y > 200) {
                    setHidden(true); // scrolling down: hide
                    setMenuOpen(false);
                } else if (y < lastY) {
                    setHidden(false); // scrolling up: show
                }
                lastY = y;
                detect();
                ticking = false;
            });
        };

        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", detect);
        detect();
        const t1 = setTimeout(detect, 300); // again after images / fonts load
        const t2 = setTimeout(detect, 1200);

        return () => {
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", detect);
            clearTimeout(t1);
            clearTimeout(t2);
        };
    }, [pathname]);

    const isLight = theme === "light";

    // Colour tokens for the current background
    const text = isLight ? "text-black" : "text-white";
    const textSoft = isLight ? "text-black/70" : "text-white/75";
    const textHover = isLight ? "hover:text-black" : "hover:text-white";
    const iconBtn = isLight ? "text-black/90 hover:bg-black/10" : "text-white/90 hover:bg-white/10";
    const bar = scrolled
        ? isLight
            ? "bg-white/70 shadow-sm backdrop-blur-md"
            : "bg-black/30 backdrop-blur-md"
        : "";

    return (
        <header
            ref={headerRef}
            className={`fixed inset-x-0 top-0 z-40 w-full transition-transform duration-300 ${
                hidden && !menuOpen ? "-translate-y-full" : "translate-y-0"
            }`}
        >
            <nav
                aria-label="Main Navigation"
                className={`mx-auto flex max-w-7xl items-center justify-between px-4 py-2 transition-colors duration-300 sm:px-6 sm:py-2.5 md:px-10 md:py-3 lg:px-12 ${bar}`}
            >
                {/* Logo: big at the top of the page, smaller once you scroll so the bar stays slim.
                    (white logo is turned black with brightness-0 on light backgrounds) */}
                <Link href="/" aria-label={BRAND} className="flex min-w-0 shrink items-center">
                    <Image
                        src={LOGO_SRC}
                        alt={BRAND}
                        width={520}
                        height={240}
                        priority
                        className={`w-auto max-w-full object-contain transition-all duration-300 ${
                            scrolled ? "h-20 sm:h-24" : "h-40"
                        } ${isLight ? "brightness-0" : ""}`}
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

            {/* Mobile menu (dark glass panel, readable on any background) */}
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
                </div>
            )}
        </header>
    );
}