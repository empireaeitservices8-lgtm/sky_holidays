"use client";

import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import Icon from "./Icon";

/* -------------------------------------------------------------------------- */
/*  Settings                                                                  */
/* -------------------------------------------------------------------------- */

const ACCENT = "#f5a623"; // same accent as the hero
const MAX_PASSENGERS = 9;
const MAX_EXTRA_LEGS = 3;

const AIRPORTS = [
  "Kochi (COK)",
  "Bangkok (BKK)",
  "Dubai (DXB)",
  "Doha (DOH)",
  "Singapore (SIN)",
  "London (LHR)",
  "New Delhi (DEL)",
  "Mumbai (BOM)",
  "Bengaluru (BLR)",
  "Kuala Lumpur (KUL)",
  "Colombo (CMB)",
  "Male (MLE)",
];

const CABINS = ["Economy", "Premium Economy", "Business", "First"] as const;

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

type TripType = "return" | "oneway" | "multicity";
type Cabin = (typeof CABINS)[number];

interface Leg {
  from: string;
  to: string;
  date: string;
}

interface Passengers {
  adults: number;
  children: number;
  infants: number;
}

export interface FlightSearchData {
  tripType: TripType;
  legs: Leg[];
  returnDate: string | null;
  passengers: Passengers;
  cabin: Cabin;
  flexibleDates: boolean;
  promoCode: string;
}

interface FlightBookingProps {
  onSearch?: (data: FlightSearchData) => void;
}

/* -------------------------------------------------------------------------- */
/*  Small building blocks                                                     */
/* -------------------------------------------------------------------------- */

const inputClass =
  "w-full bg-transparent text-base font-medium text-neutral-900 outline-none placeholder:text-neutral-400 disabled:cursor-not-allowed disabled:text-neutral-400";

function Field({
  label,
  children,
  className = "",
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={`block px-4 py-2.5 ${className}`}>
      <span className="block text-xs text-neutral-500">{label}</span>
      {children}
    </label>
  );
}

function Counter({
  label,
  hint,
  value,
  min,
  canIncrease,
  onChange,
}: {
  label: string;
  hint: string;
  value: number;
  min: number;
  canIncrease: boolean;
  onChange: (next: number) => void;
}) {
  const btn =
    "flex h-8 w-8 items-center justify-center rounded-full border border-neutral-300 text-neutral-700 transition hover:border-neutral-900 disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:border-neutral-300";
  return (
    <div className="flex items-center justify-between py-3">
      <div>
        <p className="text-sm font-semibold text-neutral-900">{label}</p>
        <p className="text-xs text-neutral-500">{hint}</p>
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label={`Decrease ${label}`}
          disabled={value <= min}
          onClick={() => onChange(value - 1)}
          className={btn}
        >
          <Icon>
            <path d="M5 12h14" />
          </Icon>
        </button>
        <span className="w-4 text-center text-sm font-semibold text-neutral-900">
          {value}
        </span>
        <button
          type="button"
          aria-label={`Increase ${label}`}
          disabled={!canIncrease}
          onClick={() => onChange(value + 1)}
          className={btn}
        >
          <Icon>
            <path d="M5 12h14" />
            <path d="M12 5v14" />
          </Icon>
        </button>
      </div>
    </div>
  );
}

function TripRadio({
  label,
  checked,
  onSelect,
}: {
  label: string;
  checked: boolean;
  onSelect: () => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 text-base text-neutral-900">
      <input
        type="radio"
        name="tripType"
        checked={checked}
        onChange={onSelect}
        className="peer sr-only"
      />
      <span
        className="flex h-6 w-6 items-center justify-center rounded-full border-2 transition peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2"
        style={{ borderColor: checked ? ACCENT : "#a3a3a3" }}
      >
        <span
          className="h-3 w-3 rounded-full transition-transform duration-200"
          style={{
            background: ACCENT,
            transform: checked ? "scale(1)" : "scale(0)",
          }}
        />
      </span>
      {label}
    </label>
  );
}

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

export default function FlightBooking({ onSearch }: FlightBookingProps) {
  const [tripType, setTripType] = useState<TripType>("return");
  const [from, setFrom] = useState("Kochi (COK)");
  const [to, setTo] = useState("Bangkok (BKK)");
  const [departure, setDeparture] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [extraLegs, setExtraLegs] = useState<Leg[]>([]);
  const [pax, setPax] = useState<Passengers>({ adults: 1, children: 0, infants: 0 });
  const [cabin, setCabin] = useState<Cabin>("Economy");
  const [paxOpen, setPaxOpen] = useState(false);
  const [flexible, setFlexible] = useState(false);
  const [promoOpen, setPromoOpen] = useState(false);
  const [promo, setPromo] = useState("");

  const paxRef = useRef<HTMLDivElement>(null);

  const totalPax = pax.adults + pax.children + pax.infants;
  const paxSummary = `${totalPax} Passenger${totalPax > 1 ? "s" : ""} ${cabin}`;
  const today = new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD
  const returnDisabled = tripType !== "return";

  // Close the passenger popover when clicking outside
  useEffect(() => {
    if (!paxOpen) return;
    const onDown = (e: MouseEvent) => {
      if (paxRef.current && !paxRef.current.contains(e.target as Node)) {
        setPaxOpen(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [paxOpen]);

  const selectTrip = (type: TripType) => {
    setTripType(type);
    if (type === "multicity" && extraLegs.length === 0) {
      setExtraLegs([{ from: to, to: "", date: "" }]);
    }
  };

  const swap = () => {
    setFrom(to);
    setTo(from);
  };

  const updateLeg = (i: number, patch: Partial<Leg>) =>
    setExtraLegs((legs) => legs.map((l, idx) => (idx === i ? { ...l, ...patch } : l)));

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data: FlightSearchData = {
      tripType,
      legs: [
        { from, to, date: departure },
        ...(tripType === "multicity" ? extraLegs : []),
      ],
      returnDate: tripType === "return" ? returnDate || null : null,
      passengers: pax,
      cabin,
      flexibleDates: flexible,
      promoCode: promo.trim(),
    };
    if (onSearch) onSearch(data);
    else console.log("Flight search:", data);
  };

  const cell =
    "border-b border-neutral-300 last:border-b-0 lg:border-b-0 lg:border-r lg:last:border-r-0";

  return (
    // `flow-root` stops the card's negative margin from pulling the whole
    // section up, so only the card overlaps the hero.
    <section className="relative z-10 flow-root bg-white pb-24">
      <form
        onSubmit={handleSubmit}
        className="relative mx-auto -mt-16 w-[calc(100%-2rem)] max-w-[1180px] rounded-3xl bg-white p-5 shadow-[0_25px_70px_-20px_rgba(0,0,0,0.45)] md:w-[calc(100%-4rem)] md:p-8"
      >
        {/* Trip type */}
        <fieldset className="flex flex-wrap items-center gap-x-8 gap-y-3">
          <legend className="sr-only">Trip type</legend>
          <TripRadio
            label="Return"
            checked={tripType === "return"}
            onSelect={() => selectTrip("return")}
          />
          <TripRadio
            label="One way"
            checked={tripType === "oneway"}
            onSelect={() => selectTrip("oneway")}
          />
          <TripRadio
            label="Multi-city"
            checked={tripType === "multicity"}
            onSelect={() => selectTrip("multicity")}
          />
        </fieldset>

        {/* Main search row */}
        <div className="mt-6 grid rounded-xl border border-neutral-300 lg:grid-cols-[2fr_1fr_1fr_1.3fr]">
          {/* From / To with swap button */}
          <div className={`relative grid sm:grid-cols-2 ${cell}`}>
            <Field label="From" className="border-b border-neutral-300 sm:border-b-0">
              <input
                list="airports"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                placeholder="City or airport"
                className={inputClass}
                required
              />
            </Field>
            <Field label="To" className="sm:pl-10">
              <input
                list="airports"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                placeholder="City or airport"
                className={inputClass}
                required
              />
            </Field>
            <button
              type="button"
              onClick={swap}
              aria-label="Swap origin and destination"
              className="absolute right-4 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-neutral-300 bg-white text-neutral-700 transition hover:rotate-180 hover:border-neutral-900 sm:left-1/2 sm:right-auto sm:-translate-x-1/2"
            >
              <Icon>
                <path d="M7 4 3 8l4 4" />
                <path d="M3 8h14" />
                <path d="m17 20 4-4-4-4" />
                <path d="M21 16H7" />
              </Icon>
            </button>
          </div>

          <div className={cell}>
            <Field label="Departure">
              <input
                type="date"
                value={departure}
                min={today}
                onChange={(e) => setDeparture(e.target.value)}
                className={inputClass}
                suppressHydrationWarning
                required
              />
            </Field>
          </div>

          <div className={`${cell} ${returnDisabled ? "bg-neutral-50" : ""}`}>
            <Field label="Return">
              <input
                type="date"
                value={returnDisabled ? "" : returnDate}
                min={departure || today}
                onChange={(e) => setReturnDate(e.target.value)}
                disabled={returnDisabled}
                className={inputClass}
                suppressHydrationWarning
                required={!returnDisabled}
              />
            </Field>
          </div>

          {/* Passengers / class */}
          <div ref={paxRef} className={`relative ${cell}`}>
            <button
              type="button"
              onClick={() => setPaxOpen((v) => !v)}
              aria-expanded={paxOpen}
              className="flex w-full items-center justify-between px-4 py-2.5 text-left"
            >
              <span>
                <span className="block text-xs text-neutral-500">Passengers / Class</span>
                <span className="block text-base font-medium text-neutral-900">
                  {paxSummary}
                </span>
              </span>
              <Icon
                className={`h-5 w-5 text-neutral-600 transition-transform ${
                  paxOpen ? "rotate-180" : ""
                }`}
              >
                <path d="m6 9 6 6 6-6" />
              </Icon>
            </button>

            {paxOpen && (
              <div className="absolute right-0 top-full z-30 mt-2 w-full min-w-[300px] rounded-2xl border border-neutral-200 bg-white p-5 shadow-2xl">
                <div className="divide-y divide-neutral-200">
                  <Counter
                    label="Adults"
                    hint="12 years and over"
                    value={pax.adults}
                    min={1}
                    canIncrease={totalPax < MAX_PASSENGERS}
                    onChange={(v) =>
                      setPax((p) => ({ ...p, adults: v, infants: Math.min(p.infants, v) }))
                    }
                  />
                  <Counter
                    label="Children"
                    hint="2 – 11 years"
                    value={pax.children}
                    min={0}
                    canIncrease={totalPax < MAX_PASSENGERS}
                    onChange={(v) => setPax((p) => ({ ...p, children: v }))}
                  />
                  <Counter
                    label="Infants"
                    hint="Under 2 years"
                    value={pax.infants}
                    min={0}
                    canIncrease={totalPax < MAX_PASSENGERS && pax.infants < pax.adults}
                    onChange={(v) => setPax((p) => ({ ...p, infants: v }))}
                  />
                </div>

                <label className="mt-4 block">
                  <span className="mb-1 block text-xs text-neutral-500">Cabin class</span>
                  <select
                    value={cabin}
                    onChange={(e) => setCabin(e.target.value as Cabin)}
                    className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-sm font-medium text-neutral-900 outline-none focus:border-neutral-900"
                  >
                    {CABINS.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </label>

                <button
                  type="button"
                  onClick={() => setPaxOpen(false)}
                  className="mt-4 w-full rounded-full bg-neutral-900 py-2.5 text-sm font-semibold text-white transition hover:bg-neutral-700"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Extra legs for multi-city */}
        {tripType === "multicity" && (
          <div className="mt-4 space-y-3">
            {extraLegs.map((leg, i) => (
              <div
                key={i}
                className="grid rounded-xl border border-neutral-300 lg:grid-cols-[2fr_1fr_auto]"
              >
                <div className={`grid sm:grid-cols-2 ${cell}`}>
                  <Field label="From" className="border-b border-neutral-300 sm:border-b-0">
                    <input
                      list="airports"
                      value={leg.from}
                      onChange={(e) => updateLeg(i, { from: e.target.value })}
                      placeholder="City or airport"
                      className={inputClass}
                      required
                    />
                  </Field>
                  <Field label="To" className="sm:border-l sm:border-neutral-300">
                    <input
                      list="airports"
                      value={leg.to}
                      onChange={(e) => updateLeg(i, { to: e.target.value })}
                      placeholder="City or airport"
                      className={inputClass}
                      required
                    />
                  </Field>
                </div>
                <div className={cell}>
                  <Field label="Departure">
                    <input
                      type="date"
                      value={leg.date}
                      min={i === 0 ? departure || today : extraLegs[i - 1].date || today}
                      onChange={(e) => updateLeg(i, { date: e.target.value })}
                      className={inputClass}
                      suppressHydrationWarning
                      required
                    />
                  </Field>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setExtraLegs((legs) => legs.filter((_, idx) => idx !== i));
                    if (extraLegs.length === 1) setTripType("return");
                  }}
                  aria-label="Remove this flight"
                  className="flex items-center justify-center px-5 py-3 text-neutral-500 transition hover:text-neutral-900"
                >
                  <Icon className="h-5 w-5">
                    <path d="M6 6l12 12" />
                    <path d="M18 6L6 18" />
                  </Icon>
                </button>
              </div>
            ))}

            {extraLegs.length < MAX_EXTRA_LEGS && (
              <button
                type="button"
                onClick={() =>
                  setExtraLegs((legs) => [
                    ...legs,
                    { from: legs[legs.length - 1]?.to ?? "", to: "", date: "" },
                  ])
                }
                className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-900 transition hover:opacity-70"
              >
                <Icon>
                  <path d="M5 12h14" />
                  <path d="M12 5v14" />
                </Icon>
                Add another flight
              </button>
            )}
          </div>
        )}

        {/* Bottom row */}
        <div className="mt-6 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <label className="flex cursor-pointer items-center gap-3 text-base text-neutral-900">
            <input
              type="checkbox"
              checked={flexible}
              onChange={(e) => setFlexible(e.target.checked)}
              className="peer sr-only"
            />
            <span
              className="flex h-7 w-7 items-center justify-center rounded-md border-2 border-neutral-400 transition peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2"
              style={flexible ? { background: ACCENT, borderColor: ACCENT } : undefined}
            >
              {flexible && (
                <Icon className="h-4 w-4 text-white">
                  <path d="m5 12 5 5 9-10" />
                </Icon>
              )}
            </span>
            Flexible dates
          </label>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
            {promoOpen ? (
              <input
                value={promo}
                onChange={(e) => setPromo(e.target.value.toUpperCase())}
                placeholder="Promo code"
                aria-label="Promo code"
                autoFocus
                className="rounded-full border border-neutral-300 px-5 py-3 text-sm font-medium uppercase tracking-wider text-neutral-900 outline-none focus:border-neutral-900"
              />
            ) : (
              <button
                type="button"
                onClick={() => setPromoOpen(true)}
                className="inline-flex items-center gap-2 text-base font-semibold text-neutral-900 transition hover:opacity-70"
              >
                <Icon className="h-5 w-5">
                  <path d="M5 12h14" />
                  <path d="M12 5v14" />
                </Icon>
                Add promo code
              </button>
            )}

            <button
              type="submit"
              className="rounded-full px-10 py-4 text-base font-bold text-neutral-900 shadow-lg transition hover:-translate-y-0.5 hover:brightness-95 active:translate-y-0"
              style={{ background: ACCENT }}
            >
              Search flights
            </button>
          </div>
        </div>

        <datalist id="airports">
          {AIRPORTS.map((a) => (
            <option key={a} value={a} />
          ))}
        </datalist>
      </form>
    </section>
  );
}