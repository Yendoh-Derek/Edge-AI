import { HTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  interactive?: boolean;
};

export function Card({
  interactive,
  className = "",
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={twMerge(
        "rounded-2xl border border-border-subtle bg-surface-elevated/90 shadow-sm/40 backdrop-blur-sm",
        interactive &&
          "cursor-pointer transition-all hover:-translate-y-[1px] hover:border-border-strong hover:shadow-md",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

