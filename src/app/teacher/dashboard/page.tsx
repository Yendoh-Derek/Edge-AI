"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import { TopNav } from "../../../components/layout/top-nav";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";
import { useToast } from "../../../components/ui/toast";

type SkillKey =
  | "Number Sense"
  | "Fractions"
  | "Proportional Reasoning"
  | "Inferencing"
  | "Vocabulary";

type Learner = {
  id: string;
  name: string;
  classLevel: string;
  initials: string;
  risk: "High Risk" | "At Risk" | "On Track";
  mastery: Record<SkillKey, number>;
};

const SKILLS: SkillKey[] = [
  "Number Sense",
  "Fractions",
  "Proportional Reasoning",
  "Inferencing",
  "Vocabulary",
];

function levelBg(v: number) {
  if (v <= 40) return "bg-skill-low";
  if (v <= 65) return "bg-skill-medium";
  return "bg-skill-high";
}

function riskBadge(risk: Learner["risk"]) {
  if (risk === "High Risk") return "bg-skill-low text-error border-error/30";
  if (risk === "At Risk") return "bg-skill-medium text-foreground border-warning/30";
  return "bg-skill-high text-success border-success/30";
}

export default function TeacherDashboardPage() {
  const { toast } = useToast();
  const teacher = useMemo(
    () => ({ name: "Mrs. Abena Mensah", school: "Kumasi Technical Institute" }),
    []
  );

  const learners: Learner[] = useMemo(
    () => [
      {
        id: "kofi-asante",
        name: "Derek Yendoh",
        classLevel: "JHS 3B",
        initials: "DY",
        risk: "High Risk",
        mastery: {
          "Number Sense": 68,
          Fractions: 28,
          "Proportional Reasoning": 34,
          Inferencing: 22,
          Vocabulary: 48,
        },
      },
      {
        id: "ama-boakye",
        name: "Khalida Ali",
        classLevel: "JHS 3B",
        initials: "KA",
        risk: "At Risk",
        mastery: {
          "Number Sense": 74,
          Fractions: 52,
          "Proportional Reasoning": 45,
          Inferencing: 41,
          Vocabulary: 60,
        },
      },
      {
        id: "kwame-owusu",
        name: "Jeron Torson",
        classLevel: "JHS 3B",
        initials: "JT",
        risk: "On Track",
        mastery: {
          "Number Sense": 82,
          Fractions: 71,
          "Proportional Reasoning": 67,
          Inferencing: 64,
          Vocabulary: 72,
        },
      },
      {
        id: "michael-menu",
        name: "Michael Menu",
        classLevel: "JHS 3B",
        initials: "MM",
        risk: "At Risk",
        mastery: {
          "Number Sense": 63,
          Fractions: 39,
          "Proportional Reasoning": 44,
          Inferencing: 55,
          Vocabulary: 46,
        },
      },
      {
        id: "yaw-mensah",
        name: "Yaw Mensah",
        classLevel: "JHS 3B",
        initials: "YM",
        risk: "On Track",
        mastery: {
          "Number Sense": 77,
          Fractions: 66,
          "Proportional Reasoning": 62,
          Inferencing: 70,
          Vocabulary: 58,
        },
      },
      {
        id: "efua-addo",
        name: "Efua Addo",
        classLevel: "JHS 3B",
        initials: "EA",
        risk: "High Risk",
        mastery: {
          "Number Sense": 58,
          Fractions: 31,
          "Proportional Reasoning": 36,
          Inferencing: 29,
          Vocabulary: 34,
        },
      },
      {
        id: "kojo-ampadu",
        name: "Kojo Ampadu",
        classLevel: "JHS 3B",
        initials: "KA",
        risk: "At Risk",
        mastery: {
          "Number Sense": 66,
          Fractions: 48,
          "Proportional Reasoning": 51,
          Inferencing: 39,
          Vocabulary: 43,
        },
      },
    ],
    []
  );

  const lastDiagnosticDate = "03 Mar 2026";
  const hasLearners = learners.length > 0;

  const [assignOpen, setAssignOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Record<string, boolean>>({});

  function toggleSelect(id: string) {
    setSelectedIds((s) => ({ ...s, [id]: !s[id] }));
  }

  function assign() {
    const count = Object.values(selectedIds).filter(Boolean).length;
    toast({
      title: "Diagnostic assigned",
      description:
        count > 0
          ? `Assigned to ${count} learner${count === 1 ? "" : "s"} in JHS 3B.`
          : "Assigned to the whole class (demo).",
      variant: "success",
    });
    setAssignOpen(false);
    setSelectedIds({});
  }

  return (
    <main className="min-h-[100svh]">
      <TopNav
        rightSlot={
          <>
            <div className="hidden text-right md:block">
              <p className="text-sm font-medium text-foreground">{teacher.name}</p>
              <p className="text-xs text-muted">{teacher.school}</p>
            </div>
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
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
                Class overview
              </p>
              <h1 className="mt-1 text-xl font-semibold tracking-tight text-foreground md:text-2xl">
                Class Overview — JHS 3B
              </h1>
              <p className="mt-1 text-sm text-muted">
                Last diagnostic: {lastDiagnosticDate}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button variant="secondary" asChild><Link href="/teacher/reports">Reports</Link></Button>
              <Button onClick={() => setAssignOpen(true)}>Assign Diagnostic</Button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-5">
            <Stat label="Learners Assessed" value="28" />
            <Stat label="Critical Numeracy Gaps" value="9" />
            <Stat label="Critical Literacy Gaps" value="11" />
            <Stat label="Average Mastery Score" value="58%" />
            <Stat label="Plans Pending Approval" value="6" />
          </div>

          <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_340px]">
            <Card className="p-5 md:p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                    Skill gap heatmap
                  </p>
                  <h2 className="mt-1 text-lg font-semibold text-foreground">
                    Micro-skill mastery by learner
                  </h2>
                </div>
                <span className="rounded-full bg-surface px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-muted">
                  Hover cells
                </span>
              </div>

              {hasLearners ? (
                <div className="mt-5 overflow-x-auto">
                  <div className="min-w-[720px]">
                    <div className="grid grid-cols-[220px_repeat(5,1fr)] gap-2 text-xs">
                      <div className="px-2 py-2 text-muted">Learner</div>
                      {SKILLS.map((s) => (
                        <div key={s} className="px-2 py-2 text-muted">
                          {s}
                        </div>
                      ))}
                    </div>

                    <div className="mt-2 space-y-2">
                      {learners.map((l) => (
                        <div
                          key={l.id}
                          className="grid grid-cols-[220px_repeat(5,1fr)] gap-2"
                        >
                          <Link
                            href={`/teacher/learner/${l.id}`}
                            className="flex items-center gap-3 rounded-2xl border border-border-subtle bg-surface px-3 py-2 text-sm transition-colors hover:border-border-strong"
                          >
                            <div className="grid h-8 w-8 place-items-center rounded-full bg-brand-soft text-xs font-semibold text-foreground">
                              {l.initials}
                            </div>
                            <div className="min-w-0">
                              <p className="truncate text-sm font-medium text-foreground">
                                {l.name}
                              </p>
                              <p className="text-xs text-muted">{l.classLevel}</p>
                            </div>
                          </Link>

                          {SKILLS.map((s) => {
                            const v = l.mastery[s];
                            return (
                              <div
                                key={s}
                                className={[
                                  "group relative rounded-2xl border border-border-subtle p-2",
                                  levelBg(v),
                                ].join(" ")}
                                title={`${l.name} · ${s} · ${v}%`}
                              >
                                <div className="flex h-full items-center justify-between">
                                  <span className="text-xs font-semibold text-foreground">
                                    {v}%
                                  </span>
                                  <span className="text-[0.7rem] text-muted">
                                    {v <= 40 ? "Needs focus" : v <= 65 ? "Developing" : "Strong"}
                                  </span>
                                </div>
                              <div className="pointer-events-none absolute left-2 top-full z-10 mt-2 hidden w-56 rounded-2xl border border-border-subtle bg-surface-elevated px-3 py-2 text-xs text-foreground shadow-md group-hover:block">
                                <p className="truncate font-semibold">{l.name}</p>
                                <p className="mt-0.5 truncate text-muted">
                                  {s}: <span className="font-medium text-foreground">{v}%</span>
                                </p>
                              </div>
                              </div>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mt-5 rounded-2xl border border-border-subtle bg-surface p-4 text-sm text-muted">
                  No diagnostic data for this class yet. Once learners complete their first
                  diagnostic, you&apos;ll see a heatmap of micro-skills here.
                </div>
              )}
            </Card>

            <Card className="p-5 md:p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                    Priority learners
                  </p>
                  <h2 className="mt-1 text-lg font-semibold text-foreground">
                    Who needs attention first
                  </h2>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                {learners.slice(0, 6).map((l) => (
                  <Link
                    key={l.id}
                    href={`/teacher/learner/${l.id}`}
                    className="block rounded-2xl border border-border-subtle bg-surface-elevated p-4 transition-all hover:-translate-y-[1px] hover:border-border-strong hover:shadow-md"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="grid h-9 w-9 place-items-center rounded-full bg-brand-soft text-xs font-semibold text-foreground">
                          {l.initials}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground">{l.name}</p>
                          <p className="text-xs text-muted">{l.classLevel}</p>
                        </div>
                      </div>
                      <span
                        className={[
                          "rounded-full border px-2.5 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.18em]",
                          riskBadge(l.risk),
                        ].join(" ")}
                      >
                        {l.risk}
                      </span>
                    </div>
                    <p className="mt-3 text-xs text-muted">
                      Gaps: Fractions · Inferencing · Proportional Reasoning
                    </p>
                  </Link>
                ))}
              </div>
            </Card>
          </div>

          <AnimatePresence>
            {assignOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 grid place-items-center bg-black/30 px-4"
              >
                <motion.div
                  initial={{ opacity: 0, y: 12, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.98 }}
                  transition={{ duration: 0.22, ease: "easeOut" }}
                  className="w-full max-w-lg rounded-3xl border border-border-subtle bg-surface-elevated p-5 shadow-xl md:p-6"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                        Assign diagnostic
                      </p>
                      <h3 className="mt-1 text-lg font-semibold text-foreground">
                        Choose learners (demo)
                      </h3>
                      <p className="mt-1 text-sm text-muted">
                        You can assign to specific learners or the whole class.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAssignOpen(false)}
                      className="rounded-full px-3 py-2 text-xs font-medium text-muted transition-colors hover:bg-surface hover:text-brand"
                    >
                      Close
                    </button>
                  </div>

                  <div className="mt-5 grid gap-2">
                    {learners.slice(0, 7).map((l) => (
                      <label
                        key={l.id}
                        className="flex cursor-pointer items-center justify-between gap-3 rounded-2xl border border-border-subtle bg-surface px-4 py-3"
                      >
                        <span className="flex items-center gap-3">
                          <span className="grid h-8 w-8 place-items-center rounded-full bg-brand-soft text-xs font-semibold text-foreground">
                            {l.initials}
                          </span>
                          <span className="text-sm font-medium text-foreground">
                            {l.name}
                          </span>
                        </span>
                        <input
                          type="checkbox"
                          checked={!!selectedIds[l.id]}
                          onChange={() => toggleSelect(l.id)}
                          className="h-4 w-4 accent-[#685aff]"
                        />
                      </label>
                    ))}
                  </div>

                  <div className="mt-5 flex flex-col gap-2 md:flex-row md:justify-end">
                    <Button variant="secondary" onClick={() => setAssignOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={assign}>Assign now</Button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>
      </div>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <Card className="p-4 md:p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
        {label}
      </p>
      <p className="mt-2 text-xl font-semibold text-foreground">{value}</p>
    </Card>
  );
}

