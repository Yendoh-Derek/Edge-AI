"use client";

import { createContext, ReactNode, useContext, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export type ToastVariant = "success" | "info" | "warning";

export type ToastInput = {
  title: string;
  description?: string;
  variant?: ToastVariant;
};

type ToastItem = ToastInput & { id: string };

type ToastContextValue = {
  toast: (t: ToastInput) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const api = useMemo(
    () => ({
      toast: (t: ToastInput) => {
        const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
        const item: ToastItem = { id, variant: "info", ...t };
        setItems((prev) => [item, ...prev].slice(0, 3));
        setTimeout(() => {
          setItems((prev) => prev.filter((x) => x.id !== id));
        }, 3200);
      },
    }),
    []
  );

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 top-4 z-50 mx-auto flex max-w-md flex-col gap-2 px-4">
        <AnimatePresence initial={false}>
          {items.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.98 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className={[
                "pointer-events-auto rounded-2xl border bg-surface-elevated/95 px-4 py-3 shadow-md backdrop-blur",
                t.variant === "success"
                  ? "border-success/25"
                  : t.variant === "warning"
                    ? "border-warning/25"
                    : "border-border-subtle",
              ].join(" ")}
              role="status"
              aria-live="polite"
            >
              <div className="flex items-start gap-3">
                <div
                  className={[
                    "mt-0.5 h-2.5 w-2.5 rounded-full",
                    t.variant === "success"
                      ? "bg-success"
                      : t.variant === "warning"
                        ? "bg-warning"
                        : "bg-brand",
                  ].join(" ")}
                  aria-hidden
                />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-foreground">{t.title}</p>
                  {t.description && (
                    <p className="mt-0.5 text-xs leading-relaxed text-muted">
                      {t.description}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return ctx;
}

