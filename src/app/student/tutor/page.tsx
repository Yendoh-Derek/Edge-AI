"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { TopNav } from "../../../components/layout/top-nav";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";

type Turn = {
  role: "tutor" | "student";
  text: string;
  board:
    | {
        type: "slide";
        id?: "intro" | "concept" | "passage" | "corrections" | "practice";
        title?: string;
        points?: string[];
      }
    | {
        type: "passage";
        id: "ghanaIndependence";
      };
};

type SttStatus = "idle" | "speaking";
type MicStatus = "idle" | "listening" | "processing";
type SessionState = "idle" | "running" | "paused";

const SLIDES: Record<
  NonNullable<Extract<Turn["board"], { type: "slide" }>["id"]>,
  {
    title: string;
    bullets: string[];
    exampleLines?: string[];
  }
> = {
  intro: {
    title: "Sentence Structure & Coherence",
    bullets: [
      "Identify subject & predicate",
      "Spot incoherent sentences",
      "Rewrite weak sentences clearly",
    ],
  },
  concept: {
    title: "What Makes a Sentence Complete?",
    bullets: [
      "Every sentence needs a subject (who or what)",
      "Every sentence needs a predicate (what they do or are)",
      "Subject + predicate work together to form a complete idea",
    ],
    exampleLines: [
      '"Kwame Nkrumah" → subject',
      '"led Ghana to independence." → predicate',
    ],
  },
  passage: {
    title: "Ghana’s Independence – Reading",
    bullets: [
      "Read the passage about Ghana’s independence.",
      "Look for sentences that feel unfinished or confusing.",
      "We will fix the problem sentences together.",
    ],
  },
  corrections: {
    title: "Fixing Problem Sentences",
    bullets: [
      "Add missing subjects or predicates.",
      "Replace incomplete or vague phrases.",
      "Untangle long, jumbled sentences.",
    ],
    exampleLines: [
      "Kwame Nkrumah declared independence at the Old Polo Grounds in Accra.",
      "The people were very joyful.",
      "Ghana became the first independent country in sub-Saharan Africa.",
    ],
  },
  practice: {
    title: "Your Turn – Rewrite",
    bullets: [
      "Find the subject in the messy sentence.",
      "Decide clearly what the subject did.",
      "Put the ideas in a clear, natural order.",
    ],
    exampleLines: ['"Nkrumah gave the people of Ghana freedom on 6th March, 1957."'],
  },
};

const PASSAGES = {
  ghanaIndependence: {
    title: "Ghana’s Independence – Spot the Problems",
    paragraphs: [
      'Ghana gained independence on the 6th of March, 1957. Declared by Kwame Nkrumah at the Old Polo Grounds in Accra.',
      "The people were very.",
      "Ghana was the first country in sub-Saharan Africa independent became from colonial rule by the British who had controlled it for many years before then.",
    ],
    highlights: [
      "Declared by Kwame Nkrumah at the Old Polo Grounds in Accra.",
      "The people were very.",
      "independent became from colonial rule by the British who had controlled it for many years before then.",
    ],
  },
} as const;

type StepConfig = {
  name: string;
  board: Turn["board"];
  audio: string;
};

const STEPS: StepConfig[] = [
  {
    name: "Session opens",
    board: { type: "slide", id: "intro" },
    audio: "audio_01",
  },
  {
    name: "Concept explained",
    board: { type: "slide", id: "concept" },
    audio: "audio_02",
  },
  {
    name: "Passage shown",
    board: { type: "passage", id: "ghanaIndependence" },
    audio: "audio_03",
  },
  {
    name: "Student responds",
    board: { type: "passage", id: "ghanaIndependence" },
    audio: "audio_04",
  },
  {
    name: "Corrections shown",
    board: { type: "slide", id: "corrections" },
    audio: "audio_05",
  },
  {
    name: "Practice given",
    board: { type: "slide", id: "practice" },
    audio: "audio_06",
  },
  {
    name: "Session closes",
    board: { type: "slide", id: "practice" },
    audio: "audio_07",
  },
];

export default function TutorSessionPage() {
  const student = useMemo(() => ({ name: "Derek Yendoh" }), []);
  const [sessionState, setSessionState] = useState<SessionState>("idle");
  const [input, setInput] = useState("");
  const [stt, setStt] = useState<SttStatus>("idle");
  const [micStatus, setMicStatus] = useState<MicStatus>("idle");
  const [isPortrait, setIsPortrait] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [sessionCompleted, setSessionCompleted] = useState(false);
  const totalSteps = STEPS.length;
  const currentStepNumber = stepIndex + 1;
  const progressPct = sessionCompleted ? 100 : Math.round((stepIndex / totalSteps) * 100);
  const currentStep = STEPS[stepIndex] ?? STEPS[0];
  const board = currentStep.board;
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!audioRef.current) return;
    if (sessionState !== "running") {
      audioRef.current.pause();
      return;
    }

    const src = `/audio/${currentStep.audio}.mp3`;
    if (audioRef.current.src.endsWith(src)) {
      // If already set to this src, just try to play
      audioRef.current
        .play()
        .then(() => setStt("speaking"))
        .catch(() => {
          // Autoplay might be blocked; fall back to idle
          setStt("idle");
        });
      return;
    }

    audioRef.current.src = src;
    audioRef.current
      .play()
      .then(() => setStt("speaking"))
      .catch(() => {
        setStt("idle");
      });
  }, [currentStep.audio, sessionState]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mql = window.matchMedia("(orientation: portrait)");
    const update = () => setIsPortrait(mql.matches || window.innerHeight > window.innerWidth);
    update();
    mql.addEventListener("change", update);
    window.addEventListener("resize", update);
    return () => {
      mql.removeEventListener("change", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  function advanceStep() {
    setStepIndex((prev) => (prev < STEPS.length - 1 ? prev + 1 : prev));
  }

  function handleSend() {
    if (sessionState !== "running") return;
    if (!input.trim() || micStatus !== "idle") return;
    setInput("");
    // Stub: process learner text without advancing tutor steps
  }

  function toggleMic() {
    if (sessionState !== "running") return;
    if (micStatus === "idle") {
      setMicStatus("listening");
      setTimeout(() => setMicStatus("processing"), 900);
      setTimeout(() => {
        setMicStatus("idle");
      }, 1600);
      return;
    }
    setMicStatus("idle");
  }

  function startSession() {
    if (sessionState === "running") return;
    setSessionState("running");
    setStepIndex(0);
    setStt("idle");
  }

  function pauseSession() {
    if (sessionState !== "running") return;
    setSessionState("paused");
    setStt("idle");
    if (audioRef.current) {
      audioRef.current.pause();
    }
  }

  function retakeSession() {
    setSessionCompleted(false);
    setStt("idle");
    setStepIndex(0);
    setSessionState("running");
  }

  return (
    <main className="min-h-[100svh]">
      <TopNav
        rightSlot={
          <>
            <div className="hidden text-right md:block">
              <p className="text-sm font-medium text-foreground">{student.name}</p>
              <p className="text-xs text-muted">AI tutor session</p>
            </div>
            <Link
              href="/student/dashboard"
              className="rounded-full px-3 py-2 text-xs font-medium text-muted transition-colors hover:bg-surface hover:text-brand"
            >
              ← Dashboard
            </Link>
          </>
        }
      />

      <div className="mx-auto max-w-6xl px-4 pb-28 pt-6 md:px-6 md:pb-12 md:pt-8">
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="space-y-4"
        >
          <div
            className={
              isPortrait
                ? "grid gap-4"
                : "grid gap-4 md:grid-cols-[280px_minmax(0,1fr)_220px]"
            }
          >
            {!isPortrait && <AvatarPanel stt={stt} />}
            <Whiteboard board={board} stt={stt} />
            {!isPortrait && (
              <LessonOutline
                currentStep={
                  currentStepNumber <= 1
                    ? 1
                    : currentStepNumber === 2
                      ? 2
                      : currentStepNumber <= 4
                        ? 3
                        : currentStepNumber === 5
                          ? 4
                          : 5
                }
                totalSteps={5}
              />
            )}
          </div>

          <Card className="border-border-subtle/80 bg-surface-elevated p-4 md:p-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                  Lesson run
                </p>
                <p className="text-sm font-medium text-foreground">
                  Step {currentStepNumber} of {totalSteps}
                </p>
                <div className="inline-flex items-center gap-2 rounded-full bg-surface px-2 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-muted">
                  <span
                    className={[
                      "h-2 w-2 rounded-full",
                      sessionState === "running"
                        ? "bg-brand"
                        : sessionState === "paused"
                          ? "bg-warning"
                          : "bg-border-subtle",
                    ].join(" ")}
                  />
                  <span>
                    {sessionState === "running"
                      ? "Live"
                      : sessionState === "paused"
                        ? "Paused"
                        : "Ready"}
                  </span>
                </div>
              </div>
              <div className="w-full md:w-[320px]">
                <div className="h-2 w-full overflow-hidden rounded-full bg-surface">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-brand to-brand/60 transition-all"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
                <div className="mt-2 flex items-center justify-between text-xs text-muted">
                  <span>Lesson progress</span>
                  <span className="font-semibold text-foreground">{progressPct}%</span>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2 md:justify-end">
                {sessionCompleted ? (
                  <>
                    <Button
                      type="button"
                      variant="primary"
                      onClick={retakeSession}
                    >
                      Retake session
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      asChild
                    >
                      <Link href="/student/dashboard">Back to progress</Link>
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      type="button"
                      variant="primary"
                      onClick={startSession}
                      disabled={sessionState === "running"}
                    >
                      Start session
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={pauseSession}
                      disabled={sessionState !== "running"}
                    >
                      Pause session
                    </Button>
                  </>
                )}
              </div>
            </div>
          </Card>

          {sessionCompleted && (
            <Link
              href="/student/dashboard"
              className="group block cursor-pointer rounded-2xl outline-none transition-transform hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-surface-elevated"
              aria-label="Session complete – go to your Progress dashboard"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="relative overflow-hidden rounded-2xl border-2 border-success/60 bg-gradient-to-br from-brand-soft/70 via-surface to-success/10 p-5 shadow-lg shadow-brand/10 md:p-6"
              >
                <motion.div
                  className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-success/20 blur-2xl"
                  animate={{ opacity: [0.4, 0.7, 0.4], scale: [1, 1.1, 1] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                  className="pointer-events-none absolute -left-6 bottom-0 h-20 w-20 rounded-full bg-brand/15 blur-xl"
                  animate={{ opacity: [0.3, 0.5, 0.3], scale: [1, 1.05, 1] }}
                  transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
                />
                <div className="relative">
                  <p className="text-base font-semibold text-foreground">
                    Session complete – well done!
                  </p>
                  <p className="mt-1 text-sm text-muted">
                    Your progress has been updated. Tap to go to your Progress dashboard.
                  </p>
                  <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-brand">
                    View dashboard
                    <span className="transition-transform group-hover:translate-x-0.5">→</span>
                  </span>
                </div>
              </motion.div>
            </Link>
          )}

          <Card className="p-4 md:p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                  Conversation
                </p>
                <p className="mt-1 text-sm text-muted">
                  A live classroom feel—short turns, clear thinking.
                </p>
              </div>
              <span className="rounded-full bg-surface px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-muted">
                Session
              </span>
            </div>
            <div className="mt-4 rounded-2xl border border-border-subtle bg-surface p-4 text-sm text-muted">
              Your conversation with the tutor will appear here as you speak or type.
            </div>
          </Card>
        </motion.section>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border-subtle bg-surface-elevated/92 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 md:px-6">
          <Button
            type="button"
            onClick={toggleMic}
            className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full p-0 md:h-12 md:w-12"
            variant="primary"
            disabled={sessionState !== "running" || micStatus !== "idle"}
            aria-label="Speak to the tutor"
          >
            <motion.span
              className="absolute inset-0 rounded-full bg-brand/20"
              animate={
                sessionState === "running" && micStatus !== "idle"
                  ? { scale: [1, 1.1, 1.2], opacity: [0.4, 0.25, 0] }
                  : { scale: 1, opacity: 0 }
              }
              transition={
                sessionState === "running" && micStatus !== "idle"
                  ? { duration: 1.2, repeat: Infinity, ease: "easeOut" }
                  : { duration: 0.2 }
              }
            />
            <MicIcon />
          </Button>

          <div className="flex min-w-0 flex-1 items-center gap-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="h-12 w-full min-w-0 rounded-full border border-border-subtle bg-surface px-4 text-sm md:text-base outline-none ring-offset-2 ring-offset-surface-elevated focus:border-brand focus:ring-2 focus:ring-brand"
              placeholder="Or type your answer here…"
            />
            <Button
              type="button"
              onClick={handleSend}
              variant="secondary"
              disabled={sessionState !== "running" || micStatus !== "idle" || !input.trim()}
              className="shrink-0"
            >
              Send
            </Button>
          </div>

          <div className="hidden text-right md:block">
            <p className="text-xs font-semibold text-foreground">
              {sessionState === "idle"
                ? "Press Start session to begin"
                : sessionState === "paused"
                  ? "Session paused"
                  : stt === "speaking"
                    ? "Tutor is speaking…"
                    : micStatus === "listening"
                      ? "Listening to you…"
                      : micStatus === "processing"
                        ? "Processing your answer…"
                        : "Voice or text — your choice"}
            </p>
            <p className="text-[0.7rem] text-muted">
              {sessionState !== "running"
                ? "Start the session, then speak or type."
                : micStatus === "idle" && stt !== "speaking"
                  ? "Tap Speak or Send to continue"
                  : "Please wait"}
            </p>
          </div>
        </div>
      </div>
      <audio
        ref={audioRef}
        className="hidden"
        onEnded={() => {
          setStt("idle");
          if (sessionState === "running") {
            if (stepIndex === STEPS.length - 1) {
              // Session finished – write completion + literacy improvement status
              if (typeof window !== "undefined") {
                try {
                  const existingRaw = window.sessionStorage.getItem(
                    "edgeai_tutor_session_status_v1",
                  );
                  const existing = existingRaw ? JSON.parse(existingRaw) : {};
                  const literacyDelta = {
                    Inferencing: 10,
                  };
                  const payload = {
                    ...existing,
                    completed: true,
                    completedAt: new Date().toISOString(),
                    literacyDelta,
                  };
                  window.sessionStorage.setItem(
                    "edgeai_tutor_session_status_v1",
                    JSON.stringify(payload),
                  );
                } catch {
                  // ignore failures – status is a nice-to-have
                }
              }
              setSessionCompleted(true);
            } else {
              advanceStep();
            }
          }
        }}
      />
    </main>
  );
}

function AvatarPanel({ stt }: { stt: SttStatus }) {
  const active = stt === "speaking";
  return (
    <Card className="flex flex-col items-center justify-center p-5 md:p-6">
      <div className="grid place-items-center rounded-2xl border border-border-subtle bg-surface p-5 md:p-6">
        <TutorAvatar active={active} />
      </div>
      <div className="mt-4 flex items-center gap-2">
        <SpeakingIndicator active={active} />
        <p className="text-xs text-muted">
          {stt === "speaking" ? "Tutor is speaking…" : "Ready"}
        </p>
      </div>
    </Card>
  );
}

function SpeakingIndicator({ active }: { active: boolean }) {
  return (
    <div className="relative h-3 w-3">
      <motion.div
        className="absolute inset-0 rounded-full bg-brand"
        animate={active ? { opacity: [0.35, 1, 0.35] } : { opacity: 0.25 }}
        transition={active ? { duration: 1.1, repeat: Infinity } : { duration: 0.2 }}
      />
      <div className="absolute inset-[3px] rounded-full bg-surface-elevated" />
    </div>
  );
}

function TutorAvatar({ active }: { active: boolean }) {
  return (
    <div className="relative">
      {active && (
        <>
          <motion.div
            className="absolute inset-0 m-auto h-44 w-44 rounded-full bg-brand/20"
            animate={{ scale: [1, 1.1, 1.2], opacity: [0.3, 0.15, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
          />
          <motion.div
            className="absolute inset-0 m-auto h-36 w-36 rounded-full bg-brand/15"
            animate={{ scale: [1, 1.15, 1.25], opacity: [0.25, 0.12, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut", delay: 0.25 }}
          />
        </>
      )}
      <svg
        width="160"
        height="160"
        viewBox="0 0 160 160"
        role="img"
        aria-label="Illustrated tutor avatar"
        className="relative z-10"
      >
        <defs>
          <linearGradient id="kente" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#685aff" />
            <stop offset="0.5" stopColor="#f59e0b" />
            <stop offset="1" stopColor="#16a34a" />
          </linearGradient>
        </defs>
        <rect x="18" y="22" width="124" height="124" rx="32" fill="#ffffff" />
        <rect x="18" y="22" width="124" height="124" rx="32" fill="url(#kente)" opacity="0.08" />
        <circle cx="80" cy="70" r="28" fill="#c08457" />
        <path
          d="M55 68c6-16 44-16 50 0 1 3 1 7-1 10-6-8-40-8-48 0-2-3-2-7-1-10Z"
          fill="#1f2937"
          opacity="0.95"
        />
        <circle cx="70" cy="74" r="3" fill="#111827" />
        <circle cx="90" cy="74" r="3" fill="#111827" />
        <path d="M72 84c6 6 10 6 16 0" stroke="#111827" strokeWidth="3" strokeLinecap="round" fill="none" />
        <path
          d="M48 132c6-26 58-26 64 0"
          fill="url(#kente)"
          opacity="0.9"
        />
        <path d="M56 112h48" stroke="#111827" strokeOpacity="0.15" strokeWidth="6" strokeLinecap="round" />
        <circle cx="80" cy="46" r="12" fill="#111827" opacity="0.95" />
        <path d="M68 44c4-12 20-12 24 0" stroke="#111827" strokeWidth="10" strokeLinecap="round" />
      </svg>
    </div>
  );
}

function LessonOutline({
  currentStep,
  totalSteps,
}: {
  currentStep: number;
  totalSteps: number;
}) {
  const steps = [
    "Introduction",
    "Concept – complete sentences",
    "Reading passage",
    "Corrections together",
    "Your turn – practice",
  ].slice(0, totalSteps);

  return (
    <Card className="p-4 md:p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
        Lesson outline
      </p>
      <ul className="mt-3 space-y-2 text-sm">
        {steps.map((label, idx) => {
          const stepNumber = idx + 1;
          const active = stepNumber === currentStep;
          return (
            <li
              key={label}
              className={[
                "flex items-center gap-2 rounded-full px-3 py-1",
                active ? "bg-brand-soft text-foreground" : "text-muted",
              ].join(" ")}
            >
              <span
                className={[
                  "flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold",
                  active ? "bg-brand text-white" : "bg-surface border border-border-subtle",
                ].join(" ")}
              >
                {stepNumber}
              </span>
              <span className="text-xs">{label}</span>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}

function Whiteboard({ board, stt }: { board: Turn["board"]; stt: SttStatus }) {
  return (
    <Card className="p-4 md:p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
            Whiteboard
          </p>
          <p className="mt-1 text-sm text-muted">
            {stt === "speaking" ? "Tutor explaining this step…" : "Clean board surface · writing-style animation"}
          </p>
        </div>
        <span className="rounded-full bg-brand-soft px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-brand">
          Live
        </span>
      </div>

      <div className="mt-4 rounded-2xl border border-[#14b8a6]/40 bg-[#fffdf6] p-4 shadow-[0_10px_30px_rgba(15,23,42,0.08)] md:p-6">
        <motion.div
          key={JSON.stringify(board)}
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.08 } },
          }}
          className="min-h-[220px]"
        >
          {board.type === "fractionBars" && (
            <motion.div
              variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}
              className="space-y-5"
            >
              <FractionBar label={board.aLabel} fill={board.aFill} />
              <FractionBar label={board.bLabel} fill={board.bFill} />
              <motion.p
                variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}
                className="text-sm text-muted"
              >
                Visual check: more shaded area → larger value (when the whole is the same).
              </motion.p>
            </motion.div>
          )}

          {board.type === "notes" && (
            <motion.div
              variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}
              className="space-y-3"
            >
              <h3 className="text-base font-semibold text-foreground">
                Key notes
              </h3>
              <ul className="list-disc space-y-2 pl-5 text-sm text-foreground">
                {board.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </motion.div>
          )}

          {board.type === "numberLine" && (
            <motion.div
              variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}
              className="space-y-4"
            >
              <h3 className="text-base font-semibold text-foreground">
                Number line (0 to 1)
              </h3>
              <NumberLine
                from={board.from}
                to={board.to}
                tick={board.tick}
                highlight={board.highlight}
              />
              <p className="text-sm text-muted">
                Fractions are points on a line—bigger fractions sit further to the right.
              </p>
            </motion.div>
          )}

          {board.type === "slide" && <SlideBoard board={board} />}
          {board.type === "passage" && <PassageBoard board={board} />}
        </motion.div>
      </div>
    </Card>
  );
}

function SlideBoard({ board }: { board: Extract<Turn["board"], { type: "slide" }> }) {
  return (
    <motion.div
      variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}
      className="space-y-4"
    >
      <div className="rounded-2xl border border-border-subtle bg-white p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
          Slide
        </p>
        <h3 className="mt-2 text-lg font-semibold text-foreground">
          {board.id ? SLIDES[board.id].title : board.title}
        </h3>
        <ul className="mt-3 space-y-2 text-sm text-foreground">
          {(board.id ? SLIDES[board.id].bullets : board.points ?? []).map((p) => {
            return (
              <motion.li
                key={p}
                className={[
                  "rounded-lg px-3 py-1.5",
                ].join(" ")}
                animate={{ opacity: [0, 1], y: [4, 0] }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
              >
                {p}
              </motion.li>
            );
          })}
        </ul>
        {board.id && SLIDES[board.id].exampleLines && (
          <div className="mt-4 rounded-xl border border-dashed border-border-subtle bg-surface p-3 text-[13px] text-foreground">
            {SLIDES[board.id].exampleLines!.map((line) => (
              <p key={line} className="leading-snug">
                {line}
              </p>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

function PassageBoard({ board }: { board: Extract<Turn["board"], { type: "passage" }> }) {
  const passage = PASSAGES[board.id];
  const { paragraphs, highlights, title } = passage;

  function renderWithHighlights(text: string) {
    const nodes: JSX.Element[] = [];
    let remaining = text;
    while (remaining.length) {
      const next = highlights
        .map((phrase) => ({
          phrase,
          index: remaining.indexOf(phrase),
        }))
        .filter((x) => x.index >= 0)
        .sort((a, b) => a.index - b.index)[0];

      if (!next) {
        nodes.push(<span key={nodes.length}>{remaining}</span>);
        break;
      }

      if (next.index > 0) {
        nodes.push(<span key={nodes.length}>{remaining.slice(0, next.index)}</span>);
      }

      nodes.push(
        <mark
          key={`${nodes.length}-h`}
          className="rounded-md bg-amber-100 px-0.5 py-0.5 text-amber-900 underline decoration-amber-400/80 decoration-2"
        >
          {next.phrase}
        </mark>,
      );

      remaining = remaining.slice(next.index + next.phrase.length);
    }
    return nodes;
  }

  return (
    <motion.div
      variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}
      className="space-y-4"
      role="region"
      aria-label="Reading passage about Ghana's independence"
    >
      <div className="rounded-2xl border border-border-subtle bg-white p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
          Passage
        </p>
        <h3 className="mt-2 text-lg font-semibold text-foreground">{title}</h3>
        <div className="mt-3 space-y-3 text-[15px] leading-relaxed text-foreground">
          {paragraphs.map((para, idx) => (
            <p key={idx}>{renderWithHighlights(para)}</p>
          ))}
        </div>
        <p className="mt-4 text-xs text-muted">
          Amber highlights show structurally weak or incomplete sentences we will fix together.
        </p>
      </div>
    </motion.div>
  );
}

function FractionBar({ label, fill }: { label: string; fill: number }) {
  const pct = Math.round(fill * 100);
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-foreground">{label}</p>
        <p className="text-xs text-muted">{pct}% of the whole</p>
      </div>
      <div className="h-8 w-full overflow-hidden rounded-xl border border-border-subtle bg-white">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="h-full bg-brand/80"
        />
      </div>
    </div>
  );
}

function NumberLine({
  from,
  to,
  tick,
  highlight,
}: {
  from: number;
  to: number;
  tick: number;
  highlight: number[];
}) {
  const ticks: number[] = [];
  for (let v = from; v <= to + 1e-9; v += tick) ticks.push(Number(v.toFixed(3)));

  function xPos(v: number) {
    const pct = ((v - from) / (to - from)) * 100;
    return `${pct}%`;
  }

  return (
    <div className="relative mt-3 rounded-2xl border border-border-subtle bg-white p-4">
      <div className="relative h-10">
        <div className="absolute left-0 right-0 top-5 h-0.5 bg-border-subtle" />
        {ticks.map((t) => (
          <div
            key={t}
            className="absolute top-3 h-4 w-0.5 bg-border-subtle"
            style={{ left: xPos(t) }}
            title={`${t}`}
          />
        ))}
        {highlight.map((h) => (
          <motion.div
            key={h}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="absolute top-1 grid place-items-center"
            style={{ left: xPos(h) }}
            title={`${h}`}
          >
            <div className="h-3 w-3 -translate-x-1/2 rounded-full bg-brand" />
          </motion.div>
        ))}
      </div>
      <div className="mt-2 flex justify-between text-xs text-muted">
        <span>{from}</span>
        <span>{to}</span>
      </div>
    </div>
  );
}

function MicIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-5 w-5 md:h-6 md:w-6 text-surface"
    >
      <rect x="9" y="4" width="6" height="10" rx="3" className="fill-current" />
      <path
        d="M7 10a1 1 0 0 0-2 0 7 7 0 0 0 6 6.93V19H8a1 1 0 1 0 0 2h8a1 1 0 1 0 0-2h-3v-2.07A7 7 0 0 0 19 10a1 1 0 1 0-2 0 5 5 0 0 1-10 0Z"
        className="fill-current"
      />
    </svg>
  );
}

