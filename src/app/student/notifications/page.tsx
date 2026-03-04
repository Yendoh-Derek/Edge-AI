"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { TopNav } from "../../../components/layout/top-nav";
import { Card } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { EdgeNotification, loadNotifications, saveNotifications } from "../../lib/notifications";

type PlanSession = {
  session: string;
  skill: string;
  strategy: string;
  duration: string;
};

type LessonPlanPayload = {
  generatedAt?: string;
  sessions?: PlanSession[];
};

type ChecklistState = Record<string, boolean>;

const LESSON_PLAN_KEY = "edgeai_latest_plan_for_kofi";
const LESSON_PLAN_PROGRESS_KEY = "edgeai_lesson_plan_progress_v1";

export default function StudentNotificationsPage() {
  const [notifications, setNotifications] = useState<EdgeNotification[]>([]);
  const [sessions, setSessions] = useState<PlanSession[]>([]);
  const [generatedAt, setGeneratedAt] = useState<string | null>(null);
  const [checklist, setChecklist] = useState<ChecklistState>({});

  useEffect(() => {
    const initial = loadNotifications();
    setNotifications(initial);

    if (typeof window === "undefined") return;
    try {
      const rawPlan = window.sessionStorage.getItem(LESSON_PLAN_KEY);
      if (rawPlan) {
        const parsed = JSON.parse(rawPlan) as LessonPlanPayload;
        if (parsed.sessions) setSessions(parsed.sessions);
        if (parsed.generatedAt) setGeneratedAt(parsed.generatedAt);
      }

      const rawProgress = window.sessionStorage.getItem(LESSON_PLAN_PROGRESS_KEY);
      if (rawProgress) {
        const parsedProgress = JSON.parse(rawProgress) as ChecklistState;
        setChecklist(parsedProgress);
      }
    } catch {
      // ignore
    }
  }, []);

  const sortedNotifications = useMemo(() => {
    return [...notifications].sort((a, b) => {
      const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return bTime - aTime;
    });
  }, [notifications]);

  function toggleChecklist(id: string) {
    setChecklist((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      if (typeof window !== "undefined") {
        try {
          window.sessionStorage.setItem(LESSON_PLAN_PROGRESS_KEY, JSON.stringify(next));
        } catch {
          // ignore
        }
      }
      return next;
    });
  }

  function markAsRead(id: string) {
    const updated = notifications.map((n) =>
      n.id === id
        ? {
            ...n,
            read: true,
          }
        : n,
    );
    setNotifications(updated);
    saveNotifications(updated);
  }

  return (
    <main className="min-h-[100svh]">
      <TopNav
        rightSlot={
          <Link
            href="/student/results"
            className="rounded-full px-3 py-2 text-xs font-medium text-muted transition-colors hover:bg-surface hover:text-brand"
          >
            ← Status
          </Link>
        }
      />

      <div className="mx-auto max-w-6xl px-4 pb-12 pt-6 md:px-6 md:pt-8">
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="space-y-6"
        >
          <Card className="p-5 md:p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
              Inbox
            </p>
            <h1 className="mt-1 text-xl font-semibold tracking-tight text-foreground md:text-2xl">
              Messages & notifications
            </h1>
            <p className="mt-1 text-sm text-muted">
              See notes from your teacher and updates about your lesson plan and tutor sessions. You
              can always start your AI tutor session from here.
            </p>
          </Card>

          <div className="grid gap-4 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
            <Card className="p-5 md:p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                    Notifications
                  </p>
                  <h2 className="mt-1 text-lg font-semibold text-foreground">
                    From your teacher and tutor
                  </h2>
                </div>
              </div>
              <div className="mt-4 space-y-2 text-sm">
                {sortedNotifications.length === 0 && (
                  <p className="text-xs text-muted">
                    You don&apos;t have any notifications yet. When your teacher approves a lesson
                    plan or sends you a note, it will appear here.
                  </p>
                )}
                {sortedNotifications.map((n) => (
                  <button
                    key={n.id}
                    type="button"
                    onClick={() => markAsRead(n.id)}
                    className={[
                      "flex w-full items-start justify-between gap-3 rounded-2xl border px-3 py-2 text-left text-sm",
                      n.read
                        ? "border-border-subtle bg-surface"
                        : "border-brand/50 bg-brand-soft/30",
                    ].join(" ")}
                  >
                    <div>
                      <p className="font-medium text-foreground">{n.title}</p>
                      <p className="mt-0.5 text-xs text-muted">{n.body}</p>
                      {n.createdAt && (
                        <p className="mt-1 text-[0.7rem] text-muted">
                          {new Date(n.createdAt).toLocaleString(undefined, {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })}
                        </p>
                      )}
                      {n.link && n.link !== "/student/notifications" && (
                        <Link
                          href={n.link}
                          className="mt-1 inline-flex text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-brand underline-offset-2 hover:underline"
                        >
                          Open related page
                        </Link>
                      )}
                    </div>
                    {!n.read && (
                      <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-brand" aria-hidden />
                    )}
                  </button>
                ))}
              </div>
            </Card>

            <Card className="p-5 md:p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                Lesson plan
              </p>
              <h2 className="mt-1 text-lg font-semibold text-foreground">
                Approved sessions checklist
              </h2>
              {generatedAt && (
                <p className="mt-1 text-xs text-muted">
                  Generated at:{" "}
                  {new Date(generatedAt).toLocaleString(undefined, {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </p>
              )}
              {sessions.length === 0 ? (
                <p className="mt-3 text-sm text-muted">
                  A lesson plan has not been generated yet in this demo. Go to your Status page and
                  generate one from your diagnostic results.
                </p>
              ) : (
                <div className="mt-4 space-y-3">
                  {sessions.map((s) => {
                    const id = s.session || `${s.skill}-${s.duration}`;
                    const checked = !!checklist[id];
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => toggleChecklist(id)}
                        className="flex w-full items-start gap-3 rounded-2xl border border-border-subtle bg-surface px-3 py-2 text-left text-sm hover:border-border-strong"
                      >
                        <span
                          className={[
                            "mt-1 h-4 w-4 rounded border",
                            checked ? "border-brand bg-brand" : "border-border-subtle bg-surface",
                          ].join(" ")}
                          aria-hidden
                        />
                        <div>
                          <p className="text-sm font-semibold text-foreground">
                            {s.session} – {s.skill}
                          </p>
                          <p className="mt-1 text-xs leading-relaxed text-muted">{s.strategy}</p>
                          <p className="mt-1 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-muted">
                            {s.duration}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              <div className="mt-5 flex justify-center">
                <Button
                  asChild
                  className="w-full max-w-sm px-8 py-3 text-sm font-semibold md:w-auto"
                >
                  <Link href="/student/tutor">Start AI tutor session</Link>
                </Button>
              </div>
            </Card>
          </div>
        </motion.section>
      </div>
    </main>
  );
}

