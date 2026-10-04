"use client";

import { useState } from "react";
import Link from "next/link";
import { Cake, CalendarHeart, Gift, HeartHandshake, Plus, Trash2, WandSparkles, X } from "lucide-react";
import { retailerSearch } from "@/config/affiliates";
import { BUDGETS, PERSONAL_GIFT_IDEAS } from "@/config/gift-ideas";
import { CountdownTimer } from "@/components/CountdownTimer";
import { GiftIdeas } from "@/components/GiftIdeas";
import { ShareButton } from "@/components/ShareButton";
import { RemindMe } from "@/components/RemindMe";
import { useLang, useT } from "@/lib/i18n";
import {
  MAX_NAME_LENGTH,
  MAX_PERSONAL_DATES,
  PERSONAL_DATE_KINDS,
  isPersonalDateToday,
  nextPersonalDate,
  savePersonalDates,
  type PersonalDate,
  type PersonalDateKind,
} from "@/lib/personal-dates";

const DATE_LABEL = new Intl.DateTimeFormat("en-IN", { weekday: "short", day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Kolkata" });
const HI_DATE_LABEL = new Intl.DateTimeFormat("hi-IN", { weekday: "short", day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Kolkata" });
const KIND_EMOJI: Record<PersonalDateKind, string> = { birthday: "🎂", anniversary: "💞", other: "📅" };

export const PERSONAL_KIND_STYLE: Record<PersonalDateKind, { theme: string; icon: typeof Cake }> = {
  birthday: { theme: "coral", icon: Cake },
  anniversary: { theme: "rose", icon: HeartHandshake },
  other: { theme: "blue", icon: CalendarHeart },
};

function giftBudgets(kind: PersonalDateKind) {
  return BUDGETS.map((budget) => ({
    id: budget.id,
    label: budget.label,
    ideas: PERSONAL_GIFT_IDEAS[kind][budget.id].map((idea) => {
      const link = retailerSearch(idea.store, idea.term, budget.price);
      return { name: idea.name, why: idea.why, href: link.href, storeLabel: link.label };
    }),
  }));
}

function MyDateCard({ date, now, onDelete, onShared }: {
  date: PersonalDate;
  now: number;
  onDelete: () => void;
  onShared: () => void;
}) {
  const [showGifts, setShowGifts] = useState(false);
  const t = useT();
  const lang = useLang();
  const dateLabel = (timestamp: number) => (lang === "hi" ? HI_DATE_LABEL : DATE_LABEL).format(timestamp);
  const { theme, icon: Icon } = PERSONAL_KIND_STYLE[date.kind];
  const target = nextPersonalDate(date, now);
  const isToday = isPersonalDateToday(date, now);
  const kindLabel = PERSONAL_DATE_KINDS.find((kind) => kind.id === date.kind)?.label ?? "";

  return (
    <article className={`event-card my-date-card event-card-${theme}`}>
      <div className="event-card-topline">
        <span className="event-icon"><Icon aria-hidden="true" /></span>
        <span className="event-kicker">{t("My date")} · {t(kindLabel)}</span>
      </div>
      <div className="event-heading-row">
        <h3>{date.name}</h3>
        <button className="my-date-delete" type="button" aria-label={`Delete ${date.name}`} title="Delete" onClick={onDelete}>
          <Trash2 aria-hidden="true" />
        </button>
      </div>
      <div className="event-date-line" suppressHydrationWarning>
        <span className="live-dot" />
        {dateLabel(isToday ? now : target)}
      </div>
      {isToday ? (
        <p className="my-date-today">{t("🎉 It's today! Send your wishes.")}</p>
      ) : (
        <CountdownTimer target={target} label={`Time until ${date.name}`} />
      )}
      <div className="event-actions">
        <button className="my-date-gifts-toggle" type="button" aria-expanded={showGifts} onClick={() => setShowGifts(!showGifts)}>
          <Gift aria-hidden="true" /> {showGifts ? t("Hide gift ideas") : t("Gift ideas")}
        </button>
        {showGifts ? <GiftIdeas festivalName={date.name} budgets={giftBudgets(date.kind)} /> : null}
        <div className="card-action-row">
          <ShareButton
            message={isToday ? `Today is ${date.name}! ${KIND_EMOJI[date.kind]}🎉` : `${KIND_EMOJI[date.kind]} ${date.name} is on ${DATE_LABEL.format(target)}! Counting down 👇`}
            onShared={onShared}
            story={{ title: date.name, emoji: KIND_EMOJI[date.kind], target: isToday ? now : target, dateLabel: DATE_LABEL.format(isToday ? now : target) }}
          />
          <Link className="write-quote-link" href={`/calendar?event=${encodeURIComponent(date.name)}#quote-studio`}>
            <WandSparkles aria-hidden="true" /> {t("Write a wish")}
          </Link>
          <RemindMe
            className="card-remind"
            title={`${KIND_EMOJI[date.kind]} ${date.name}`}
            date={new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(target)}
            details={`${date.name}, saved in Festive Clock.`}
            yearly
          />
        </div>
      </div>
    </article>
  );
}

export function MyDates({ dates, onChange, now, onToast }: {
  dates: PersonalDate[];
  onChange: (dates: PersonalDate[]) => void;
  now: number;
  onToast: (message: string) => void;
}) {
  const [formOpen, setFormOpen] = useState(false);
  const [name, setName] = useState("");
  const [dateValue, setDateValue] = useState("");
  const [kind, setKind] = useState<PersonalDateKind>("birthday");
  const [error, setError] = useState("");
  const t = useT();

  function update(next: PersonalDate[]) {
    onChange(next);
    if (!savePersonalDates(next)) onToast("Your browser blocked saving, so this date will be lost when you close the page.");
  }

  function closeForm() {
    setFormOpen(false);
    setName("");
    setDateValue("");
    setKind("birthday");
    setError("");
  }

  function addDate(event: React.FormEvent) {
    event.preventDefault();
    const trimmed = name.trim();
    const [, month, day] = dateValue.split("-").map(Number);
    if (!trimmed) return setError("Please enter a name, for example “Mom’s birthday”.");
    if (!month || !day) return setError("Please choose a date.");
    if (dates.length >= MAX_PERSONAL_DATES) return setError(`You can save up to ${MAX_PERSONAL_DATES} dates.`);

    update([...dates, { id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, name: trimmed.slice(0, MAX_NAME_LENGTH), month, day, kind }]);
    onToast(`${trimmed} added to My dates.`);
    closeForm();
  }

  // A date that is today comes first, before the next upcoming one.
  const sortKey = (date: PersonalDate) => (isPersonalDateToday(date, now) ? now : nextPersonalDate(date, now));
  const sorted = [...dates].sort((first, second) => sortKey(first) - sortKey(second));

  return (
    <section className="my-dates" aria-labelledby="my-dates-heading">
      <div className="my-dates-heading">
        <div>
          <h3 id="my-dates-heading">{t("My dates")}</h3>
          <p>{t("Bday, anniversary or any day that matters 💛 Saved only on your phone.")}</p>
        </div>
        {!formOpen ? (
          <button className="my-dates-add" type="button" onClick={() => setFormOpen(true)}>
            <Plus aria-hidden="true" /> {t("Add my date")}
          </button>
        ) : null}
      </div>

      {formOpen ? (
        <form className="my-dates-form" onSubmit={addDate} noValidate>
          <label>
            <span>{t("Name")}</span>
            <input
              type="text"
              value={name}
              maxLength={MAX_NAME_LENGTH}
              placeholder={t("e.g. Mom's birthday")}
              onChange={(event) => setName(event.target.value)}
              autoFocus
            />
          </label>
          <label>
            <span>{t("Date")}</span>
            <input type="date" value={dateValue} onChange={(event) => setDateValue(event.target.value)} />
          </label>
          <label>
            <span>{t("Type")}</span>
            <select value={kind} onChange={(event) => setKind(event.target.value as PersonalDateKind)}>
              {PERSONAL_DATE_KINDS.map((option) => <option key={option.id} value={option.id}>{t(option.label)}</option>)}
            </select>
          </label>
          <div className="my-dates-form-actions">
            <button className="my-dates-save" type="submit">{t("Save date")}</button>
            <button className="my-dates-cancel" type="button" onClick={closeForm}><X aria-hidden="true" /> {t("Cancel")}</button>
          </div>
          {error ? <p className="my-dates-error" role="alert">{error}</p> : null}
          <p className="my-dates-form-note">{t("The year does not matter. The countdown repeats every year.")}</p>
        </form>
      ) : null}

      {sorted.length > 0 ? (
        <div className="my-dates-grid">
          {sorted.map((date) => (
            <MyDateCard
              date={date}
              key={date.id}
              now={now}
              onDelete={() => {
                update(dates.filter((entry) => entry.id !== date.id));
                onToast(`${date.name} removed from My dates.`);
              }}
              onShared={() => onToast(`${date.name} message copied and ready to share.`)}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}
