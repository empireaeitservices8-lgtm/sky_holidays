"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from "react";
import Image from "next/image";
import {
  AnimatePresence,
  MotionValue,
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "framer-motion";
import { MapPin, Star } from "lucide-react";

/* ----------------------------- Data & types ----------------------------- */

interface TravelReview {
  id: number;
  name: string;
  location: string;
  destination: string;
  rating: number;
  review: string;
  image: string;
}

// Put your photos in /public/images/travel and change the file names here.
// Add more objects to fill the stack. Fewer than ~17 get repeated to fill it.
const reviews: TravelReview[] = [
  {
    id: 1,
    name: "Aarav Menon",
    location: "Kochi, India",
    destination: "Bali, Indonesia",
    rating: 5,
    review:
      "Every sunrise over the rice terraces felt unreal. The itinerary was perfectly paced, and our guide turned a simple trip into a memory we'll keep forever.",
    image: "/images/clientreview/c1.jpg",
  },
  {
    id: 2,
    name: "Sophie Laurent",
    location: "Lyon, France",
    destination: "Swiss Alps, Switzerland",
    rating: 5,
    review:
      "Crisp air, quiet trails and the most beautiful chalet. Everything was arranged so well that we just got to enjoy the mountains.",
    image: "/images/clientreview/c2.jpg",
  },
  {
    id: 3,
    name: "Kenji Watanabe",
    location: "Osaka, Japan",
    destination: "Kyoto, Japan",
    rating: 4,
    review:
      "Early-morning temple walks and a private tea ceremony. Thoughtful, calm and authentic, the kind of travel I'd hoped for.",
    image: "/images/clientreview/c3.jpg",
  },
  {
    id: 4,
    name: "Meera & Rohan",
    location: "Bengaluru, India",
    destination: "Cappadocia, Turkey",
    rating: 5,
    review:
      "Floating over the valleys in a hot-air balloon at dawn was the highlight of our honeymoon. Flawless planning from start to finish.",
    image: "/images/clientreview/c4.jpg",
  },
  {
    id: 5,
    name: "Elena Rossi",
    location: "Milan, Italy",
    destination: "Amalfi Coast, Italy",
    rating: 5,
    review:
      "Cliffside villages, lemon groves and long seaside dinners. The local recommendations were better than anything we'd have found alone.",
    image: "/images/clientreview/c2.jpg",
  },
  {
    id: 6,
    name: "James Carter",
    location: "Toronto, Canada",
    destination: "Maldives",
    rating: 5,
    review:
      "Crystal water, total privacy and seamless transfers. It was the most relaxing week of my life, and every detail was handled.",
    image: "/images/clientreview/c4.jpg",
  },
];

/* ------------------------------- Tuning --------------------------------- */

const MIN_SLOTS = 17; // how many cards make up the full stack
const IDLE_SPEED = 0.3; // cards per second while idle
const MAX_ANGLE = 68; // rotateY (deg) of the side cards
const FIRST_SLIVER = 44; // visible px of the 1st side card (at 375px card width)
const SLIVER_STEP = 22; // visible px of each further side card
const CARD_RATIO = 0.84; // card height / width
const PERSPECTIVE = 1800;
const EASE = [0.22, 1, 0.36, 1] as const;

const REPEAT = Math.ceil(MIN_SLOTS / reviews.length);
const COUNT = reviews.length * REPEAT;
const slots = Array.from({ length: COUNT }, (_, slot) => ({
  slot,
  review: reviews[slot % reviews.length],
}));

/* -------------------------------- Helpers ------------------------------- */

const clamp = (v: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, v));

const smooth = (t: number): number => t * t * (3 - 2 * t);

/** Signed distance from the center slot, wrapped to [-COUNT/2, COUNT/2] */
const wrap = (value: number): number => {
  const m = ((value % COUNT) + COUNT) % COUNT;
  return m > COUNT / 2 ? m - COUNT : m;
};

interface Pose {
  x: number;
  rotateY: number;
  scale: number;
  opacity: number;
  z: number;
  shade: number;
  caption: number;
}

/** d = signed distance from center (0 = featured card), w = card width in px */
function getPose(d: number, w: number): Pose {
  const a = Math.abs(d);
  const sign = d < 0 ? -1 : 1;
  const unit = w / 375;
  const t = Math.min(a, 1);

  const angle = MAX_ANGLE * smooth(t);
  const scale =
    1 - 0.08 * t - 0.025 * Math.min(Math.max(a - 1, 0), 8);
  const projected = w * Math.cos((angle * Math.PI) / 180) * scale;
  const visible =
    (a <= 1 ? FIRST_SLIVER * a : FIRST_SLIVER + (a - 1) * SLIVER_STEP) * unit;

  return {
    x: sign * (w / 2 + visible - projected / 2),
    rotateY: -sign * angle,
    scale,
    opacity: clamp(COUNT / 2 - 0.6 - a, 0, 1),
    z: Math.round(1000 - a * 100),
    shade: clamp(a * 0.05, 0, 0.3),
    caption: clamp(1 - a * 2.2, 0, 1),
  };
}

/* ------------------------------ Card component --------------------------- */

interface CardProps {
  slot: number;
  review: TravelReview;
  offset: MotionValue<number>;
  cardWidth: MotionValue<number>;
  isActive: boolean;
  tabbable: boolean;
  onActivate: (slot: number, force?: boolean) => void;
  onToggleTouch: (slot: number) => void;
  onBlur: () => void;
  setPointerType: (type: string) => void;
}

function TravelReviewCard({
  slot,
  review,
  offset,
  cardWidth,
  isActive,
  tabbable,
  onActivate,
  onToggleTouch,
  onBlur,
  setPointerType,
}: CardProps) {
  const d = useTransform(offset, (o) => wrap(slot - o));
  const pose = useTransform([d, cardWidth], ([dv, w]: number[]) =>
    getPose(dv, w)
  );
  const x = useTransform(pose, (p) => p.x);
  const rotateY = useTransform(pose, (p) => p.rotateY);
  const scale = useTransform(pose, (p) => p.scale);
  const opacity = useTransform(pose, (p) => p.opacity);
  const zIndex = useTransform(pose, (p) => p.z);
  const shade = useTransform(pose, (p) => p.shade);
  const caption = useTransform(pose, (p) => p.caption);
  const pointerEvents = useTransform(pose, (p) =>
    p.opacity < 0.2 ? "none" : "auto"
  );

  return (
    <motion.div
      className="absolute left-1/2 top-1/2"
      style={{
        width: "var(--card-w)",
        height: "var(--card-h)",
        marginLeft: "calc(var(--card-w) / -2)",
        marginTop: "calc(var(--card-h) / -2)",
        x,
        rotateY,
        scale,
        opacity,
        pointerEvents,
        zIndex: isActive ? 2000 : zIndex,
        willChange: "transform, opacity",
      }}
    >
      <motion.button
        type="button"
        tabIndex={tabbable ? 0 : -1}
        aria-hidden={!tabbable}
        aria-label={`${review.name} — ${review.destination}. Show review`}
        aria-pressed={isActive}
        onPointerDown={(e) => setPointerType(e.pointerType)}
        onPointerMove={(e) => {
          if (e.pointerType === "mouse") onActivate(slot);
        }}
        onClick={() => onToggleTouch(slot)}
        onFocus={() => onActivate(slot, true)}
        onBlur={onBlur}
        animate={{
          boxShadow: isActive
            ? "0 30px 60px -15px rgba(0,0,0,0.6)"
            : "0 12px 30px -12px rgba(0,0,0,0.5)",
        }}
        transition={{ duration: 0.6, ease: EASE }}
        className="absolute inset-0 block cursor-pointer overflow-hidden rounded-lg bg-slate-600 focus:outline-none focus-visible:ring-4 focus-visible:ring-white/80"
      >
        <Image
          src={review.image}
          alt={`${review.destination} — travel photo by ${review.name}`}
          fill
          sizes="(max-width: 640px) 60vw, 560px"
          priority={slot < 3}
          draggable={false}
          className="select-none object-cover"
        />

        {/* Caption, visible only on the featured card */}
        <motion.div
          style={{ opacity: caption }}
          className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/65 to-transparent px-5 pb-4 pt-12 text-left"
        >
          <p className="text-[11px] uppercase tracking-[0.22em] text-white/85">
            {review.destination}
          </p>
        </motion.div>

        {/* Slight darkening on the side cards */}
        <motion.div
          aria-hidden
          style={{ opacity: shade }}
          className="pointer-events-none absolute inset-0 bg-black"
        />
      </motion.button>
    </motion.div>
  );
}

/* ----------------------------- Review content ---------------------------- */

function TravelReviewContent({ review }: { review: TravelReview | null }) {
  return (
    <div className="mx-auto mt-6 flex min-h-[210px] max-w-2xl items-start justify-center px-6 text-center sm:min-h-[180px]">
      <AnimatePresence mode="wait" initial={false}>
        {review ? (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.45, ease: EASE }}
          >
            <div
              className="mb-3 flex justify-center gap-1"
              aria-label={`${review.rating} out of 5 stars`}
            >
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < review.rating
                      ? "fill-amber-400 text-amber-400"
                      : "text-white/25"
                  }`}
                />
              ))}
            </div>
            <p className="font-serif text-lg leading-relaxed text-white sm:text-xl">
              “{review.review}”
            </p>
            <p className="mt-4 text-sm font-semibold text-white">
              {review.name}
            </p>
            <p className="mt-1 flex items-center justify-center gap-1.5 text-sm text-white/60">
              <MapPin className="h-3.5 w-3.5" />
              {review.location} · {review.destination}
            </p>
          </motion.div>
        ) : (
          <motion.p
            key="hint"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.45, ease: EASE }}
            className="pt-8 text-sm tracking-wide text-white/55"
          >
            <span className="hidden sm:inline">
              Hover over a travel story to discover their experience.
            </span>
            <span className="sm:hidden">
              Tap a travel story to discover their experience.
            </span>
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------- Main section ---------------------------- */

export default function TravelReviews() {
  const reduceMotion = useReducedMotion();
  const offset = useMotionValue(0);
  const cardWidth = useMotionValue(480);
  const stageRef = useRef<HTMLDivElement>(null);

  const [cardW, setCardW] = useState(480);
  const [ready, setReady] = useState(false);
  const [activeSlot, setActiveSlot] = useState<number | null>(null);

  const lockUntil = useRef(0);
  const pointerType = useRef("mouse");
  const stageHovered = useRef(false);

  // Measure the stage so the card size follows the screen width
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const update = () => {
      const w = clamp(el.clientWidth * 0.56, 210, 560);
      cardWidth.set(w);
      setCardW(w);
      setReady(true);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [cardWidth]);

  // Idle drift (paused while a card is active) + glide to the hovered card
  useEffect(() => {
    if (activeSlot !== null) {
      const current = offset.get();
      const target =
        activeSlot + COUNT * Math.round((current - activeSlot) / COUNT);
      const controls = animate(offset, target, {
        duration: reduceMotion ? 0 : 0.9,
        ease: EASE,
      });
      return () => controls.stop();
    }

    if (reduceMotion) return;

    let raf = 0;
    let last = performance.now();
    let speed = 0; // ease up from 0 so resuming feels natural

    const tick = (now: number) => {
      const dt = Math.min(now - last, 50);
      last = now;
      speed += (IDLE_SPEED - speed) * Math.min(1, dt / 500);
      let next = offset.get() + (speed * dt) / 1000;
      if (next >= COUNT) next -= COUNT;
      offset.set(next);
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [activeSlot, offset, reduceMotion]);

  const activate = useCallback(
    (slot: number, force = false) => {
      if (slot === activeSlot) return;
      // Brief lock so cards sliding under a still cursor don't cause flicker
      if (!force && performance.now() < lockUntil.current) return;
      lockUntil.current = performance.now() + 950;
      setActiveSlot(slot);
    },
    [activeSlot]
  );

  const handleToggleTouch = useCallback(
    (slot: number) => {
      if (pointerType.current === "touch" || pointerType.current === "pen") {
        setActiveSlot((prev) => (prev === slot ? null : slot));
        lockUntil.current = 0;
      } else {
        activate(slot, true);
      }
    },
    [activate]
  );

  const handleStageLeave = () => {
    stageHovered.current = false;
    lockUntil.current = 0;
    if (pointerType.current === "mouse") setActiveSlot(null);
  };

  const handleBlur = () => {
    if (!stageHovered.current) setActiveSlot(null);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const step = e.key === "ArrowRight" ? 1 : -1;
    setActiveSlot((prev) => (((prev ?? 0) + step) % COUNT + COUNT) % COUNT);
  };

  const activeReview =
    activeSlot !== null ? reviews[activeSlot % reviews.length] : null;

  const stageStyle = {
    height: cardW * CARD_RATIO + 90,
    perspective: PERSPECTIVE,
    "--card-w": `${cardW}px`,
    "--card-h": `${cardW * CARD_RATIO}px`,
  } as CSSProperties;

  return (
    <section className="relative overflow-hidden bg-[#343a5c] py-20 text-white sm:py-28">
      {/* Heading */}
      <div className="mx-auto max-w-2xl px-6 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-300">
          Traveler Stories
        </p>
        <h2 className="mt-4 font-serif text-3xl sm:text-5xl">
          Memories that last a lifetime
        </h2>
        <p className="mt-4 text-base text-white/60 sm:text-lg">
          Real journeys. Real experiences. Stories from travelers around the
          world.
        </p>
      </div>

      {/* Coverflow stack */}
      <div
        ref={stageRef}
        role="group"
        aria-label="Traveler stories"
        onKeyDown={handleKeyDown}
        onPointerEnter={(e) => {
          pointerType.current = e.pointerType;
          stageHovered.current = true;
        }}
        onPointerLeave={handleStageLeave}
        className={`relative mx-auto mt-12 w-full max-w-[1600px] transition-opacity duration-500 ${
          ready ? "opacity-100" : "opacity-0"
        }`}
        style={stageStyle}
      >
        {/* Soft floor shadow */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 rounded-[50%] bg-black/40 blur-3xl"
          style={{
            width: cardW * 1.5,
            height: cardW * 0.2,
            marginLeft: -cardW * 0.75,
            bottom: 0,
          }}
        />

        {slots.map(({ slot, review }) => (
          <TravelReviewCard
            key={slot}
            slot={slot}
            review={review}
            offset={offset}
            cardWidth={cardWidth}
            isActive={activeSlot === slot}
            tabbable={slot < reviews.length}
            onActivate={activate}
            onToggleTouch={handleToggleTouch}
            onBlur={handleBlur}
            setPointerType={(t) => (pointerType.current = t)}
          />
        ))}
      </div>

      {/* Review text (fixed min-height, so no layout shift) */}
      <div aria-live="polite">
        <TravelReviewContent review={activeReview} />
      </div>
    </section>
  );
}