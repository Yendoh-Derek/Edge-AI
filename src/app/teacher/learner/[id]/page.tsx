"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { TopNav } from "../../../../components/layout/top-nav";
import { Button } from "../../../../components/ui/button";
import { Card } from "../../../../components/ui/card";
import { useToast } from "../../../../components/ui/toast";
import { appendNotification, EdgeNotification } from "../../../lib/notifications";

type Skill = { name: string; value: number };

const numeracy: Skill[] = [
  { name: "Number Sense", value: 72 },
  { name: "Place Value", value: 65 },
  { name: "Fractions", value: 28 },
  { name: "Proportional Reasoning", value: 34 },
  { name: "Algebraic Manipulation", value: 41 },
];

const literacy: Skill[] = [
  { name: "Phonemic Awareness", value: 78 },
  { name: "Decoding", value: 70 },
  { name: "Reading Fluency", value: 55 },
  { name: "Vocabulary", value: 48 },
  { name: "Inferencing", value: 22 },
];

function band(value: number): "low" | "medium" | "high" {
  if (value <= 40) return "low";
  if (value <= 65) return "medium";
  return "high";
}

export default function LearnerProfilePage() {
  const { toast } = useToast();
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const learnerId = params.id;

  const learner = useMemo(() => {
    const lookup: Record<
      string,
      { name: string; initials: string; studentId: string; classLevel: string; risk: string }
    > = {
      "kofi-asante": {
        name: "Derek Yendoh",
        initials: "DY",
        studentId: "EA-JHS3B-014",
        classLevel: "JHS 3B",
        risk: "High Risk",
      },
      "ama-boakye": {
        name: "Khalida Ali",
        initials: "KA",
        studentId: "EA-JHS3B-007",
        classLevel: "JHS 3B",
        risk: "At Risk",
      },
      "kwame-owusu": {
        name: "Jeron Torson",
        initials: "JT",
        studentId: "EA-JHS3B-021",
        classLevel: "JHS 3B",
        risk: "On Track",
      },
    };
    return (
      lookup[learnerId] ?? {
        name: "Learner",
        initials: "L",
        studentId: "EA-UNKNOWN",
        classLevel: "JHS 3B",
        risk: "At Risk",
      }
    );
  }, [learnerId]);

  const lastDiagnosticDate = "03 Mar 2026";
  const [approving, setApproving] = useState(false);
  const [approved, setApproved] = useState(false);
  const [modifyOpen, setModifyOpen] = useState(false);
  const [planSessions, setPlanSessions] = useState<
    { session: string; skill: string; strategy: string; duration: string }[]
  >([
    {
      session: "Session 1",
      skill: "Inferencing",
      strategy: "Socratic questioning + short Ghanaian context passages",
      duration: "12–15 mins",
    },
    {
      session: "Session 2",
      skill: "Fractions",
      strategy: "Visual fraction bars + number line comparisons",
      duration: "15 mins",
    },
    {
      session: "Session 3",
      skill: "Proportional Reasoning",
      strategy: "Unit rate practice using real prices (GH₵) and markets",
      duration: "15–18 mins",
    },
  ]);
  const [planFromDiagnostic, setPlanFromDiagnostic] = useState(false);
  const [sessionChecklist, setSessionChecklist] = useState<Record<string, boolean>>({});
  const [note, setNote] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.sessionStorage.getItem("edgeai_teacher_plan_checklist_v1");
      if (!raw) return;
      const parsed = JSON.parse(raw) as Record<string, boolean>;
      setSessionChecklist(parsed);
    } catch {
      // ignore
    }
  }, []);

  function toggleSessionChecklist(id: string) {
    setSessionChecklist((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      if (typeof window !== "undefined") {
        try {
          window.sessionStorage.setItem("edgeai_teacher_plan_checklist_v1", JSON.stringify(next));
        } catch {
          // ignore
        }
      }
      return next;
    });
  }

  function approve() {
    setApproving(true);
    setTimeout(() => {
      setApproving(false);
      setApproved(true);
      toast({
        title: `Remedial plan approved and sent to ${learner.name}`,
        variant: "success",
      });
      // Push a notification for the learner in the demo storage
      const notification: EdgeNotification = {
        id: `lesson_plan_approved_${Date.now()}`,
        title: "Lesson plan approved by your teacher",
        body: "Open your Notifications page to review the outline and start your AI tutor session.",
        createdAt: new Date().toISOString(),
        read: false,
        link: "/student/notifications",
        type: "lessonPlan",
        meta: {
          learnerId: learner.studentId,
        },
      };
      appendNotification(notification);
    }, 650);
  }

  function handleSendNote() {
    const trimmed = note.trim();
    if (!trimmed) {
      toast({
        title: "Add a short note before sending.",
      });
      return;
    }

    const notification: EdgeNotification = {
      id: `teacher_note_${Date.now()}`,
      title: "Note from your teacher",
      body: trimmed,
      createdAt: new Date().toISOString(),
      read: false,
      link: "/student/notifications",
      type: "teacherNote",
      meta: {
        from: learner.name,
        learnerId: learner.studentId,
      },
    };

    appendNotification(notification);
    toast({
      title: `Note sent to ${learner.name}`,
      variant: "success",
    });
    setNote("");
  }

  useEffect(() => {
    try {
      if (typeof window === "undefined") return;
      const source = searchParams.get("source");
      if (source !== "diagnostic") return;
      const raw = window.sessionStorage.getItem("edgeai_latest_plan_for_kofi");
      if (!raw) return;
      const parsed = JSON.parse(raw) as {
        sessions?: { session: string; skill: string; strategy: string; duration: string }[];
      };
      if (!parsed.sessions || !parsed.sessions.length) return;
      setPlanSessions(parsed.sessions);
      setPlanFromDiagnostic(true);
      toast({
        title: "New AI plan prepared from latest diagnostic",
        description: "Review the sessions below, modify if needed, then approve for the learner.",
        variant: "success",
      });
    } catch {
      // ignore
    }
  }, [searchParams, toast]);

  return (
    <main className="min-h-[100svh]">
      <TopNav
        rightSlot={
          <>
            <Link
              href="/teacher/dashboard"
              className="rounded-full px-3 py-2 text-xs font-medium text-muted transition-colors hover:bg-surface hover:text-brand"
            >
              ← Class overview
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
          <Card className="relative overflow-hidden border border-border-subtle/60 bg-gradient-to-br from-brand-soft/50 via-surface to-surface-elevated p-5 shadow-sm/40 backdrop-blur-md md:p-6">
            <div className="pointer-events-none absolute -left-10 -top-12 h-40 w-40 rounded-full bg-brand-soft blur-3xl" />
            <div className="pointer-events-none absolute -right-10 bottom-0 h-32 w-32 rounded-full bg-warning/40 blur-3xl" />
            <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-start gap-4">
                <div className="grid h-12 w-12 place-items-center rounded-full bg-brand-soft text-sm font-semibold text-foreground">
                  {learner.initials}
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                    Learner profile
                  </p>
                  <h1 className="text-xl font-semibold tracking-tight text-foreground md:text-2xl">
                    {learner.name}
                  </h1>
                  <p className="text-sm text-muted">
                    Student ID: {learner.studentId} · {learner.classLevel} · Last diagnostic:{" "}
                    {lastDiagnosticDate}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-error/30 bg-skill-low px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-error">
                  {learner.risk}
                </span>
                <span className="rounded-full bg-surface px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-muted">
                  Needs support
                </span>
              </div>
            </div>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <SkillBars title="📐 Numeracy" skills={numeracy} />
            <SkillBars title="📖 Literacy" skills={literacy} />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="p-5 md:p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                Detected error patterns
              </p>
              <h2 className="mt-1 text-lg font-semibold text-foreground">
                Misconceptions and habits
              </h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {[
                  "Fraction inversion error",
                  "Literal comprehension bias",
                  "Rapid guessing pattern",
                  "Skipping explanation text",
                ].map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-border-subtle bg-surface px-3 py-1 text-xs font-medium text-foreground"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </Card>

            <Card className="p-5 md:p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                Behavioural metadata
              </p>
              <h2 className="mt-1 text-lg font-semibold text-foreground">
                How the learner responds
              </h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <MetaStat label="Time per question (avg)" value="41s" />
                <MetaStat label="Hesitation rate" value="High" />
                <MetaStat label="Revision behaviour" value="Low" />
                <MetaStat label="Confidence score" value="0.38" />
              </div>
            </Card>
          </div>

          <Card className="p-5 md:p-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                  AI-generated remedial plan
                </p>
                <h2 className="mt-1 text-lg font-semibold text-foreground">
                  Structured sessions (ready for your approval)
                </h2>
                <p className="mt-1 text-sm text-muted">
                  Status:{" "}
                  <span className="rounded-full border px-2.5 py-1 text-xs font-semibold">
                    {approved ? "Sent to learner (this session)" : "Pending your approval"}
                  </span>
                </p>
                {planFromDiagnostic && (
                  <p className="mt-1 text-xs text-muted">
                    Plan prepared from the learner&apos;s latest diagnostic results.
                  </p>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  variant="secondary"
                  onClick={() => setModifyOpen(true)}
                  disabled={approving}
                >
                  ✏️ Modify Plan
                </Button>
                <Button onClick={approve} loading={approving} disabled={approving || approved}>
                  {approved ? "Approved" : "✅ Approve & Send to Learner"}
                </Button>
              </div>
            </div>

            {planSessions.length > 0 ? (
              <div className="mt-5 space-y-3">
                {planSessions.map((s) => {
                  const id = s.session || `${s.skill}-${s.duration}`;
                  const checked = !!sessionChecklist[id];
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => toggleSessionChecklist(id)}
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
            ) : (
              <div className="mt-5 rounded-2xl border border-border-subtle bg-surface p-4 text-sm text-muted">
                No AI-generated sessions are available yet. Generate a plan from a recent diagnostic
                or create one manually.
              </div>
            )}

            <div className="mt-6 rounded-2xl border border-border-subtle bg-surface p-4 space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                Notes to learner
              </p>
              <p className="text-xs text-muted">
                Write a short message to this learner. It will appear in their notifications.
              </p>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="mt-2 h-24 w-full rounded-xl border border-border-subtle bg-surface-elevated px-3 py-2 text-sm text-foreground outline-none ring-offset-2 ring-offset-surface focus:border-brand focus:ring-2 focus:ring-brand"
                placeholder="Eg. Start with the reading passage, then move slowly through the corrections step."
              />
              <div className="flex justify-end">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={handleSendNote}
                  disabled={!note.trim()}
                >
                  Send note to learner
                </Button>
              </div>
            </div>
          </Card>

          {modifyOpen && (
            <div className="rounded-2xl border border-border-subtle bg-surface p-4 text-sm text-muted">
              Plan editor (demo): In a full build, this would open an editable plan
              interface. For the prototype, it’s a placeholder.
            </div>
          )}
        </motion.section>
      </div>
    </main>
  );
}

function SkillBars({ title, skills }: { title: string; skills: Skill[] }) {
  return (
    <Card className="p-5 md:p-6">
      <h2 className="text-sm font-semibold text-foreground">{title}</h2>
      <div className="mt-4 space-y-3">
        {skills.map((s) => (
          <div key={s.name} className="space-y-1">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium text-foreground">{s.name}</p>
              <span
                className={[
                  "rounded-full border px-2.5 py-1 text-xs font-semibold",
                  band(s.value) === "high"
                    ? "border-success/30 bg-skill-high text-success"
                    : band(s.value) === "medium"
                      ? "border-warning/30 bg-skill-medium text-foreground"
                      : "border-error/30 bg-skill-low text-error",
                ].join(" ")}
              >
                {s.value}%
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-surface">
              <div
                className={[
                  "h-2 rounded-full transition-all",
                  band(s.value) === "high"
                    ? "bg-success"
                    : band(s.value) === "medium"
                      ? "bg-warning"
                      : "bg-error",
                ].join(" ")}
                style={{ width: `${s.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function MetaStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border-subtle bg-surface-elevated p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
        {label}
      </p>
      <p className="mt-2 text-base font-semibold text-foreground">{value}</p>
    </div>
  );
}

function PlanItem({
  session,
  skill,
  strategy,
  duration,
}: {
  session: string;
  skill: string;
  strategy: string;
  duration: string;
}) {
  return (
    <div className="rounded-2xl border border-border-subtle bg-surface-elevated p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
        {session}
      </p>
      <p className="mt-2 text-sm font-semibold text-foreground">{skill}</p>
      <p className="mt-1 text-xs leading-relaxed text-muted">{strategy}</p>
      <p className="mt-3 inline-flex rounded-full bg-surface px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-muted">
        {duration}
      </p>
    </div>
  );
}

