import { ButtonHTMLAttributes, forwardRef } from "react";
import { Slot } from "@radix-ui/react-slot";
import { twMerge } from "tailwind-merge";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  loading?: boolean;
  asChild?: boolean;
};

const baseClasses =
  "inline-flex items-center justify-center rounded-full font-medium transition-colors transition-transform active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-surface-elevated disabled:cursor-not-allowed disabled:opacity-50";

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-brand text-white shadow-sm hover:bg-brand-strong active:bg-brand-strong/90",
  secondary:
    "bg-surface-elevated text-foreground border border-border-subtle hover:border-border-strong hover:bg-surface active:bg-surface-elevated",
  ghost:
    "bg-transparent text-foreground hover:bg-surface active:bg-surface-elevated",
};

const sizeClasses: Record<Size, string> = {
  sm: "h-9 px-4 text-xs",
  md: "h-10 px-5 text-sm",
  lg: "h-11 px-6 text-sm md:text-base",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      fullWidth,
      loading,
      asChild,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const classes = twMerge(
      baseClasses,
      variantClasses[variant],
      sizeClasses[size],
      fullWidth && "w-full",
      className
    );

    if (asChild) {
      return (
        <Slot className={classes} {...(props as any)}>
          {children}
        </Slot>
      );
    }

    return (
      <button ref={ref} className={classes} {...props}>
        {loading && (
          <span className="mr-2 inline-flex h-3 w-3 animate-spin rounded-full border-2 border-surface-elevated border-t-transparent" />
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

