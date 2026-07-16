"use client";

import * as React from "react";
import { MotionConfig } from "framer-motion";

/**
 * Root Framer Motion configuration. `reducedMotion="user"` makes every motion
 * component honour the OS "reduce motion" setting: transform/layout animations
 * are skipped to their final state while opacity/colour still animate — the
 * accessible default. Applies globally to all nested motion components.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
