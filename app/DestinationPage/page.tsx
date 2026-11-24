"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Playfair_Display, Inter } from "next/font/google";

const heading = Playfair_Display({ subsets: ["latin"], weight: ["500", "600"], display: "swap" });
const body = Inter({ subsets: ["latin"], weight: ["400", "500", "600"], display: "swap" });

/* ---------------- Data (replace with your real data / API) ---------------- */
const u = (id: string, w: number) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

interface Destination {
  id: string;
  name: string;
  country: string;
  heroImage: string;
  cardImage: string;
  description: string;
}

// Hero (big background) photo and card photo are different on purpose.
// To change an image, replace its photo ID (or swap u(...) for any full image URL).
const make = (id: string, name: string, country: string, heroPhoto: string, cardPhoto: string, description: string): Destination => ({
  id, name, country, description, heroImage: u(heroPhoto, 2400), cardImage: u(cardPhoto, 600),
});

const destinations: Destination[] = [
  make("santorini", "Santorini", "Greece", "photo-1570077188670-e3a8d69ac5ff", "photo-1613395877344-13d4a8e0d49e", "Whitewashed villages and blue domes above the Aegean."),
  make("amalfi", "Amalfi Coast", "Italy", "photo-1534113414509-0eec2bfb493f", "photo-1533676802871-eca1ae998cd5", "Cliffside towns glowing over a golden Mediterranean sunset."),
  make("bora-bora", "Bora Bora", "French Polynesia", "photo-1589197331516-4d84b72ebde3", "photo-1532408840957-031d8034aeef", "Overwater villas on turquoise lagoons."),
  make("machu-picchu", "Machu Picchu", "Peru", "photo-1526392060635-9d6019884377", "photo-1587595431973-160d0d94add1", "An ancient Incan citadel in the clouds."),
  make("serengeti", "Serengeti", "Tanzania", "photo-1516426122078-c23e76319801", "photo-1547970810-dc1eac37d174", "Endless savannah and the great migration."),
  make("kyoto", "Kyoto", "Japan", "photo-1493976040374-85c8e12f0c0e", "photo-1528164344705-47542687000d", "Temples, pagodas and misty reflections."),
  make("maldives", "Maldives", "Maldives", "photo-1514282401047-d79a71a590e8", "photo-1573843981267-be1999ff37cd", "Private islands and crystal-clear water."),
  make("swiss-alps", "Swiss Alps", "Switzerland", "photo-1531366936337-7c912a4589a7", "photo-1530122037265-a5f1f91d3b99", "Snow-capped peaks and alpine villages."),
  make("bali", "Bali", "Indonesia", "photo-1537996194471-e657df975ab4", "photo-1518548419970-58e3b4079ab2", "Rice terraces, temples and tropical calm."),
  make("paris", "Paris", "France", "photo-1502602898657-3e91760cbb34", "photo-1499856871958-5b9627545d1a", "Cafés, art and the Eiffel Tower at dusk."),
  make("dubai", "Dubai", "UAE", "photo-1512453979798-5ea266f8880c", "photo-1518684079-3c830dcef090", "A futuristic skyline rising from the desert."),
  make("iceland", "Iceland", "Iceland", "photo-1504829857797-ddff29c27927", "photo-1531168556467-80aace0d0144", "Waterfalls, glaciers and northern lights."),
  // More destinations (same photo used for background and card — add a second ID to use a different card photo)
  make("tokyo", "Tokyo", "Japan", "photo-1540959733332-eab4deabeeaf", "photo-1540959733332-eab4deabeeaf", "Neon nights and quiet shrines side by side."),
  make("new-york", "New York", "USA", "photo-1496442226666-8d4d0e62e6e9", "photo-1496442226666-8d4d0e62e6e9", "The skyline that never sleeps."),
  make("london", "London", "United Kingdom", "photo-1513635269975-59663e0ac1ad", "photo-1513635269975-59663e0ac1ad", "Royal landmarks and riverside views."),
  make("rome", "Rome", "Italy", "photo-1552832230-c0197dd311b5", "photo-1552832230-c0197dd311b5", "Ancient ruins and timeless piazzas."),
  make("venice", "Venice", "Italy", "photo-1514890547357-a9ee288728e0", "photo-1514890547357-a9ee288728e0", "Gondolas drifting through glittering canals."),
  make("barcelona", "Barcelona", "Spain", "photo-1583422409516-2895a77efded", "photo-1583422409516-2895a77efded", "Gaudí architecture and sunny beaches."),
  make("cappadocia", "Cappadocia", "Turkey", "photo-1570939274717-7eda259b50ed", "photo-1570939274717-7eda259b50ed", "Hot-air balloons over fairy-chimney valleys."),
  make("petra", "Petra", "Jordan", "photo-1579606032821-4e6161c81bd3", "photo-1579606032821-4e6161c81bd3", "The rose-red city carved into stone."),
  make("sydney", "Sydney", "Australia", "photo-1506973035872-a4ec16b8e8d9", "photo-1506973035872-a4ec16b8e8d9", "Harbour views and the iconic Opera House."),
  make("cape-town", "Cape Town", "South Africa", "photo-1580060839134-75a5edca2e99", "photo-1580060839134-75a5edca2e99", "Table Mountain meets the Atlantic."),
  make("marrakech", "Marrakech", "Morocco", "photo-1597212618440-806262de4f6b", "photo-1597212618440-806262de4f6b", "Souks, spices and riad courtyards."),
  make("agra", "Agra", "India", "photo-1564507592333-c60657eea523", "photo-1564507592333-c60657eea523", "The Taj Mahal glowing at sunrise."),
  make("grand-canyon", "Grand Canyon", "USA", "photo-1474044159687-1ee9f3a51722", "photo-1474044159687-1ee9f3a51722", "Layers of red rock stretching to the horizon."),
  make("banff", "Banff", "Canada", "photo-1561134643-668f9057cce4", "photo-1561134643-668f9057cce4", "Turquoise lakes beneath the Rockies."),
  make("great-barrier-reef", "Great Barrier Reef", "Australia", "photo-1582967788606-a171c1080cb0", "photo-1582967788606-a171c1080cb0", "The world's largest living coral reef."),
  make("phuket", "Phuket", "Thailand", "photo-1552465011-b4e21bf6e79a", "photo-1552465011-b4e21bf6e79a", "Limestone cliffs and warm Andaman waters."),
  make("singapore", "Singapore", "Singapore", "photo-1525625293386-3f8f99389edd", "photo-1525625293386-3f8f99389edd", "Garden city with a dazzling skyline."),
  make("hawaii", "Hawaii", "USA", "photo-1507876466758-bc54f384809c", "photo-1507876466758-bc54f384809c", "Volcanic landscapes and golden beaches."),
];

const AUTO_CHANGE_MS = 2000; // background changes automatically every 2 seconds


/* ---------------- Tiny inline icons ---------------- */
type IconProps = { size?: number; className?: string; fill?: boolean };
const Svg = ({ size = 20, className, fill, children }: IconProps & { children: React.ReactNode }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill ? "currentColor" : "none"} stroke="currentColor"
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">{children}</svg>
);
const PinIcon = (p: IconProps) => <Svg {...p}><path d="M12 21s7-6.1 7-11a7 7 0 1 0-14 0c0 4.9 7 11 7 11z" /><circle cx="12" cy="10" r="2.5" /></Svg>;
const CalIcon = (p: IconProps) => <Svg {...p}><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" /></Svg>;
const UserIcon = (p: IconProps) => <Svg {...p}><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 4-6 8-6s8 2 8 6" /></Svg>;
const SearchIcon = (p: IconProps) => <Svg {...p}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></Svg>;
const HeartIcon = (p: IconProps) => <Svg {...p}><path d="M12 21s-8-5.2-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 5.8-8 11-8 11z" /></Svg>;
const MinusIcon = (p: IconProps) => <Svg {...p}><path d="M5 12h14" /></Svg>;
const PlusIcon = (p: IconProps) => <Svg {...p}><path d="M12 5v14M5 12h14" /></Svg>;

/* ---------------- Search panel ---------------- */
interface SearchParams { destination: string; checkIn: string; checkOut: string; travelers: number }

function SearchPanel({ query, setQuery, onSearch }: { query: string; setQuery: (v: string) => void; onSearch: (p: SearchParams) => void }) {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [travelers, setTravelers] = useState(2);
  const [open, setOpen] = useState(false);
  const [today, setToday] = useState("");

  useEffect(() => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    setToday(now.toISOString().split("T")[0]);
  }, []);

  const suggestions = destinations.filter((d) => `${d.name} ${d.country}`.toLowerCase().includes(query.toLowerCase()));
  const label = "block text-[10px] font-semibold uppercase tracking-widest text-white/80";
  const field = "flex flex-1 items-center gap-3 px-4 py-2.5";

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); onSearch({ destination: query, checkIn, checkOut, travelers }); }}
      className="mx-auto w-full max-w-4xl rounded-3xl border border-white/50 bg-black/40 p-2 text-white shadow-[0_10px_40px_rgba(0,0,0,0.45)] ring-1 ring-black/30 backdrop-blur-xl md:rounded-full"
    >
      <div className="flex flex-col divide-y divide-white/25 md:flex-row md:items-center md:divide-x md:divide-y-0">
        <div className="relative flex-1 text-left">
          <label className={field}>
            <PinIcon size={22} className="shrink-0" />
            <span className="w-full">
              <span className={label}>Destination</span>
              <input value={query} onChange={(e) => setQuery(e.target.value)} onFocus={() => setOpen(true)}
                onBlur={() => setTimeout(() => setOpen(false), 150)} placeholder="Where to?" autoComplete="off"
                className="w-full bg-transparent text-base font-medium outline-none placeholder:text-white" />
            </span>
          </label>
          {open && suggestions.length > 0 && (
            <ul className="absolute left-2 right-2 top-full z-40 mt-2 max-h-64 overflow-auto rounded-2xl border border-white/30 bg-black/80 backdrop-blur-xl">
              {suggestions.map((d) => (
                <li key={d.id}>
                  <button type="button" onMouseDown={() => { setQuery(d.name); setOpen(false); }} className="w-full px-4 py-2.5 text-left text-sm hover:bg-white/15">
                    {d.name}, <span className="text-white/70">{d.country}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <label className={`${field} text-left`}>
          <CalIcon size={22} className="shrink-0" />
          <span className="w-full">
            <span className={label}>Dates</span>
            <span className="flex items-center gap-1.5">
              <input type="date" min={today} value={checkIn} aria-label="Check-in"
                onChange={(e) => { setCheckIn(e.target.value); if (checkOut && e.target.value > checkOut) setCheckOut(""); }}
                className="w-[7.5rem] bg-transparent text-sm outline-none [color-scheme:dark]" />
              <span className="text-white/60">–</span>
              <input type="date" min={checkIn || today} value={checkOut} aria-label="Check-out" onChange={(e) => setCheckOut(e.target.value)}
                className="w-[7.5rem] bg-transparent text-sm outline-none [color-scheme:dark]" />
            </span>
          </span>
        </label>

        <div className={`${field} text-left`}>
          <UserIcon size={22} className="shrink-0" />
          <span className="w-full">
            <span className={label}>Travelers</span>
            <span className="flex items-center gap-3 whitespace-nowrap">
              <button type="button" aria-label="Fewer travelers" onClick={() => setTravelers((t) => Math.max(1, t - 1))} className="rounded-full border border-white/50 p-1 transition hover:bg-white/20"><MinusIcon size={14} /></button>
              <span className="text-base font-medium">{travelers} {travelers === 1 ? "Traveler" : "Travelers"}</span>
              <button type="button" aria-label="More travelers" onClick={() => setTravelers((t) => Math.min(12, t + 1))} className="rounded-full border border-white/50 p-1 transition hover:bg-white/20"><PlusIcon size={14} /></button>
            </span>
          </span>
        </div>

        <div className="p-2 md:pl-3 md:pr-1">
          <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-full bg-[#F07850] px-8 py-3.5 font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:brightness-110 active:translate-y-0">
            <SearchIcon size={18} /> Search
          </button>
        </div>
      </div>
    </form>
  );
}

/* ---------------- Card ---------------- */
function Card({ d, active, favorite, onSelect, onFavorite }: { d: Destination; active: boolean; favorite: boolean; onSelect: (id: string) => void; onFavorite: (id: string) => void }) {
  const [src, setSrc] = useState(d.cardImage);
  return (
    <div
      role="button" tabIndex={0} aria-pressed={active} aria-label={`${d.name}, ${d.country}`}
      onClick={() => onSelect(d.id)} onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onSelect(d.id)}
      className={`group relative aspect-[4/5] w-full cursor-pointer overflow-hidden rounded-2xl border-2 shadow-lg transition duration-300 hover:-translate-y-1 hover:scale-[1.03] ${active ? "border-white ring-2 ring-white/70" : "border-white/30"}`}
    >
      <Image src={src} alt="" fill sizes="(min-width:1024px) 15vw, (min-width:640px) 30vw, 45vw" draggable={false} onError={() => setSrc(d.heroImage)} className="object-cover transition-transform duration-500 group-hover:scale-110" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent transition-opacity group-hover:from-black/90" />
      <button type="button" aria-label={favorite ? "Remove from wishlist" : "Add to wishlist"}
        onClick={(e) => { e.stopPropagation(); onFavorite(d.id); }}
        className={`absolute right-2 top-2 rounded-full bg-black/25 p-1.5 backdrop-blur transition hover:bg-black/45 ${favorite ? "text-[#F07850]" : "text-white"}`}>
        <HeartIcon size={18} fill={favorite} />
      </button>
      <div className="absolute bottom-3 left-3 right-3 text-left text-white [text-shadow:0_1px_8px_rgba(0,0,0,0.8)]">
        <p className={`${heading.className} text-lg leading-tight`}>{d.name}</p>
        <p className="text-xs text-white/90">{d.country}</p>
      </div>
    </div>
  );
}

/* ---------------- Page component ---------------- */
export default function DestinationPage() {
  const [activeId, setActiveId] = useState(destinations[0].id);
  const [query, setQuery] = useState("");
  const [favorites, setFavorites] = useState<string[]>([]);

  const active = destinations.find((d) => d.id === activeId)!;
  const activeIndex = destinations.findIndex((d) => d.id === activeId);
  // Only keep previous / active / next hero images mounted (keeps the page light with many destinations)
  const n = destinations.length;
  const mounted = new Set([destinations[(activeIndex + n - 1) % n].id, activeId, destinations[(activeIndex + 1) % n].id]);

  // Auto-change the background like a carousel. Restarts after a manual click so it gets a full interval.
  useEffect(() => {
    const t = setTimeout(() => {
      const i = destinations.findIndex((d) => d.id === activeId);
      setActiveId(destinations[(i + 1) % destinations.length].id);
    }, AUTO_CHANGE_MS);
    return () => clearTimeout(t);
  }, [activeId]);

  const select = (id: string) => {
    setActiveId(id);
    setQuery(destinations.find((d) => d.id === id)!.name);
  };

  const toggleFavorite = (id: string) =>
    setFavorites((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id]));

  const handleSearch = (p: SearchParams) => {
    // Connect this to your real search / booking flow
    console.log("Search:", p);
  };

  return (
    <section className={`${body.className} relative isolate text-white [clip-path:inset(0)]`}>
      {/* Fixed background: stays in place while the content scrolls over it.
          The section's clip-path keeps it from covering the layout footer below. */}
      <div className="fixed inset-0 -z-10 bg-neutral-900">
        {destinations.filter((d) => mounted.has(d.id)).map((d) => (
          <Image
            key={d.id}
            src={d.heroImage}
            alt={d.id === activeId ? `${d.name}, ${d.country}` : ""}
            aria-hidden={d.id !== activeId}
            fill
            sizes="100vw"
            quality={75}
            priority={d.id === destinations[0].id}
            className={`object-cover object-center transition-opacity duration-1000 ease-in-out ${d.id === activeId ? "opacity-100" : "opacity-0"}`}
          />
        ))}
        {/* Readability: dark gradient + soft dark spot behind the centre text */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/30 to-black/70" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.45),transparent_70%)]" />
      </div>

      <style>{`
        @keyframes riseIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      {/* Hero content (scrolls up over the fixed background) */}
      <div className="mx-auto flex min-h-[88vh] w-full max-w-7xl flex-col justify-center px-4 pb-10 pt-32 text-center sm:px-6">
        <h1 className={`${heading.className} text-4xl font-medium leading-tight tracking-tight [animation:riseIn_0.9s_ease-out_both] [text-shadow:0_4px_30px_rgba(0,0,0,0.7)] sm:text-6xl lg:text-7xl`}>
          Where Will You Go Next?
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-white [animation:riseIn_0.9s_0.15s_ease-out_both] [text-shadow:0_2px_14px_rgba(0,0,0,0.8)] sm:text-lg">
          The world is vast, beautiful, and waiting. Let&rsquo;s make your next journey unforgettable.
        </p>
        <p className="mx-auto mt-3 max-w-xl rounded-full bg-black/35 px-4 py-1.5 text-sm text-white backdrop-blur [animation:riseIn_0.9s_0.25s_ease-out_both]" aria-live="off">
          Featuring {active.name}, {active.country} — {active.description}
        </p>
        <div className="mt-7 [animation:riseIn_0.9s_0.3s_ease-out_both]">
          <button
            onClick={() => document.getElementById("destination-discovery")?.scrollIntoView({ behavior: "smooth" })}
            className="rounded-full bg-[#F5EFE7] px-9 py-3.5 font-medium text-[#1f1a16] shadow-xl transition hover:-translate-y-0.5 hover:scale-105"
          >
            Explore Destinations
          </button>
        </div>
        <div className="mt-8 [animation:riseIn_0.9s_0.45s_ease-out_both]">
          <SearchPanel query={query} setQuery={setQuery} onSearch={handleSearch} />
        </div>
      </div>

      {/* Cards: glass panel so they stay visible on any photo */}
      <div id="destination-discovery" className="mx-auto w-full max-w-[1400px] scroll-mt-24 px-4 pb-12 sm:px-8">
        <div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-5 lg:gap-6">
            {destinations.map((d) => (
              <Card key={d.id} d={d} active={d.id === activeId} favorite={favorites.includes(d.id)} onSelect={select} onFavorite={toggleFavorite} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}