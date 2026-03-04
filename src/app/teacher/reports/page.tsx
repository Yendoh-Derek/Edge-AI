"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useMemo, useState } from "react";
import { TopNav } from "../../../components/layout/top-nav";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";
import { useToast } from "../../../components/ui/toast";

type Frequency = "Daily" | "Weekly" | "Bi-weekly" | "Monthly";

type Report = {
  id: string;
  learnerName: string;
  date: string;
  summary: string;
  status: "New" | "Reviewed";
};

export default function TeacherReportsPage() {
  const { toast } = useToast();

  const [enabled, setEnabled] = useState(true);
  const [frequency, setFrequency] = useState<Frequency>("Weekly");
  const [time, setTime] = useState("18:00");
  const [inApp, setInApp] = useState(true);
  const [whatsApp, setWhatsApp] = useState(true);

  const [openId, setOpenId] = useState<string | null>(null);

  const reports: Report[] = useMemo(
    () => [
      {
        id: "r1",
        learnerName: "Derek Yendoh",
        date: "03 Mar 2026",
        summary: "Fractions mastery +18% this week",
        status: "New",
      },
      {
        id: "r2",
        learnerName: "Khalida Ali",
        date: "03 Mar 2026",
        summary: "Inferencing +9% · Fluency steady",
        status: "Reviewed",
      },
      {
        id: "r3",
        learnerName: "Michael Menu",
        date: "03 Mar 2026",
        summary: "Vocabulary +6% · Session completion improved",
        status: "New",
      },
    ],
    []
  );

  function saveToast() {
    toast({ title: "Settings saved", description: "Report schedule updated.", variant: "success" });
  }

  function shareParent(name: string) {
    toast({
      title: "Shared with parent",
      description: `Report sent for ${name} via selected channels (demo).`,
      variant: "success",
    });
  }

  return (
    <main className="min-h-[100svh]">
      <TopNav
        rightSlot={
          <>
            <Link
              href="/teacher/dashboard"
              className="rounded-full px-3 py-2 text-xs font-medium text-muted transition-colors hover:bg-surface hover:text-brand"
            >
              ← Dashboard
            </Link>
            <Link
              href="/"
              className="rounded-full px-3 py-2 text-xs font-medium text-muted transition-colors hover:bg-surface hover:text-brand"
            >
              Sign out
            </Link>
          </>
        }
      />

      <div className="mx-auto max-w-6xl px-4 pb-12 pt-6 md:px-6 md:pt-8">
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="space-y-6"
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
              Teacher reports
            </p>
            <h1 className="mt-1 text-xl font-semibold tracking-tight text-foreground md:text-2xl">
              Learner Progress Reports
            </h1>
            <p className="mt-1 text-sm text-muted">
              Scheduled summaries for quick class decisions—plus shareable progress snapshots.
            </p>
          </div>

          <Card className="p-5 md:p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                  Report schedule settings
                </p>
                <h2 className="mt-1 text-lg font-semibold text-foreground">
                  Automated reporting
                </h2>
              </div>
              <span className="rounded-full bg-surface px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-muted">
                In-app + WhatsApp
              </span>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <SettingRow
                label="Enable scheduled reports"
                right={
                  <Toggle
                    checked={enabled}
                    onChange={(v) => {
                      setEnabled(v);
                      saveToast();
                    }}
                  />
                }
              />

              <SettingRow
                label="Frequency"
                right={
                  <select
                    value={frequency}
                    onChange={(e) => {
                      setFrequency(e.target.value as Frequency);
                      saveToast();
                    }}
                    className="h-10 rounded-full border border-border-subtle bg-surface px-4 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand"
                    disabled={!enabled}
                  >
                    {["Daily", "Weekly", "Bi-weekly", "Monthly"].map((f) => (
                      <option key={f} value={f}>
                        {f}
                      </option>
                    ))}
                  </select>
                }
              />

              <SettingRow
                label="Delivery time"
                right={
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => {
                      setTime(e.target.value);
                      saveToast();
                    }}
                    className="h-10 rounded-full border border-border-subtle bg-surface px-4 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand"
                    disabled={!enabled}
                  />
                }
              />

              <SettingRow
                label="Notification channel"
                right={
                  <div className="flex items-center gap-2">
                    <ChannelToggle
                      label="In-app"
                      checked={inApp}
                      onChange={(v) => {
                        setInApp(v);
                        saveToast();
                      }}
                      disabled={!enabled}
                    />
                    <ChannelToggle
                      label="WhatsApp"
                      checked={whatsApp}
                      onChange={(v) => {
                        setWhatsApp(v);
                        saveToast();
                      }}
                      disabled={!enabled}
                    />
                  </div>
                }
              />
            </div>
          </Card>

          <Card className="p-5 md:p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                  Recent reports
                </p>
                <h2 className="mt-1 text-lg font-semibold text-foreground">This period</h2>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {reports.map((r) => (
                <div
                  key={r.id}
                  className="rounded-2xl border border-border-subtle bg-surface-elevated p-4"
                >
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground">{r.learnerName}</p>
                      <p className="mt-1 text-xs text-muted">
                        {r.date} · <span className="font-medium text-foreground">{r.summary}</span>
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={[
                          "rounded-full border px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.18em]",
                          r.status === "New"
                            ? "border-brand/25 bg-brand-soft text-brand"
                            : "border-border-subtle bg-surface text-muted",
                        ].join(" ")}
                      >
                        {r.status}
                      </span>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setOpenId((id) => (id === r.id ? null : r.id))}
                      >
                        View Full Report
                      </Button>
                    </div>
                  </div>

                  <AnimatePresence initial={false}>
                    {openId === r.id && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 6 }}
                        transition={{ duration: 0.22, ease: "easeOut" }}
                        className="mt-4 rounded-2xl border border-border-subtle bg-surface p-4"
                      >
                        <div className="grid gap-4 md:grid-cols-2">
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                              Sessions completed
                            </p>
                            <p className="mt-2 text-sm font-semibold text-foreground">3 sessions</p>
                            <p className="mt-1 text-xs text-muted">
                              Completion rate: 86% · Avg duration: 14 mins
                            </p>
                          </div>
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                              Cooperation indicators
                            </p>
                            <p className="mt-2 text-xs text-muted">
                              Topics attempted vs skipped: 5 attempted · 1 skipped
                            </p>
                            <p className="mt-1 text-xs text-muted">
                              Revision behaviour: improved
                            </p>
                          </div>
                        </div>

                        <div className="mt-4">
                          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                            Mastery delta (from baseline)
                          </p>
                          <div className="mt-3 space-y-2">
                            <DeltaBar label="Fractions" delta={18} />
                            <DeltaBar label="Vocabulary" delta={6} />
                            <DeltaBar label="Inferencing" delta={9} />
                          </div>
                        </div>

                        <div className="mt-4 rounded-2xl border border-border-subtle bg-white p-4">
                          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                            AI tutor recommendation
                          </p>
                          <p className="mt-2 text-sm text-foreground">
                            Continue with short, frequent fraction comparisons using visuals, then
                            reinforce with word problems in GH₵ contexts (market prices, transport
                            fares).
                          </p>
                        </div>

                        <div className="mt-4 flex flex-col gap-2 md:flex-row md:justify-end">
                          <Button
                            variant="secondary"
                            onClick={() => {
                              toast({
                                title: "Marked as reviewed",
                                description: `${r.learnerName} report status updated (demo).`,
                                variant: "success",
                              });
                            }}
                          >
                            Mark Reviewed
                          </Button>
                          <Button onClick={() => shareParent(r.learnerName)}>
                            Share with Parent
                          </Button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </Card>
        </motion.section>
      </div>
    </main>
  );
}

function SettingRow({ label, right }: { label: string; right: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl border border-border-subtle bg-surface-elevated p-4">
      <p className="text-sm font-medium text-foreground">{label}</p>
      <div className="shrink-0">{right}</div>
    </div>
  );
}

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={[
        "relative h-7 w-12 rounded-full border transition-colors",
        checked ? "border-brand bg-brand" : "border-border-subtle bg-surface",
      ].join(" ")}
      aria-pressed={checked}
    >
      <span
        className={[
          "absolute top-1 h-5 w-5 rounded-full bg-white transition-transform",
          checked ? "translate-x-6" : "translate-x-1",
        ].join(" ")}
      />
    </button>
  );
}

function ChannelToggle({
  label,
  checked,
  onChange,
  disabled,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      disabled={disabled}
      className={[
        "rounded-full border px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] transition-colors",
        checked ? "border-brand/25 bg-brand-soft text-brand" : "border-border-subtle bg-surface text-muted",
        disabled ? "opacity-60" : "hover:border-border-strong",
      ].join(" ")}
      aria-pressed={checked}
    >
      {label}
    </button>
  );
}

function DeltaBar({ label, delta }: { label: string; delta: number }) {
  const w = Math.min(100, Math.max(0, delta));
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-foreground">{label}</span>
        <span className="font-semibold text-brand">+{delta}%</span>
      </div>
      <div className="h-2 w-full rounded-full bg-white">
        <div className="h-2 rounded-full bg-brand" style={{ width: `${w}%` }} />
      </div>
    </div>
  );
}

