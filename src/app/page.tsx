"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowDownRight,
  ArrowUpRight,
  CalendarDays,
  Check,
  Flame,
  Heart,
  PartyPopper,
  Search,
  ShoppingBag,
  Sparkles,
  Star,
  WandSparkles,
} from "lucide-react";
import { AFFILIATE_LINKS, type FestivalId, type ShoppingLink } from "@/config/affiliates";
import { SiteHeader } from "@/components/SiteHeader";
import { ShareOptions } from "@/components/ShareOptions";
import {
  FESTIVAL_INFO,
  festivalPath,
  nextEventTimestamp,
  type CalendarDates,
  type FestivalInfo,
} from "@/lib/festivals";

type Festival = FestivalInfo & { shoppingLinks: ShoppingLink[] };

const FESTIVALS: Festival[] = FESTIVAL_INFO.map((festival) => ({
  ...festival,
  shoppingLinks: AFFILIATE_LINKS[festival.id],
}));

const INDIA_DATE_FORMATTER = new Intl.DateTimeFormat("en-IN", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "Asia/Kolkata",
});

function eventDateLabel(timestamp: number) {
  return INDIA_DATE_FORMATTER.format(timestamp);
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
  return <span className="flag-mark" aria-hidden="true">✳</span>;
}

function AdSlot({ square = false }: { square?: boolean }) {
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
  const remaining = Math.max(0, Math.floor((target - now) / 1000));
  const units = [
    String(Math.floor(remaining / 86400)).padStart(2, "0"),
    String(Math.floor((remaining % 86400) / 3600)).padStart(2, "0"),
    String(Math.floor((remaining % 3600) / 60)).padStart(2, "0"),
    String(remaining % 60).padStart(2, "0"),
  ];

  return (
    <article className={`event-card event-card-${event.theme}`}>
      <div className="event-card-topline">
        <span className="event-icon"><Icon icon={event.icon} /></span>
        <span className="event-kicker">A moment to look forward to</span>
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
      <div className="event-date-line" suppressHydrationWarning>
        <span className="live-dot" />
        {eventDateLabel(target)}
        <span className="event-date-note">India</span>
      </div>
      <div className="timer" aria-label={`Time until ${event.name}`}>
        {units.map((value, index) => (
          <div className="timer-unit" key={`${event.id}-${index}`}>
            <span className="timer-value" suppressHydrationWarning aria-live={index === 3 ? "off" : undefined}>{value}</span>
            <span className="timer-label">{["Days", "Hours", "Minutes", "Seconds"][index]}</span>
          </div>
        ))}
      </div>
      <div className="event-actions">
        <ShareOptions
          message={`Counting down to ${event.name} on ${eventDateLabel(target ?? Date.now())}!`}
          onShared={() => announceToast(`${event.name} message copied and ready to share.`)}
        />
        <Link className="write-quote-link" href={`/calendar?event=${encodeURIComponent(event.name)}#quote-studio`}>
          <WandSparkles aria-hidden="true" />
          Write a quote for {event.name}
        </Link>
      </div>
    </article>
  );
}

function ShoppingSidebar({ event, onEventChange }: {
  event: Festival;
  onEventChange: (id: FestivalId) => void;
}) {
  return (
    <aside className={`shopping-sidebar event-card-${event.theme}`} aria-label="Shopping links for selected celebration">
      <div className="shopping-sidebar-heading">
        <span className="eyebrow"><span className="eyebrow-line" /> CELEBRATION EDIT</span>
        <h3>Shop the moment.</h3>
        <p>Thoughtful finds for the celebration ahead.</p>
      </div>
      <label className="shopping-event-picker">
        <span>Choose an event</span>
        <select value={event.id} onChange={(changeEvent) => onEventChange(changeEvent.target.value as FestivalId)}>
          {FESTIVALS.map((festival) => <option key={festival.id} value={festival.id}>{festival.name}</option>)}
        </select>
      </label>
      <div className="shopping-sidebar-event">
        <span className="event-icon"><Icon icon={event.icon} /></span>
        <span><b>{event.name}</b><small>{event.subtitle}</small></span>
      </div>
      <nav className="shopping-retailer-list" aria-label={`Stores for ${event.name}`}>
        {event.shoppingLinks.map((link) => (
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
      <p className="shopping-sidebar-note">Searches are tailored for {event.name}.</p>
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
  const [shoppingEventId, setShoppingEventId] = useState<FestivalId | null>(null);

  useEffect(() => {
    const update = () => setNow(Date.now());
    update();
    const interval = window.setInterval(update, 1000);
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
    const matchesSearch = `${event.name} ${event.subtitle}`.toLowerCase().includes(searchQuery.trim().toLowerCase());
    return matchesSearch && (!showFavorites || favoriteIds.includes(event.id));
  });
  const visibleEvents = matchingEvents.toSorted((first, second) => nextEventTimestamp(first, now, calendarDates) - nextEventTimestamp(second, now, calendarDates));
  const shoppingEvent = FESTIVALS.find((event) => event.id === shoppingEventId) ?? visibleEvents[0] ?? FESTIVALS[0];
  const countdownItems = visibleEvents.flatMap((event, index) => [
    <CountdownCard
      key={event.id}
      event={event}
      now={now}
      calendarDates={calendarDates}
      isFavorite={favoriteIds.includes(event.id)}
      isShoppingEvent={shoppingEvent.id === event.id}
      onSelectShop={setShoppingEventId}
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
    ...((index + 1) % 2 === 0 && index < visibleEvents.length - 1 ? [<AdSlot key={`ad-${index}`} square />] : []),
  ]);

  return (
    <main>
      <div className="top-ad-wrap"><AdSlot /></div>
      <SiteHeader active="countdown" />

      <section className="intro" id="home">
        <div className="intro-copy">
          <div className="eyebrow"><span className="eyebrow-line" /> OUR YEAR, IN CELEBRATIONS</div>
          <h1>Good things<br />are <em>coming.</em></h1>
          <p className="intro-description">From the first colour of Holi to the last diya at Diwali, keep every reason to celebrate a little closer.</p>
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
            <h2>What are we celebrating next?</h2>
          </div>
          <p className="section-side-note">
            <span className={`live-dot ${calendarStatus === "fallback" ? "live-dot-muted" : ""}`} />
            <span>
              Countdown updates every second<br />
              {calendarStatus === "synced" ? "Festival dates sync every 6 hours" : calendarStatus === "syncing" ? "Checking public festival calendars" : "Calendar unavailable · showing saved dates"}<br />
              All countdowns use India time
            </span>
          </p>
        </div>
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
            <button type="button" aria-pressed={!showFavorites} onClick={() => setShowFavorites(false)}>All events</button>
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
            <div className="countdown-grid">{countdownItems}</div>
            <ShoppingSidebar event={shoppingEvent} onEventChange={setShoppingEventId} />
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
        <p className="closing-copy">The best days are better when you have something to look forward to. Pick your next one and let the countdown begin.</p>
      </section>

      <footer className="site-footer">
        <a className="brand footer-brand" href="#home"><span className="brand-mark"><Sparkles aria-hidden="true" /></span><span>Festive <b>Clock</b></span></a>
        <p>Made for the moments that bring us together.</p>
        <a href="#home" className="back-to-top">Back to top ↑</a>
      </footer>
      <Toast />
    </main>
  );
}