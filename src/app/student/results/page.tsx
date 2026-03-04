"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { TopNav } from "../../../components/layout/top-nav";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";
import { useToast } from "../../../components/ui/toast";
import { loadNotifications, saveNotifications } from "../../lib/notifications";

type Skill = { name: string; value: number };

type PriorityGap = {
  name: string;
  subject: "Numeracy" | "Literacy";
  value: number;
};

type DiagnosticPayload = {
  runAt: string;
  overall: number;
  numeracy: Skill[];
  literacy: Skill[];
  priorityGaps?: PriorityGap[];
};

const FALLBACK_NUMERACY: Skill[] = [
  { name: "Number Sense", value: 72 },
  { name: "Place Value", value: 65 },
  { name: "Fractions", value: 28 },
  { name: "Proportional Reasoning", value: 34 },
  { name: "Algebraic Manipulation", value: 41 },
];

const FALLBACK_LITERACY: Skill[] = [
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

function bandClasses(value: number) {
  const b = band(value);
  if (b === "high") return "bg-skill-high text-success border-success/30";
  if (b === "medium") return "bg-skill-medium text-foreground border-warning/30";
  return "bg-skill-low text-error border-error/30";
}

const MICRO_SKILL_INFO: Record<
  string,
  {
    description: string;
    strategies: string[];
  }
> = {
  Fractions: {
    description:
      "Understanding parts of a whole and comparing, ordering, and operating with fractional quantities.",
    strategies: [
      "Use fraction bars or everyday objects (e.g. fruit, bread) to show equal parts.",
      "Ask learners to shade or colour fractions of familiar shapes.",
      "Compare fractions using number lines instead of only rules.",
      "Link fractions to real prices and measurements in the local context.",
    ],
  },
  Inferencing: {
    description:
      "Using clues in the text and background knowledge to figure out ideas that are not directly stated.",
    strategies: [
      "Pause while reading and ask: “What can we guess about this character or situation?”",
      "Highlight key words that give emotional or situational clues (e.g. ‘slowly’, ‘eyes red’).",
      "Practise short Ghanaian-context stories and discuss what is implied.",
      "Model thinking aloud: show your own reasoning steps when making an inference.",
    ],
  },
};

export default function StudentResultsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [overall, setOverall] = useState<number>(54);
  const [numeracy, setNumeracy] = useState<Skill[]>(FALLBACK_NUMERACY);
  const [literacy, setLiteracy] = useState<Skill[]>(FALLBACK_LITERACY);
  const [priorityGaps, setPriorityGaps] = useState<PriorityGap[] | null>(null);
  const [runAt, setRunAt] = useState<string | null>(null);
  const [usingFallback, setUsingFallback] = useState(true);
  const [selectedSkill, setSelectedSkill] = useState<{
    name: string;
    subject: "Numeracy" | "Literacy";
    value: number;
  } | null>(null);
  const [tutorCompleted, setTutorCompleted] = useState<boolean>(false);
  const [lessonPlanLoading, setLessonPlanLoading] = useState(false);
  const [lessonPlanGenerated, setLessonPlanGenerated] = useState(false);
  const [notifications, setNotifications] = useState(loadNotifications());

  useEffect(() => {
    try {
      if (typeof window === "undefined") return;
      const raw = window.sessionStorage.getItem("edgeai_diagnostic_result_v1");
      if (!raw) return;
      const parsed = JSON.parse(raw) as DiagnosticPayload;
      if (!parsed) return;

      setOverall(parsed.overall ?? 0);
      setNumeracy(parsed.numeracy?.length ? parsed.numeracy : FALLBACK_NUMERACY);
      setLiteracy(parsed.literacy?.length ? parsed.literacy : FALLBACK_LITERACY);
      setRunAt(parsed.runAt ?? null);
      setPriorityGaps(parsed.priorityGaps ?? null);
      setUsingFallback(false);
    } catch {
      // fall back silently
    }
  }, []);

  // Apply tutor session improvements & load notifications
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const statusRaw = window.sessionStorage.getItem(
        "edgeai_tutor_session_status_v1",
      );
      if (statusRaw) {
        const status = JSON.parse(statusRaw) as {
          completed?: boolean;
          literacyDelta?: Record<string, number>;
        };
        if (status.completed) {
          setTutorCompleted(true);
        }
        if (status.literacyDelta) {
          setLiteracy((prev) =>
            prev.map((s) => {
              const delta = status.literacyDelta?.[s.name];
              return delta
                ? { ...s, value: Math.min(100, s.value + delta) }
                : s;
            }),
          );
        }
      }

      const initial = loadNotifications();
      setNotifications(initial);
    } catch {
      // ignore
    }
  }, []);

  const answeredSkillCount = useMemo(
    () => (usingFallback ? 0 : numeracy.length + literacy.length),
    [usingFallback, numeracy.length, literacy.length],
  );
  const isEarlyEstimate = answeredSkillCount > 0 && answeredSkillCount <= 2;

  const formattedRunAt = useMemo(() => {
    if (!runAt) return null;
    try {
      const d = new Date(runAt);
      return d.toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      });
    } catch {
      return null;
    }
  }, [runAt]);

  function handlePreparePlan() {
    const allSkills: PriorityGap[] = [
      ...numeracy.map((s) => ({ ...s, subject: "Numeracy" as const })),
      ...literacy.map((s) => ({ ...s, subject: "Literacy" as const })),
    ].sort((a, b) => a.value - b.value);

    if (!allSkills.length) {
      toast({
        title: "No data yet",
        description: "Complete a quick diagnostic first so we know what to focus on.",
        variant: "success",
      });
      return;
    }

    const numeracySkills = allSkills.filter((s) => s.subject === "Numeracy");
    const literacySkills = allSkills.filter((s) => s.subject === "Literacy");

    let focus: PriorityGap[] = [];
    if (numeracySkills.length && literacySkills.length) {
      focus.push(numeracySkills[0]!, literacySkills[0]!);
      const remaining = allSkills.filter(
        (s) =>
          !focus.some((f) => f.name === s.name && f.subject === s.subject),
      );
      if (remaining[0]) focus.push(remaining[0]);
    } else {
      focus = allSkills.slice(0, 3);
    }

    const allHigh = focus.every((s) => band(s.value) === "high");

    const plan = {
      generatedAt: new Date().toISOString(),
      learnerId: "kofi-asante",
      sessions: focus.map((gap, idx) => ({
        session: `Session ${idx + 1}`,
        skill: gap.name,
        strategy:
          allHigh
            ? "Short consolidation activities to keep this skill fresh using mixed practice."
            : gap.name === "Fractions"
              ? "Visual fraction bars and number-line comparisons using familiar contexts."
              : gap.name === "Inferencing"
                ? "Short passages from Ghanaian life with guided ‘why do you think…?’ questions."
                : "Targeted practice tasks and discussion prompts linked to classroom content.",
        duration: idx === 0 ? "12–15 mins" : "15–18 mins",
      })),
    };

    try {
      if (typeof window !== "undefined") {
        window.sessionStorage.setItem(
          "edgeai_latest_plan_for_kofi",
          JSON.stringify(plan),
        );
        // Reset any previous checklist progress when a fresh plan is generated
        window.sessionStorage.removeItem("edgeai_lesson_plan_progress_v1");
        window.sessionStorage.removeItem("edgeai_teacher_plan_checklist_v1");
      }
    } catch {
      toast({
        title: "Couldn’t save plan (demo)",
        description:
          "We’ll still generate the plan, but it may not appear for your teacher in this demo.",
      });
    }

    setLessonPlanLoading(true);
    setLessonPlanGenerated(false);
    setTimeout(() => {
      setLessonPlanLoading(false);
      setLessonPlanGenerated(true);
      toast({
        title: "Lesson plan generated",
        description:
          "Your plan has been sent to your teacher for review and approval.",
        variant: "success",
      });
    }, 1400);
  }

  return (
    <main className="min-h-[100svh]">
      <TopNav
        rightSlot={
          <div className="flex items-center gap-2">
            <Link
              href="/student/dashboard"
              className="rounded-full px-3 py-2 text-xs font-medium text-muted transition-colors hover:bg-surface hover:text-brand"
            >
              ← Dashboard
            </Link>
          </div>
        }
      />

      <div className="mx-auto max-w-6xl px-4 pb-12 pt-6 md:px-6 md:pt-8">
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="space-y-6"
        >
          {usingFallback && (
            <div className="rounded-2xl border border-warning/30 bg-skill-medium px-4 py-3 text-xs text-foreground">
              Showing sample data – complete a diagnostic to see your own skill map.
            </div>
          )}

          <Card className="p-5 md:p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
                  Status
                </p>
                <h1 className="mt-1 text-xl font-semibold tracking-tight text-foreground md:text-2xl">
                  Skill Gap Profile
                </h1>
                <p className="mt-1 text-sm text-muted">
                  A clear map of what you’ve mastered—and what to focus on next.
                </p>
                {isEarlyEstimate && (
                  <p className="mt-1 text-xs text-muted">
                    Early estimate based on a small number of questions. Complete more items for a
                    stronger picture.
                  </p>
                )}
                {formattedRunAt && (
                  <p className="mt-1 text-xs text-muted">
                    Based on your latest diagnostic run: {formattedRunAt}
                  </p>
                )}
                {tutorCompleted && (
                  <p className="mt-1 text-xs font-semibold text-brand">
                    Latest AI tutor session completed – literacy skills updated.
                  </p>
                )}
              </div>
              <ProgressRing value={overall} label="Overall mastery" />
            </div>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <SkillSection
              title="📐 Numeracy micro-skills"
              skills={numeracy}
              subject="Numeracy"
              onSelectSkill={setSelectedSkill}
              selectedName={selectedSkill?.name}
            />
            <SkillSection
              title="📖 Literacy micro-skills"
              skills={literacy}
              subject="Literacy"
              onSelectSkill={setSelectedSkill}
              selectedName={selectedSkill?.name}
            />
          </div>

          {selectedSkill && (
            <Card className="p-5 md:p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                Micro-skill insight
              </p>
              <h2 className="mt-1 text-lg font-semibold text-foreground">
                {selectedSkill.name} ({selectedSkill.subject})
              </h2>
              <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                What this measures
              </p>
              <p className="mt-1 text-sm text-foreground">
                {MICRO_SKILL_INFO[selectedSkill.name]?.description ??
                  "This micro-skill captures a focused aspect of the learner’s numeracy or literacy performance."}
              </p>
              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                What we observed
              </p>
              <p className="mt-1 text-sm text-foreground">
                Current estimate:{" "}
                <span className="font-semibold">
                  {selectedSkill.value}% mastery ({band(selectedSkill.value)} range)
                </span>
                . Treat this as a starting point, not a label.
              </p>
              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                How to improve
              </p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-foreground">
                {(MICRO_SKILL_INFO[selectedSkill.name]?.strategies ??
                  ["Use short, frequent practice activities rather than one long block.", "Link practice tasks to familiar, real-world situations.", "Give the learner time to explain their thinking out loud before correcting."]).map(
                  (tip) => (
                    <li key={tip}>{tip}</li>
                  ),
                )}
              </ul>
              <button
                type="button"
                onClick={() => setSelectedSkill(null)}
                className="mt-4 text-xs font-semibold text-brand underline-offset-2 hover:underline"
              >
                Close insight
              </button>
            </Card>
          )}

          <Card className="p-5 md:p-6">
            <div className="flex flex-col items-center gap-4 text-center md:flex-row md:justify-between md:text-left">
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
                  Next step
                </p>
                <h3 className="text-lg font-semibold text-foreground">
                  Generate your lesson plan
                </h3>
                <p className="text-sm text-muted">
                  One click to create a short, focused plan for your teacher to review.
                </p>
              </div>
              <div className="flex flex-col items-center gap-2 md:items-end">
                <Button
                  onClick={handlePreparePlan}
                  className="w-full px-8 py-3 text-sm font-semibold md:w-auto"
                  disabled={lessonPlanLoading}
                  loading={lessonPlanLoading}
                >
                  {lessonPlanLoading ? "Generating…" : "Generate lesson plan"}
                </Button>
                {lessonPlanGenerated && (
                  <p className="text-xs text-brand">
                    Plan generated and sent to your teacher for approval.
                  </p>
                )}
              </div>
            </div>
          </Card>

          <Card className="p-5 md:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                  Notifications
                </p>
                <h2 className="mt-1 text-lg font-semibold text-foreground">
                  Updates from your teacher and tutor
                </h2>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-muted hover:text-brand"
                onClick={() => router.push("/student/notifications")}
              >
                View all
              </Button>
            </div>
            <div className="mt-4 space-y-2 text-sm">
              {notifications.length === 0 && (
                <p className="text-xs text-muted">
                  You don’t have any notifications yet. When your teacher approves a lesson plan,
                  it will appear here.
                </p>
              )}
              {notifications.map((n) => (
                <button
                  key={n.id}
                  type="button"
                  onClick={() => {
                    if (typeof window !== "undefined") {
                      try {
                        const updated = notifications.map((item) =>
                          item.id === n.id ? { ...item, read: true } : item,
                        );
                        saveNotifications(updated);
                        setNotifications(updated);
                      } catch {
                        // ignore
                      }
                    }
                    if (n.link) router.push(n.link);
                  }}
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
                  </div>
                  {!n.read && (
                    <span className="mt-1 h-2 w-2 rounded-full bg-brand" aria-hidden />
                  )}
                </button>
              ))}
            </div>
          </Card>
        </motion.section>
      </div>
    </main>
  );
}

function SkillSection({
  title,
  skills,
  subject,
  onSelectSkill,
  selectedName,
}: {
  title: string;
  skills: Skill[];
  subject: "Numeracy" | "Literacy";
  onSelectSkill: (skill: { name: string; subject: "Numeracy" | "Literacy"; value: number }) => void;
  selectedName?: string | null;
}) {
  return (
    <Card className="p-5 md:p-6">
      <h2 className="text-sm font-semibold text-foreground">{title}</h2>
      <div className="mt-4 space-y-3">
        {skills.map((s) => (
          <button
            key={s.name}
            type="button"
            onClick={() =>
              onSelectSkill({
                name: s.name,
                subject,
                value: s.value,
              })
            }
            className={[
              "w-full text-left",
              "rounded-2xl border px-3 py-2 transition-colors",
              selectedName === s.name
                ? "border-brand bg-brand-soft/30"
                : "border-border-subtle bg-surface hover:border-border-strong hover:bg-surface-elevated",
            ].join(" ")}
            aria-label={`View insight for ${s.name}`}
          >
            <div className="space-y-1">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium text-foreground">{s.name}</p>
                <span
                  className={[
                    "rounded-full border px-2.5 py-1 text-xs font-semibold",
                    bandClasses(s.value),
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
          </button>
        ))}
      </div>
    </Card>
  );
}

function GapRow({
  name,
  subject,
  misconception,
  severity,
}: {
  name: string;
  subject: "Numeracy" | "Literacy";
  misconception: string;
  severity: "High" | "At Risk" | "On Track";
}) {
  const sev =
    severity === "High"
      ? "bg-skill-low text-error border-error/30"
      : severity === "At Risk"
        ? "bg-skill-medium text-foreground border-warning/30"
        : "bg-skill-high text-success border-success/30";

  const sub =
    subject === "Numeracy"
      ? "text-numeracy bg-surface"
      : "text-literacy bg-surface";

  return (
    <div className="rounded-2xl border border-border-subtle bg-surface-elevated p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-[200px]">
          <p className="text-sm font-semibold text-foreground">{name}</p>
          <p className="mt-1 text-xs text-muted">{misconception}</p>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`rounded-full px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.18em] ${sub}`}
          >
            {subject}
          </span>
          <span
            className={`rounded-full border px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.18em] ${sev}`}
          >
            {severity}
          </span>
        </div>
      </div>
    </div>
  );
}

function ProgressRing({ value, label }: { value: number; label: string }) {
  const r = 34;
  const c = 2 * Math.PI * r;
  const dash = (value / 100) * c;

  return (
    <div className="flex items-center gap-4">
      <div className="relative h-20 w-20">
        <svg viewBox="0 0 80 80" className="h-20 w-20">
          <circle
            cx="40"
            cy="40"
            r={r}
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            className="text-surface"
          />
          <circle
            cx="40"
            cy="40"
            r={r}
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            strokeDasharray={`${dash} ${c - dash}`}
            strokeLinecap="round"
            className="text-brand"
            transform="rotate(-90 40 40)"
          />
        </svg>
        <div className="absolute inset-0 grid place-items-center">
          <p className="text-base font-semibold text-foreground">{value}%</p>
        </div>
      </div>
      <div className="hidden md:block">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
          {label}
        </p>
        <p className="mt-1 text-sm text-muted">
          Strong start—let’s raise the lowest bars first.
        </p>
      </div>
    </div>
  );
}

