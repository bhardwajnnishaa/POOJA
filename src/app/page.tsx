"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import {
  ArrowDownRight,
  ArrowUpRight,
  CalendarDays,
  Check,
  Coins,
  Flame,
  Flower2,
  Heart,
  MoonStar,
  PartyPopper,
  Search,
  ShoppingBag,
  Sparkles,
  Star,
  Sun,
  TreePine,
  WandSparkles,
} from "lucide-react";
import { AFFILIATE_LINKS, DELIVERY_LINKS, PERSONAL_DELIVERY_LINKS, PERSONAL_SHOPPING_LINKS, type DeliveryLinks as DeliveryLinksData, type FestivalId, type ShoppingLink } from "@/config/affiliates";
import { DeliveryLinks } from "@/components/DeliveryLinks";
import { SiteHeader } from "@/components/SiteHeader";
import { CountdownTimer } from "@/components/CountdownTimer";
import { InstallBanner } from "@/components/InstallBanner";
import { MyDates, PERSONAL_KIND_STYLE } from "@/components/MyDates";
import {
  PERSONAL_DATE_KINDS,
  loadPersonalDates,
  nextPersonalDate,
  type PersonalDate,
} from "@/lib/personal-dates";
import { ShareButton } from "@/components/ShareButton";
import {
  FESTIVAL_INFO,
  festivalPath,
  hasKnownDate,
  indiaYear,
  nextEventTimestamp,
  type CalendarDates,
  type FestivalInfo,
} from "@/lib/festivals";
import { BrandMark } from "@/components/BrandMark";
import { FooterLinks } from "@/components/FooterLinks";

type Festival = FestivalInfo & { shoppingLinks: ShoppingLink[] };

const FESTIVALS: Festival[] = FESTIVAL_INFO.map((festival) => ({
  ...festival,
  shoppingLinks: AFFILIATE_LINKS[festival.id],
}));

const HOME_EVENT_LIMIT = 6;

const INDIA_DATE_FORMATTER = new Intl.DateTimeFormat("en-IN", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "Asia/Kolkata",
});

function eventDateLabel(timestamp: number) {
  return INDIA_DATE_FORMATTER.format(timestamp);
}

// A short, playful status for each countdown card.
function vibeLabel(remainingMs: number) {
  const days = remainingMs / (24 * 60 * 60 * 1000);
  if (days <= 1) return "It's almost here! 🔥";
  if (days <= 7) return "This week! 🔥";
  if (days <= 30) return "Loading… ⏳";
  return "Save the date 📌";
}

function announceToast(message: string) {
  window.dispatchEvent(new CustomEvent("portal-toast", { detail: message }));
}

function Icon({ icon }: { icon: Festival["icon"] }) {
  if (icon === "diya") {
    return <Flame aria-hidden="true" />;
  }
  if (icon === "moon") {
    return <span className="moon-mark" aria-hidden="true">☾</span>;
  }
  if (icon === "confetti") {
    return <PartyPopper aria-hidden="true" />;
  }
  if (icon === "thread") {
    return <Heart aria-hidden="true" />;
  }
  if (icon === "colors") {
    return <Sparkles aria-hidden="true" />;
  }
  if (icon === "lotus") {
    return <Flower2 aria-hidden="true" />;
  }
  if (icon === "sun") {
    return <Sun aria-hidden="true" />;
  }
  if (icon === "coins") {
    return <Coins aria-hidden="true" />;
  }
  if (icon === "moonrise") {
    return <MoonStar aria-hidden="true" />;
  }
  if (icon === "tree") {
    return <TreePine aria-hidden="true" />;
  }
  return <span className="flag-mark" aria-hidden="true">✳</span>;
}

// Ad placeholders stay hidden until real ads are set up, so the page is not cluttered with empty boxes.
const SHOW_AD_SLOTS = process.env.NEXT_PUBLIC_SHOW_AD_SLOTS === "true";

function AdSlot({ square = false }: { square?: boolean }) {
  if (!SHOW_AD_SLOTS) return null;
  return (
    <aside
      aria-label="Advertisement"
      className={`ad-slot ${square ? "ad-slot-square" : "ad-slot-banner"}`}
    >
      <span className="ad-slot-label">GOOGLE-ADSENSE-BANNER</span>
      <span className="ad-slot-note">Advertisement</span>
    </aside>
  );
}

function CountdownCard({ event, now, calendarDates, isFavorite, isShoppingEvent, onToggleFavorite, onSelectShop }: {
  event: Festival;
  now: number;
  calendarDates: CalendarDates;
  isFavorite: boolean;
  isShoppingEvent: boolean;
  onToggleFavorite: (id: FestivalId) => void;
  onSelectShop: (id: FestivalId) => void;
}) {
  const target = nextEventTimestamp(event, now, calendarDates);

  return (
    <article className={`event-card event-card-${event.theme}`}>
      <div className="event-card-topline">
        <span className="event-icon"><Icon icon={event.icon} /></span>
      </div>
      <div className="event-heading-row">
        <div>
          <h3><Link href={festivalPath(event)}>{event.name}</Link></h3>
          <p className="event-subtitle">{event.subtitle}</p>
        </div>
        <div className="event-card-controls">
          <button
            className={`shop-event-button ${isShoppingEvent ? "is-shopping-event" : ""}`}
            type="button"
            aria-label={`Show ${event.name} shopping links`}
            aria-pressed={isShoppingEvent}
            title={`Shop for ${event.name}`}
            onClick={() => onSelectShop(event.id)}
          >
            <ShoppingBag aria-hidden="true" />
          </button>
          <button
            className={`favorite-toggle ${isFavorite ? "is-favorite" : ""}`}
            type="button"
            aria-label={isFavorite ? `Remove ${event.name} from My picks` : `Add ${event.name} to My picks`}
            aria-pressed={isFavorite}
            title={isFavorite ? "Remove from My picks" : "Add to My picks"}
            onClick={() => onToggleFavorite(event.id)}
          >
            <Star aria-hidden="true" />
          </button>
          <span className="event-calendar" suppressHydrationWarning title={eventDateLabel(target)}>
            <CalendarDays aria-hidden="true" />
          </span>
        </div>
      </div>
      <span className="vibe-pill">{vibeLabel(target - now)}</span>
      <div className="event-date-line" suppressHydrationWarning>
        <span className="live-dot" />
        {eventDateLabel(target)}
        <span className="event-date-note">India</span>
      </div>
      <CountdownTimer target={target} label={`Time until ${event.name}`} />
      <div className="event-actions">
        <div className="card-action-row">
          <ShareButton
            message={`${event.emoji} ${event.name} is coming on ${eventDateLabel(target)}! Who's ready? Counting down on Festive Clock 👇`}
            onShared={() => announceToast(`${event.name} ready to share.`)}
            story={{ title: event.name, emoji: event.emoji, target, dateLabel: eventDateLabel(target) }}
          />
          <Link className="write-quote-link" href={`/calendar?event=${encodeURIComponent(event.name)}#quote-studio`}>
            <WandSparkles aria-hidden="true" />
            Write a wish
          </Link>
        </div>
      </div>
    </article>
  );
}

type ShopTarget = { key: string; name: string; subtitle: string; theme: string; icon: ReactNode; links: ShoppingLink[]; delivery: DeliveryLinksData };

function festivalTarget(event: Festival): ShopTarget {
  return { key: event.id, name: event.name, subtitle: event.subtitle, theme: event.theme, icon: <Icon icon={event.icon} />, links: event.shoppingLinks, delivery: DELIVERY_LINKS[event.id] };
}

function personalTarget(date: PersonalDate, now: number): ShopTarget {
  const { theme, icon: KindIcon } = PERSONAL_KIND_STYLE[date.kind];
  const kindLabel = PERSONAL_DATE_KINDS.find((kind) => kind.id === date.kind)?.label ?? "";
  return {
    key: `my:${date.id}`,
    name: date.name,
    subtitle: `${kindLabel} · ${eventDateLabel(nextPersonalDate(date, now))}`,
    theme,
    icon: <KindIcon aria-hidden="true" />,
    links: PERSONAL_SHOPPING_LINKS[date.kind],
    delivery: PERSONAL_DELIVERY_LINKS[date.kind],
  };
}

function ShoppingSidebar({ target, festivals, personal, onChange }: {
  target: ShopTarget;
  festivals: ShopTarget[];
  personal: ShopTarget[];
  onChange: (key: string) => void;
}) {
  return (
    <aside className={`shopping-sidebar event-card-${target.theme}`} aria-label="Shopping links for selected celebration">
      <div className="shopping-sidebar-heading">
        <span className="eyebrow"><span className="eyebrow-line" /> CELEBRATION EDIT</span>
        <h3>Shop the vibe ✨</h3>
        <p>Gifts sorted. Zero overthinking. 🎁</p>
      </div>
      <label className="shopping-event-picker">
        <span>Choose an event</span>
        <select value={target.key} onChange={(changeEvent) => onChange(changeEvent.target.value)}>
          {personal.length > 0 ? (
            <optgroup label="My dates">
              {personal.map((option) => <option key={option.key} value={option.key}>{option.name}</option>)}
            </optgroup>
          ) : null}
          <optgroup label="Festivals">
            {festivals.map((option) => <option key={option.key} value={option.key}>{option.name}</option>)}
          </optgroup>
        </select>
      </label>
      <div className="shopping-sidebar-event">
        <span className="event-icon">{target.icon}</span>
        <span><b>{target.name}</b><small>{target.subtitle}</small></span>
      </div>
      <nav className="shopping-retailer-list" aria-label={`Stores for ${target.name}`}>
        {target.links.map((link) => (
          <a
            className={`shopping-retailer marketplace-${link.id}`}
            href={link.href}
            key={link.id}
            rel="sponsored noopener noreferrer"
            target="_blank"
          >
            <span>{link.label}</span><ArrowUpRight aria-hidden="true" />
          </a>
        ))}
      </nav>
      <DeliveryLinks links={target.delivery} eventName={target.name} />
      <p className="shopping-sidebar-note">Picked for {target.name} 💫</p>
    </aside>
  );
}

function Toast() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    function handleShare(event: Event) {
      const detail = (event as CustomEvent<string>).detail;
      setMessage(detail);
      window.setTimeout(() => setMessage(""), 3200);
    }

    window.addEventListener("portal-toast", handleShare);
    return () => window.removeEventListener("portal-toast", handleShare);
  }, []);

  return (
    <div className={`toast ${message ? "toast-visible" : ""}`} role="status" aria-live="polite">
      <Check aria-hidden="true" />
      {message}
    </div>
  );
}

export default function Home() {
  const [now, setNow] = useState(() => Date.now());
  const [calendarDates, setCalendarDates] = useState<CalendarDates>({});
  const [calendarStatus, setCalendarStatus] = useState<"syncing" | "synced" | "fallback">("syncing");
  const [favoriteIds, setFavoriteIds] = useState<FestivalId[]>([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [shoppingKey, setShoppingKey] = useState<string | null>(null);
  const [personalDates, setPersonalDates] = useState<PersonalDate[]>([]);

  useEffect(() => {
    setPersonalDates(loadPersonalDates());
  }, []);
  const [showAllEvents, setShowAllEvents] = useState(false);

  useEffect(() => {
    // Timers tick on their own; the page only needs a fresh time for ordering and dates.
    const update = () => setNow(Date.now());
    update();
    const interval = window.setInterval(update, 60 * 1000);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    try {
      const saved = JSON.parse(window.localStorage.getItem("celebration-calendar-picks") ?? "[]") as string[];
      setFavoriteIds(saved.filter((id): id is FestivalId => FESTIVALS.some((event) => event.id === id)));
    } catch {
      setFavoriteIds([]);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    async function refreshCalendar() {
      try {
        const response = await fetch("/api/calendar", { cache: "no-store", signal: controller.signal });
        if (!response.ok) {
          throw new Error("Calendar feed is unavailable");
        }

        const data = await response.json() as { dates?: CalendarDates };
        if (!data.dates || Object.keys(data.dates).length === 0) {
          throw new Error("Calendar feed has no festival dates");
        }

        setCalendarDates(data.dates);
        setCalendarStatus("synced");
      } catch {
        if (!controller.signal.aborted) {
          setCalendarStatus("fallback");
        }
      }
    }

    void refreshCalendar();
    const refreshInterval = window.setInterval(() => void refreshCalendar(), 6 * 60 * 60 * 1000);

    return () => {
      controller.abort();
      window.clearInterval(refreshInterval);
    };
  }, []);

  const matchingEvents = FESTIVALS.filter((event) => {
    const matchesSearch = `${event.name} ${event.otherName ?? ""} ${event.subtitle}`.toLowerCase().includes(searchQuery.trim().toLowerCase());
    // Skip lunar festivals whose next date we do not hold yet.
    const hasNextDate = hasKnownDate(event, indiaYear(nextEventTimestamp(event, now, calendarDates)), calendarDates);
    return hasNextDate && matchesSearch && (!showFavorites || favoriteIds.includes(event.id));
  });
  const visibleEvents = matchingEvents.toSorted((first, second) => nextEventTimestamp(first, now, calendarDates) - nextEventTimestamp(second, now, calendarDates));
  const festivalTargets = FESTIVALS
    .toSorted((first, second) => nextEventTimestamp(first, now, calendarDates) - nextEventTimestamp(second, now, calendarDates))
    .map(festivalTarget);
  const personalTargets = personalDates
    .toSorted((first, second) => nextPersonalDate(first, now) - nextPersonalDate(second, now))
    .map((date) => personalTarget(date, now));
  const shoppingTarget = [...personalTargets, ...festivalTargets].find((target) => target.key === shoppingKey)
    ?? festivalTargets.find((target) => target.key === (visibleEvents[0] ?? FESTIVALS[0]).id)!;
  const isFiltering = showFavorites || searchQuery.trim() !== "";
  const shownEvents = showAllEvents || isFiltering ? visibleEvents : visibleEvents.slice(0, HOME_EVENT_LIMIT);
  const countdownItems = shownEvents.flatMap((event, index) => [
    <CountdownCard
      key={event.id}
      event={event}
      now={now}
      calendarDates={calendarDates}
      isFavorite={favoriteIds.includes(event.id)}
      isShoppingEvent={shoppingTarget.key === event.id}
      onSelectShop={setShoppingKey}
      onToggleFavorite={(id) => {
        const next = favoriteIds.includes(id) ? favoriteIds.filter((favoriteId) => favoriteId !== id) : [...favoriteIds, id];
        setFavoriteIds(next);
        try {
          window.localStorage.setItem("celebration-calendar-picks", JSON.stringify(next));
        } catch {
          announceToast("Browser storage is unavailable; this pick will not be saved.");
        }
      }}
    />,
    ...(SHOW_AD_SLOTS && (index + 1) % 2 === 0 && index < shownEvents.length - 1 ? [<AdSlot key={`ad-${index}`} square />] : []),
  ]);

  return (
    <main>
      {SHOW_AD_SLOTS ? <div className="top-ad-wrap"><AdSlot /></div> : null}
      <SiteHeader active="countdown" />
      <InstallBanner />

      <section className="intro" id="home">
        <div className="intro-copy">
          <div className="eyebrow"><span className="eyebrow-line" /> OUR YEAR, IN CELEBRATIONS</div>
          <h1>Good things<br />are <em>coming.</em></h1>
          <p className="intro-description">Holi colours, Diwali diyas, your bestie&apos;s birthday 🎉 Every reason to celebrate, counting down live.</p>
          <a className="intro-link" href="#countdowns">See what&apos;s next <ArrowDownRight aria-hidden="true" /></a>
        </div>
        <div className="intro-art" role="img" aria-label="A warmly lit Indian festive night scene">
          <div className="intro-image" />
          <div className="intro-image-wash" />
          <span className="art-caption"><span>01</span> / MANY REASONS TO CELEBRATE</span>
          <div className="art-stamp"><Sparkles aria-hidden="true" /><span>Made for<br />the moments</span></div>
        </div>
        <div className="intro-footnote"><span>Scroll to celebrate</span><span className="footnote-rule" /></div>
      </section>

      <section className="countdown-section" id="countdowns">
        <div className="section-heading">
          <div>
            <div className="eyebrow"><span className="eyebrow-line" /> THE COUNTDOWN IS ON</div>
            <h2>What are we celebrating next? 🎉</h2>
          </div>
          <p className="section-side-note">
            <span className={`live-dot ${calendarStatus === "fallback" ? "live-dot-muted" : ""}`} />
            <span>Live countdowns · India time</span>
          </p>
        </div>
        <MyDates dates={personalDates} onChange={setPersonalDates} now={now} onToast={announceToast} />
        <div className="event-finder">
          <label className="event-search">
            <Search aria-hidden="true" />
            <input
              type="search"
              aria-label="Find an event"
              placeholder="Find a festival or celebration"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
            />
          </label>
          <div className="event-filter-group" role="group" aria-label="Filter events">
            <button type="button" aria-pressed={!showFavorites} onClick={() => { setShowFavorites(false); setSearchQuery(""); setShowAllEvents(true); }}>All events</button>
            <button type="button" aria-pressed={showFavorites} onClick={() => setShowFavorites(true)}>
              <Star aria-hidden="true" /> My picks <span>{favoriteIds.length}</span>
            </button>
          </div>
          <Link className="open-calendar-link" href="/calendar">
            <CalendarDays aria-hidden="true" /> Open calendar
          </Link>
          <p className="event-finder-note" aria-live="polite">
            {visibleEvents.length} upcoming {visibleEvents.length === 1 ? "event" : "events"} · Closest dates first
          </p>
        </div>
        {countdownItems.length > 0 ? (
          <div className="countdown-layout">
            <div>
              <div className="countdown-grid">{countdownItems}</div>
              {!isFiltering && visibleEvents.length > HOME_EVENT_LIMIT ? (
                <button className="show-all-events" type="button" aria-expanded={showAllEvents} onClick={() => setShowAllEvents(!showAllEvents)}>
                  {showAllEvents ? "Show fewer festivals" : `Show all ${visibleEvents.length} festivals`}
                </button>
              ) : null}
            </div>
            <ShoppingSidebar target={shoppingTarget} festivals={festivalTargets} personal={personalTargets} onChange={setShoppingKey} />
          </div>
        ) : (
          <div className="events-empty">
            <Search aria-hidden="true" />
            <div>
              <h3>{showFavorites && favoriteIds.length === 0 ? "Choose what matters to you" : "No events found"}</h3>
              <p>{showFavorites && favoriteIds.length === 0 ? "Save a celebration with its star to build your personal list." : "Try another search, or see every upcoming celebration."}</p>
            </div>
            <button type="button" onClick={() => { setSearchQuery(""); setShowFavorites(false); }}>Show all events</button>
          </div>
        )}
      </section>

      <section className="closing-note" id="about">
        <div className="closing-icon"><Sparkles aria-hidden="true" /></div>
        <div><p className="eyebrow">A LITTLE MORE JOY, A LITTLE MORE OFTEN</p><h2>Make room for the good stuff.</h2></div>
        <p className="closing-copy">Life is better with something to look forward to. Pick your next one. Let the countdown begin ⏳</p>
      </section>

      <footer className="site-footer">
        <a className="brand footer-brand" href="#home"><BrandMark /><span>Festive <b>Clock</b></span></a>
        <p>Made with 💛 for every celebration.</p>
        <a href="#home" className="back-to-top">Back to top ↑</a>
      </footer>
      <FooterLinks />
      <Toast />
    </main>
  );
}