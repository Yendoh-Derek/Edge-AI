"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { TopNav } from "../../../components/layout/top-nav";
import { Card } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";

type PlanSession = {
  session: string;
  skill: string;
  strategy: string;
  duration: string;
};

type ChecklistState = Record<string, boolean>;

const LESSON_PLAN_PROGRESS_KEY = "edgeai_lesson_plan_progress_v1";

export default function StudentLessonPlanPage() {
  const [sessions, setSessions] = useState<PlanSession[]>([]);
  const [generatedAt, setGeneratedAt] = useState<string | null>(null);
  const [checklist, setChecklist] = useState<ChecklistState>({});

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.sessionStorage.getItem("edgeai_latest_plan_for_kofi");
      if (!raw) return;
      const parsed = JSON.parse(raw) as {
        generatedAt?: string;
        sessions?: PlanSession[];
      };
      if (parsed.sessions) setSessions(parsed.sessions);
      if (parsed.generatedAt) setGeneratedAt(parsed.generatedAt);

      const rawProgress = window.sessionStorage.getItem(LESSON_PLAN_PROGRESS_KEY);
      if (rawProgress) {
        const parsedProgress = JSON.parse(rawProgress) as ChecklistState;
        setChecklist(parsedProgress);
      }
    } catch {
      // ignore
    }
  }, []);

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

      <div className="mx-auto max-w-4xl px-4 pb-12 pt-6 md:px-6 md:pt-8">
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="space-y-6"
        >
          <Card className="p-5 md:p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
              Lesson plan
            </p>
            <h1 className="mt-1 text-xl font-semibold tracking-tight text-foreground md:text-2xl">
              Next sessions for you
            </h1>
            <p className="mt-1 text-sm text-muted">
              Your teacher has approved this short plan. You&apos;ll work through each session with
              the AI tutor. You can also find this checklist on your Notifications page.
            </p>
            {generatedAt && (
              <p className="mt-1 text-xs text-muted">
                Generated at:{" "}
                {new Date(generatedAt).toLocaleString(undefined, {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </p>
            )}
          </Card>

          <Card className="p-5 md:p-6">
            <h2 className="text-sm font-semibold text-foreground">Session outline</h2>
            {sessions.length === 0 ? (
              <p className="mt-3 text-sm text-muted">
                A lesson plan has not been generated yet in this demo. Go to the Status page and
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
          </Card>

          <Card className="p-5 md:p-6">
            <h2 className="text-sm font-semibold text-foreground">Teacher notes for you</h2>
            <p className="mt-2 text-sm text-muted">
              Start each session with a calm mind. Read the questions carefully, think aloud when
              the tutor asks you why, and don&apos;t worry about mistakes—the goal is to understand
              more each time.
            </p>
          </Card>

          <div className="flex justify-center">
            <Button
              asChild
              className="w-full max-w-sm px-8 py-3 text-sm font-semibold md:w-auto"
            >
              <Link href="/student/tutor">Start AI tutor session</Link>
            </Button>
          </div>
        </motion.section>
      </div>
    </main>
  );
}

