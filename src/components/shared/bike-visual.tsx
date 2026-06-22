import * as React from "react";

import { cn } from "@/lib/utils";

type BikeVisualProps = {
  category: "Scooter" | "Motorcycle";
  engine: string;
  accent: string;
  className?: string;
  /** large ghost number behind the silhouette, e.g. "125" */
  ghost?: string;
};

/**
 * A self-contained, premium product visual for each bike: a gradient panel
 * with an engine-size watermark and a clean line-art silhouette.
 * No external image assets required — renders identically offline.
 */
export function BikeVisual({
  category,
  engine,
  accent,
  className,
  ghost,
}: BikeVisualProps) {
  return (
    <div
      className={cn(
        "relative flex aspect-[16/10] w-full items-center justify-center overflow-hidden rounded-[1.4rem] bg-gradient-to-br",
        accent,
        className,
      )}
    >
      {/* soft top glow */}
      <div className="pointer-events-none absolute -top-1/3 left-1/2 h-2/3 w-2/3 -translate-x-1/2 rounded-full bg-white/10 blur-3xl" />
      {/* dotted grid texture */}
      <div className="pointer-events-none absolute inset-0 bg-dot opacity-60" />

      {/* ghost engine number */}
      <span className="pointer-events-none absolute select-none text-[7rem] font-black leading-none tracking-tighter text-white/[0.06] sm:text-[9rem]">
        {ghost ?? engine.replace("cc", "")}
      </span>

      {category === "Scooter" ? <ScooterSilhouette /> : <MotorcycleSilhouette />}

      {/* engine badge */}
      <span className="absolute bottom-4 left-4 rounded-full border border-white/15 bg-black/30 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white/80 backdrop-blur-sm">
        {engine}
      </span>
    </div>
  );
}

function ScooterSilhouette() {
  return (
    <svg
      viewBox="0 0 240 130"
      className="relative z-10 h-auto w-[72%] text-white drop-shadow-[0_12px_24px_rgba(0,0,0,0.45)]"
      fill="none"
      aria-hidden="true"
    >
      <g
        stroke="currentColor"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* rear wheel */}
        <circle cx="58" cy="98" r="22" />
        <circle cx="58" cy="98" r="7" className="opacity-50" />
        {/* front wheel */}
        <circle cx="190" cy="98" r="22" />
        <circle cx="190" cy="98" r="7" className="opacity-50" />
        {/* deck + body */}
        <path d="M58 98 H150" />
        <path d="M150 98 C 150 78 150 64 168 56" />
        {/* front apron + handlebar stem */}
        <path d="M168 56 C 180 50 196 54 198 72 L 190 98" />
        <path d="M168 56 L 176 30" />
        <path d="M168 30 H 196" />
        {/* seat + tail */}
        <path d="M58 78 C 70 62 96 60 116 64 L 150 70" />
        <path d="M116 64 L 110 78" />
      </g>
    </svg>
  );
}

function MotorcycleSilhouette() {
  return (
    <svg
      viewBox="0 0 250 130"
      className="relative z-10 h-auto w-[78%] text-white drop-shadow-[0_12px_24px_rgba(0,0,0,0.45)]"
      fill="none"
      aria-hidden="true"
    >
      <g
        stroke="currentColor"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* rear wheel */}
        <circle cx="48" cy="96" r="24" />
        <circle cx="48" cy="96" r="7" className="opacity-50" />
        {/* front wheel */}
        <circle cx="204" cy="96" r="24" />
        <circle cx="204" cy="96" r="7" className="opacity-50" />
        {/* swingarm + engine block */}
        <path d="M48 96 L 110 90 L 132 96" />
        <path d="M104 70 L 118 96" />
        {/* tank + seat line */}
        <path d="M70 66 C 92 56 120 56 138 60" />
        <path d="M138 60 C 150 56 168 56 176 66" />
        {/* tail */}
        <path d="M70 66 L 58 74" />
        {/* front fairing + forks */}
        <path d="M176 66 C 196 60 210 66 206 82" />
        <path d="M198 70 L 204 96" />
        {/* handlebar */}
        <path d="M176 66 L 188 50" />
        <path d="M182 50 H 204" />
      </g>
    </svg>
  );
}
