import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold tracking-tight transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0 active:scale-[0.98] select-none",
  {
    variants: {
      variant: {
        primary:
          "bg-gradient-to-b from-brand-300 to-brand-500 text-[#2a2208] ring-1 ring-inset ring-black/10 shadow-[0_8px_24px_-8px_rgba(201,162,39,0.55)] hover:from-brand-400 hover:to-brand-600 hover:shadow-[0_14px_36px_-10px_rgba(201,162,39,0.7)] hover:-translate-y-0.5",
        secondary:
          "bg-foreground text-background hover:opacity-90 hover:-translate-y-0.5",
        outline:
          "border border-border bg-transparent hover:bg-muted hover:-translate-y-0.5",
        glass:
          "glass border border-white/15 text-foreground hover:bg-white/80 dark:hover:bg-white/10 hover:-translate-y-0.5",
        ghost: "hover:bg-muted",
        link: "text-brand underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-9 px-4 text-[13px]",
        default: "h-11 px-6",
        lg: "h-13 px-8 text-base h-[3.25rem]",
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
