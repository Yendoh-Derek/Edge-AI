import { BrandLogo } from "../brand-logo";
import { ReactNode } from "react";

type TopNavProps = {
  rightSlot?: ReactNode;
};

export function TopNav({ rightSlot }: TopNavProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-border-subtle/70 bg-surface-elevated/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-6">
        <BrandLogo compact />
        <div className="flex items-center gap-3 text-xs text-muted md:text-sm">
          {rightSlot}
        </div>
      </div>
    </header>
  );
}

