"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BrandLogo } from "../../../components/brand-logo";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";

export default function StudentLoginPage() {
  const router = useRouter();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setTimeout(() => {
      router.push("/student/dashboard");
    }, 400);
  }

  return (
    <main className="mx-auto flex min-h-[100svh] max-w-md flex-col px-4 pb-8 pt-5 md:max-w-xl md:pt-8">
      <BrandLogo />
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="mt-8"
      >
        <Card className="p-5 md:p-6">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
                Sign in
              </p>
              <h1 className="mt-1 text-lg font-semibold text-foreground md:text-xl">
                Student dashboard
              </h1>
            </div>
            <span className="rounded-full bg-surface px-3 py-1 text-[0.7rem] font-medium uppercase tracking-[0.18em] text-muted">
              Student
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5 text-sm">
              <label htmlFor="username" className="font-medium text-foreground">
                Student username
              </label>
              <input
                id="username"
                type="text"
                autoComplete="username"
                required
                className="w-full rounded-xl border border-border-subtle bg-surface-elevated px-3 py-2.5 text-sm outline-none ring-offset-2 ring-offset-surface-elevated focus:border-brand focus:ring-2 focus:ring-brand"
                placeholder="kofi.asante"
              />
            </div>
            <div className="space-y-1.5 text-sm">
              <label htmlFor="password" className="font-medium text-foreground">
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                className="w-full rounded-xl border border-border-subtle bg-surface-elevated px-3 py-2.5 text-sm outline-none ring-offset-2 ring-offset-surface-elevated focus:border-brand focus:ring-2 focus:ring-brand"
                placeholder="********"
              />
            </div>
            <Button type="submit" fullWidth className="mt-4">
              Sign In
            </Button>
          </form>

          <div className="mt-4 flex items-center justify-between text-xs text-muted">
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-xs font-medium text-muted hover:text-brand"
            >
              ← Back to role select
            </Link>
          </div>
        </Card>
      </motion.section>
    </main>
  );
}

