import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * Motion + lighting notes
 * - Easing is an expo-out curve (Apple/Linear feel): fast to settle, no bounce.
 * - Hover settles in 200ms; press is 75ms so the button answers the finger
 *   instantly, then releases back through the slower curve.
 * - Filled variants carry an `inset 0 1px` white highlight — a specular top
 *   edge that reads as a lit, physical surface rather than a flat fill.
 * - Only the properties that actually change are transitioned (not `all`), so
 *   the compositor isn't handed work it doesn't need.
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold tracking-tight select-none " +
    "transition-[transform,box-shadow,background-color,border-color,color,opacity,filter] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background " +
    "disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0 " +
    "active:translate-y-0 active:scale-[0.97] active:duration-75",
  {
    variants: {
      variant: {
        primary:
          "bg-gradient-to-b from-brand-400 to-brand-600 text-[#1a0606] ring-1 ring-inset ring-black/10 " +
          "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.40),0_8px_24px_-8px_rgba(240,85,85,0.50)] " +
          "hover:from-brand-500 hover:to-brand-700 hover:-translate-y-0.5 " +
          "hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.55),0_14px_36px_-10px_rgba(240,85,85,0.65)]",
        book:
          "bg-gradient-to-b from-brand-400 to-brand-600 text-[#1a0606] ring-1 ring-inset ring-black/15 " +
          "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.40),0_8px_24px_-8px_rgba(240,85,85,0.50)] " +
          "hover:brightness-105 hover:-translate-y-0.5 " +
          "hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.55),0_14px_36px_-10px_rgba(240,85,85,0.65)]",
        secondary:
          "bg-foreground text-background ring-1 ring-inset ring-white/10 " +
          "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.14),0_6px_18px_-8px_rgba(0,0,0,0.45)] " +
          "hover:opacity-90 hover:-translate-y-0.5 " +
          "hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.20),0_12px_28px_-10px_rgba(0,0,0,0.55)]",
        outline:
          "border border-border bg-transparent hover:bg-muted hover:border-foreground/20 hover:-translate-y-0.5 hover:shadow-soft",
        glass:
          "glass border border-white/15 text-foreground hover:bg-white/80 dark:hover:bg-white/10 hover:-translate-y-0.5 hover:shadow-soft",
        ghost: "hover:bg-muted",
        link: "text-brand underline-offset-4 hover:underline active:scale-100",
      },
      size: {
        sm: "h-9 px-4 text-[13px]",
        default: "h-11 px-6",
        lg: "h-[3.25rem] px-8 text-base",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
