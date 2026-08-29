export const SEGMENT_COUNT = 10;

export interface WheelSettings {
  labels: string[];
  /** 0-based index the wheel must land on, or -1 for a random outcome */
  forcedIndex: number;
}

export const DEFAULT_LABELS = [
  "🎁 Mystery Box",
  "💰 500 Coins",
  "⭐ 2x Points",
  "🎟️ Free Ticket",
  "🍀 Lucky Charm",
  "💎 Gem Pack",
  "🔥 Hot Streak",
  "🎉 Party Pop",
  "🏆 Jackpot",
  "🔁 Spin Again",
];

const STORAGE_KEY = "lucky-spin-wheel-settings";
const EVENT = "lucky-spin-wheel:changed";

export function loadSettings(): WheelSettings {
  if (typeof window === "undefined") {
    return { labels: DEFAULT_LABELS, forcedIndex: -1 };
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) throw new Error("empty");
    const parsed = JSON.parse(raw) as Partial<WheelSettings>;
    const labels = Array.from({ length: SEGMENT_COUNT }, (_, i) =>
      typeof parsed.labels?.[i] === "string" && parsed.labels[i].trim()
        ? parsed.labels[i].slice(0, 24)
        : DEFAULT_LABELS[i],
    );
    const forcedIndex =
      typeof parsed.forcedIndex === "number" &&
      parsed.forcedIndex >= -1 &&
      parsed.forcedIndex < SEGMENT_COUNT
        ? parsed.forcedIndex
        : -1;
    return { labels, forcedIndex };
  } catch {
    return { labels: DEFAULT_LABELS, forcedIndex: -1 };
  }
}

export function saveSettings(settings: WheelSettings) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  window.dispatchEvent(new CustomEvent(EVENT));
}

export function onSettingsChange(cb: () => void) {
  window.addEventListener(EVENT, cb);
  const storageCb = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) cb();
  };
  window.addEventListener("storage", storageCb);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", storageCb);
  };
}
