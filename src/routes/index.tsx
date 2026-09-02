import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Sparkles, Settings2 } from "lucide-react";
import { SpinWheel, targetRotationFor } from "@/components/SpinWheel";
import { SEGMENT_COUNT, useWheelSettings } from "@/lib/wheel-store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Lucky Spin Wheel — Spin & Win" },
      {
        name: "description",
        content: "Spin the lucky wheel with 10 prizes and see where fortune lands. Admin-controlled outcomes for fair event play.",
      },
      { property: "og:title", content: "Lucky Spin Wheel — Spin & Win" },
      {
        property: "og:description",
        content: "Spin the lucky wheel with 10 prizes and see where fortune lands.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SpinPage,
});

function SpinPage() {
  const { settings } = useWheelSettings();
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const rotationRef = useRef(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);




  const spin = () => {
    if (spinning) return;
    setResult(null);
    const target =
      settings.forcedIndex >= 0
        ? settings.forcedIndex
        : Math.floor(Math.random() * SEGMENT_COUNT);
    const next = targetRotationFor(target, rotationRef.current);
    rotationRef.current = next;
    setRotation(next);
    setSpinning(true);
    window.setTimeout(() => {
      setSpinning(false);
      setResult(settings.labels[target] ?? `Prize ${target + 1}`);
    }, 5300);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 px-4 py-10">
      <header className="text-center">
        <p className="font-display text-sm tracking-[0.4em] text-primary uppercase">Feeling lucky?</p>
        <h1 className="font-display mt-2 text-4xl font-black tracking-tight sm:text-6xl">
          Lucky <span className="text-gold">Spin</span> Wheel
        </h1>
      </header>

      <SpinWheel labels={settings.labels} rotation={rotation} spinning={spinning} />

      <div className="flex min-h-24 flex-col items-center gap-4">
        <button
          onClick={spin}
          disabled={spinning}
          className="btn-spin"
        >
          <Sparkles className="h-5 w-5" />
          {spinning ? "Spinning…" : "Spin the Wheel"}
        </button>
        {result && (
          <div className="result-pop" role="status">
            You won <span className="text-gold">{result}</span>!
          </div>
        )}
      </div>

      <Link to="/admin" className="link-admin">
        <Settings2 className="h-4 w-4" />
      </Link>
    </main>
  );
}
