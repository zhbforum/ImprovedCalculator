import React, { useEffect, useRef } from "react";

type Variant = "default" | "finance" | "engineering" | "crypto";

type Props = {
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
  variant?: Variant;
};

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

const AnimatedGlowBackground = ({
  children,
  className = "",
  contentClassName = "",
  variant = "default",
}: Props) => {
  const areaRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);

  const rectRef = useRef<DOMRect | null>(null);
  const lastRef = useRef({ x: 0.5, y: 0.5, dirty: false });

  useEffect(() => {
    const el = areaRef.current;
    if (!el) return;

    const media = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (media?.matches) return;

    const updateRect = () => {
      rectRef.current = el.getBoundingClientRect();
    };

    const apply = () => {
      rafRef.current = null;

      if (!lastRef.current.dirty) return;
      lastRef.current.dirty = false;

      const rect = rectRef.current;
      if (!rect || rect.width === 0 || rect.height === 0) return;

      const cx = clamp01(lastRef.current.x);
      const cy = clamp01(lastRef.current.y);

      el.style.setProperty("--mx", `${Math.round(cx * 100)}%`);
      el.style.setProperty("--my", `${Math.round(cy * 100)}%`);

      const ox = (cx - 0.5) * 2;
      const oy = (cy - 0.5) * 2;

      el.style.setProperty("--ox", `${ox.toFixed(3)}`);
      el.style.setProperty("--oy", `${oy.toFixed(3)}`);
    };

    const schedule = () => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(apply);
    };

    const onMove = (e: PointerEvent) => {
      const rect = rectRef.current;
      if (!rect) return;

      lastRef.current.x = (e.clientX - rect.left) / rect.width;
      lastRef.current.y = (e.clientY - rect.top) / rect.height;
      lastRef.current.dirty = true;

      schedule();
    };

    const onLeave = () => {
      lastRef.current.x = 0.5;
      lastRef.current.y = 0.5;
      lastRef.current.dirty = true;
      schedule();
    };

    updateRect();
    onLeave();

    const onResize = () => updateRect();
    window.addEventListener("resize", onResize, { passive: true });
    window.addEventListener("scroll", onResize, { passive: true });

    const ro =
      "ResizeObserver" in window ? new ResizeObserver(updateRect) : null;
    ro?.observe(el);

    el.addEventListener("pointermove", onMove, { passive: true });
    el.addEventListener("pointerleave", onLeave, { passive: true });

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onResize);
      ro?.disconnect();
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  const palette =
    variant === "engineering"
      ? {
          top: "from-primary/25 via-indigo-500/15 to-cyan-500/25",
          bottom: "from-amber-500/10 via-primary/10 to-emerald-500/10",
          shimmer:
            "radial-gradient(circle at var(--mx, 50%) var(--my, 50%), hsl(var(--primary)/0.20), transparent 45%)," +
            "radial-gradient(circle at calc(var(--mx, 50%) + 18%) calc(var(--my, 50%) + 10%), rgba(99,102,241,0.14), transparent 50%)," +
            "radial-gradient(circle at calc(var(--mx, 50%) - 14%) calc(var(--my, 50%) + 22%), rgba(34,211,238,0.14), transparent 55%)",
        }
      : variant === "finance"
      ? {
          top: "from-primary/25 via-emerald-500/15 to-cyan-500/25",
          bottom: "from-purple-500/10 via-primary/10 to-emerald-500/10",
          shimmer:
            "radial-gradient(circle at var(--mx, 50%) var(--my, 50%), hsl(var(--primary)/0.22), transparent 45%)," +
            "radial-gradient(circle at calc(var(--mx, 50%) + 18%) calc(var(--my, 50%) + 10%), rgba(16,185,129,0.14), transparent 50%)," +
            "radial-gradient(circle at calc(var(--mx, 50%) - 14%) calc(var(--my, 50%) + 22%), rgba(34,211,238,0.14), transparent 55%)",
        }
      : variant === "crypto"
      ? {
          top: "from-primary/20 via-purple-500/18 to-cyan-500/22",
          bottom: "from-fuchsia-500/10 via-primary/10 to-emerald-500/10",
          shimmer:
            "radial-gradient(circle at var(--mx, 50%) var(--my, 50%), hsl(var(--primary)/0.18), transparent 45%)," +
            "radial-gradient(circle at calc(var(--mx, 50%) + 18%) calc(var(--my, 50%) + 10%), rgba(16,85,247,0.14), transparent 50%)," +
            "radial-gradient(circle at calc(var(--mx, 50%) - 14%) calc(var(--my, 50%) + 22%), rgba(34,211,238,0.14), transparent 55%)",
        }
      : {
          top: "from-primary/20 via-emerald-500/12 to-cyan-500/20",
          bottom: "from-purple-500/10 via-primary/10 to-emerald-500/10",
          shimmer:
            "radial-gradient(circle at var(--mx, 50%) var(--my, 50%), hsl(var(--primary)/0.18), transparent 45%)," +
            "radial-gradient(circle at calc(var(--mx, 50%) + 18%) calc(var(--my, 50%) + 10%), rgba(16,185,129,0.10), transparent 50%)," +
            "radial-gradient(circle at calc(var(--mx, 50%) - 14%) calc(var(--my, 50%) + 22%), rgba(34,211,238,0.10), transparent 55%)",
        };

  return (
    <div
      ref={areaRef}
      className={`relative overflow-hidden ${className}`}
      style={{
        "--b1y": "10px",
        "--b1s": 0.03,
        "--b2y": "-12px",
        "--b2s": 0.04,
      }}
    >
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background" />

        <div
          className={`finance-blob-1 absolute -top-28 left-1/2 h-[520px] w-[min(920px,100vw)] -translate-x-1/2 rounded-full
          bg-gradient-to-r ${palette.top} blur-3xl`}
          style={{
            transform:
              "translateX(-50%) translateY(calc(var(--oy, 0) * var(--b1y))) scale(calc(1 + (var(--ox, 0) * var(--b1s))))",
          }}
        />

        <div
          className={`finance-blob-2 absolute -bottom-40 left-1/2 h-[520px] w-[min(920px,100vw)] -translate-x-1/2 rounded-full
          bg-gradient-to-r ${palette.bottom} blur-3xl`}
          style={{
            transform:
              "translateX(-50%) translateY(calc(var(--oy, 0) * var(--b2y))) scale(calc(1 + (var(--ox, 0) * var(--b2s))))",
          }}
        />

        <div
          className="finance-shimmer absolute inset-0 opacity-45 mix-blend-soft-light"
          style={{ background: palette.shimmer }}
        />
      </div>

      <div className={contentClassName}>{children}</div>
    </div>
  );
};

export default AnimatedGlowBackground;
