"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { TopNav } from "../../../components/layout/top-nav";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";

type Subject = "Numeracy" | "Literacy";

type Question = {
  id: string;
  subject: Subject;
  microSkill: string;
  text: string;
  options: { label: "A" | "B" | "C" | "D"; text: string }[];
  correctLabel: "A" | "B" | "C" | "D";
  explanation: string;
};

type AnswerRecord = {
  questionId: string;
  subject: Subject;
  microSkill: string;
  chosenLabel: "A" | "B" | "C" | "D";
  correctLabel: "A" | "B" | "C" | "D";
};

const QUESTIONS: Question[] = [
  {
    id: "num-fractions-1",
    subject: "Numeracy",
    microSkill: "Fractions",
    text: "Which fraction is larger: 3/4 or 5/8?",
    options: [
      { label: "A", text: "3/4" },
      { label: "B", text: "5/8" },
      { label: "C", text: "They are equal" },
      { label: "D", text: "Cannot be compared" },
    ],
    correctLabel: "A",
    explanation:
      "Convert to decimals or compare with a common denominator: 3/4 = 0.75, 5/8 = 0.625. So 3/4 is larger.",
  },
  {
    id: "num-proportion-1",
    subject: "Numeracy",
    microSkill: "Proportional Reasoning",
    text: "If 5 books cost GH₵35, how much do 8 books cost?",
    options: [
      { label: "A", text: "GH₵49" },
      { label: "B", text: "GH₵52" },
      { label: "C", text: "GH₵56" },
      { label: "D", text: "GH₵63" },
    ],
    correctLabel: "C",
    explanation:
      "Unit price is GH₵35 ÷ 5 = GH₵7 per book. Then 8 × GH₵7 = GH₵56.",
  },
  {
    id: "lit-inference-1",
    subject: "Literacy",
    microSkill: "Inferencing",
    text: "Ama walked in slowly, her eyes red and her bag dragging. What can we infer about Ama?",
    options: [
      { label: "A", text: "Ama is excited about school today." },
      { label: "B", text: "Ama is likely tired or has been crying." },
      { label: "C", text: "Ama forgot her bag at home." },
      { label: "D", text: "Ama is rushing to class quickly." },
    ],
    correctLabel: "B",
    explanation:
      "Red eyes and slow movement suggest she may be tired, unwell, or has been crying—not excited or rushing.",
  },
];

function subjectMeta(subject: Subject) {
  return subject === "Numeracy"
    ? { icon: "📐", colorClass: "text-numeracy", pillClass: "bg-surface" }
    : { icon: "📖", colorClass: "text-literacy", pillClass: "bg-surface" };
}

export default function DiagnosticAssessmentPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<"setup" | "inProgress">("setup");
  const [selectedSubjects, setSelectedSubjects] = useState<Subject[]>(["Numeracy", "Literacy"]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<null | "A" | "B" | "C" | "D">(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);

  const activeQuestions = useMemo(
    () => QUESTIONS.filter((q) => selectedSubjects.includes(q.subject)),
    [selectedSubjects],
  );

  const hasActiveQuestions = activeQuestions.length > 0;
  const total = hasActiveQuestions ? activeQuestions.length : QUESTIONS.length;
  const safeIndex = Math.min(Math.max(index, 0), Math.max(total - 1, 0));
  const q = hasActiveQuestions ? activeQuestions[safeIndex]! : QUESTIONS[safeIndex]!;

  const progressPct = useMemo(() => {
    const n = index + 1;
    return Math.round((n / total) * 100);
  }, [index, total]);

  const activeSection: Subject = q.subject;

  function choose(label: "A" | "B" | "C" | "D") {
    if (submitted) return;
    setSelected(label);
    setSubmitted(true);
    setAnswers((prev) => {
      const without = prev.filter((a) => a.questionId !== q.id);
      return [
        ...without,
        {
          questionId: q.id,
          subject: q.subject,
          microSkill: q.microSkill,
          chosenLabel: label,
          correctLabel: q.correctLabel,
        },
      ];
    });
  }

  async function next() {
    if (!submitted) return;
    if (index < total - 1) {
      setIndex((v) => v + 1);
      setSelected(null);
      setSubmitted(false);
      return;
    }

    // Finished all questions – compute diagnostic summary for results page
    setSubmitting(true);

    const totalAnswered = answers.length;
    const correctCount = answers.filter((a) => a.chosenLabel === a.correctLabel).length;
    const overall = totalAnswered ? Math.round((correctCount / totalAnswered) * 100) : 0;

    const buckets: Record<
      string,
      { subject: Subject; microSkill: string; correct: number; total: number }
    > = {};

    for (const a of answers) {
      const key = `${a.subject}::${a.microSkill}`;
      if (!buckets[key]) {
        buckets[key] = {
          subject: a.subject,
          microSkill: a.microSkill,
          correct: 0,
          total: 0,
        };
      }
      buckets[key].total += 1;
      if (a.chosenLabel === a.correctLabel) buckets[key].correct += 1;
    }

    const numeracy: { name: string; value: number }[] = [];
    const literacy: { name: string; value: number }[] = [];

    Object.values(buckets).forEach((b) => {
      const value = b.total ? Math.round((b.correct / b.total) * 100) : 0;
      const target = b.subject === "Numeracy" ? numeracy : literacy;
      target.push({ name: b.microSkill, value });
    });

    const allSkills = [
      ...numeracy.map((s) => ({ ...s, subject: "Numeracy" as Subject })),
      ...literacy.map((s) => ({ ...s, subject: "Literacy" as Subject })),
    ];

    allSkills.sort((a, b) => a.value - b.value);
    const priorityGaps = allSkills.slice(0, 3);

    const payload = {
      runAt: new Date().toISOString(),
      overall,
      numeracy,
      literacy,
      priorityGaps,
    };

    try {
      if (typeof window !== "undefined") {
        window.sessionStorage.setItem(
          "edgeai_diagnostic_result_v1",
          JSON.stringify(payload),
        );
      }
    } catch {
      // Non-fatal if storage is unavailable
    }

    setTimeout(() => router.push("/student/results"), 750);
  }

  const meta = subjectMeta(q.subject);

  return (
    <main className="min-h-[100svh]">
      <TopNav
        rightSlot={
          <Link
            href="/student/dashboard"
            className="rounded-full px-3 py-2 text-xs font-medium text-muted transition-colors hover:bg-surface hover:text-brand"
          >
            ← Dashboard
          </Link>
        }
      />

      <div className="mx-auto max-w-4xl px-4 pb-12 pt-6 md:px-6 md:pt-10">
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="space-y-5"
        >
          {phase === "setup" && (
            <Card className="relative overflow-hidden p-6 md:p-8">
              <div className="pointer-events-none absolute -left-10 -top-14 h-44 w-44 rounded-full bg-brand-soft blur-3xl" />
              <div className="relative grid gap-6 md:grid-cols-[minmax(0,1.6fr)_auto] md:items-center">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                    Diagnostic setup
                  </p>
                  <h1 className="mt-3 text-xl font-semibold text-foreground md:text-2xl">
                    What would you like to check today?
                  </h1>
                  <p className="mt-2 text-sm text-muted md:text-base">
                    Choose the areas you want to focus on. You can take Numeracy, Literacy, or both
                    together in one quick check.
                  </p>

                  <div className="mt-5 flex flex-wrap gap-3">
                    {(["Numeracy", "Literacy"] as Subject[]).map((subject) => {
                      const active = selectedSubjects.includes(subject);
                      return (
                        <button
                          key={subject}
                          type="button"
                          onClick={() =>
                            setSelectedSubjects((prev) =>
                              prev.includes(subject)
                                ? prev.filter((s) => s !== subject)
                                : [...prev, subject],
                            )
                          }
                          className={[
                            "inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold shadow-sm transition-colors",
                            active
                              ? "bg-brand-soft text-brand"
                              : "bg-surface text-muted hover:bg-surface-elevated",
                          ].join(" ")}
                        >
                          <span aria-hidden>{subject === "Numeracy" ? "📐" : "📖"}</span>
                          {subject}
                        </button>
                      );
                    })}
                  </div>

                  <p className="mt-4 text-xs text-muted">
                    This is not a test—just a quick map of where to help you most.
                  </p>
                </div>
                <div className="flex flex-col items-stretch justify-between gap-4 md:items-end">
                  <div className="hidden text-right text-xs text-muted md:block">
                    <p className="font-semibold uppercase tracking-[0.18em]">
                      Estimated time
                    </p>
                    <p className="mt-1 text-sm text-foreground">3–4 minutes</p>
                  </div>
                  <Button
                    className="w-full md:w-auto md:px-7 md:py-3 md:text-sm"
                    onClick={() => {
                      if (!selectedSubjects.length) return;
                      setPhase("inProgress");
                      setIndex(0);
                      setSelected(null);
                      setSubmitted(false);
                      setAnswers([]);
                    }}
                    disabled={!selectedSubjects.length}
                  >
                    Start assessment
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {phase === "inProgress" && hasActiveQuestions && (
            <>
              <Card className="relative overflow-hidden p-4 md:p-5">
                <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-brand-soft blur-3xl" />
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                      {activeSection} section
                    </p>
                    <p className="text-sm font-medium text-foreground">
                      Q{index + 1}/{total}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <SectionChip active={activeSection === "Numeracy"} label="Numeracy" />
                    <SectionChip active={activeSection === "Literacy"} label="Literacy" />
                  </div>
                </div>

                <div className="mt-4">
                  <div className="h-2 w-full rounded-full bg-surface">
                    <div
                      className="h-2 rounded-full bg-brand transition-all"
                      style={{ width: `${progressPct}%` }}
                      aria-label={`Progress ${progressPct}%`}
                    />
                  </div>
                  <div className="mt-2 flex justify-between text-xs text-muted">
                    <span>Progress</span>
                    <span>{progressPct}%</span>
                  </div>
                </div>
              </Card>

              <Card className="p-5 md:p-6">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${meta.pillClass} ${meta.colorClass}`}
                  >
                    <span aria-hidden>{meta.icon}</span>
                    {q.subject}
                  </span>
                  <span className="rounded-full bg-brand-soft px-3 py-1 text-xs font-medium text-brand">
                    {q.microSkill}
                  </span>
                </div>

                <h1 className="mt-4 text-balance text-lg font-semibold leading-snug text-foreground md:text-xl">
                  {q.text}
                </h1>

                <div className="mt-5 grid gap-3">
                  {q.options.map((opt) => {
                    const isSelected = selected === opt.label;
                    return (
                      <button
                        key={opt.label}
                        type="button"
                        onClick={() => choose(opt.label)}
                        className={[
                          "w-full rounded-2xl border px-4 py-3 text-left transition-all",
                          "bg-surface-elevated hover:bg-surface",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand",
                          submitted ? "cursor-default" : "cursor-pointer",
                          isSelected
                            ? "border-brand bg-brand-soft/40"
                            : "border-border-subtle hover:border-border-strong",
                        ].join(" ")}
                        aria-pressed={isSelected}
                        disabled={submitted}
                      >
                        <div className="flex items-start gap-3">
                          <span
                            className={[
                              "mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-full border text-xs font-semibold",
                              isSelected
                                ? "border-brand text-brand"
                                : "border-border-subtle text-muted",
                            ].join(" ")}
                          >
                            {opt.label}
                          </span>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-foreground">
                              {opt.text}
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-6 flex items-center justify-between gap-3">
                  <p className="text-xs text-muted">
                    Just do your best. We’ll show your learning map at the end.
                  </p>
                  <Button
                    onClick={next}
                    disabled={!submitted || submitting}
                    loading={submitting}
                  >
                    {index === total - 1 ? "Finish" : "Next Question"}
                  </Button>
                </div>
              </Card>
            </>
          )}

          {phase === "inProgress" && !hasActiveQuestions && (
            <Card className="p-5 md:p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                Diagnostic unavailable
              </p>
              <h1 className="mt-2 text-lg font-semibold text-foreground">
                We couldn&apos;t find questions for the selected areas.
              </h1>
              <p className="mt-1 text-sm text-muted">
                This can happen if a subject was added recently or questions are still being set up.
                Please go back and choose a different combination, or try again later.
              </p>
              <div className="mt-5 flex justify-end">
                <Button
                  type="button"
                  onClick={() => {
                    setPhase("setup");
                    setIndex(0);
                    setSelected(null);
                    setSubmitted(false);
                    setAnswers([]);
                  }}
                >
                  Back to setup
                </Button>
              </div>
            </Card>
          )}
        </motion.section>
      </div>
    </main>
  );
}

function SectionChip({ active, label }: { active: boolean; label: Subject }) {
  return (
    <span
      className={[
        "rounded-full px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.18em]",
        active ? "bg-brand-soft text-brand" : "bg-surface text-muted",
      ].join(" ")}
    >
      {label}
    </span>
  );
}

