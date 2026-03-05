import Link from "next/link";
import { HTMLAttributes } from "react";

type BrandLogoProps = HTMLAttributes<HTMLDivElement> & {
  compact?: boolean;
};

export function BrandLogo({ compact, className = "", ...props }: BrandLogoProps) {
  return (
    <div
      className={`inline-flex items-center gap-2 ${className}`}
      aria-label="Edge AI home"
      {...props}
    >
      <Link href="/" className="inline-flex">
        <span className="inline-flex items-baseline gap-1.5">
          <span className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            Edge
          </span>
          <span className="rounded-full bg-brand px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-surface-elevated shadow-sm md:text-[0.75rem]">
            AI
          </span>
        </span>
      </Link>
      {!compact && (
        <span className="hidden text-[0.7rem] font-medium uppercase tracking-[0.18em] text-muted md:inline">
          Foundational Learning Ghana
        </span>
      )}
    </div>
  );
}

