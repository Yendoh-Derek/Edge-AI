"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { TopNav } from "../../../components/layout/top-nav";
import { Card } from "../../../components/ui/card";

export default function StudentDashboardPage() {
  const student = {
    name: "Derek Yendoh",
    school: "Accra Academy",
    classLevel: "JHS 3",
  };

  return (
    <main className="flex min-h-[100svh] flex-col">
      <TopNav
        rightSlot={
          <>
            <div className="hidden text-right md:block">
              <p className="text-sm font-medium text-foreground">{student.name}</p>
              <p className="text-xs text-muted">
                {student.school} · {student.classLevel}
              </p>
            </div>
            <div
              className="grid h-9 w-9 place-items-center rounded-full bg-brand-soft text-xs font-semibold text-foreground"
              aria-label="Student avatar"
              title={student.name}
            >
              DY
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

      <div className="mx-auto flex w-full max-w-6xl flex-1 px-4 pb-10 pt-6 md:px-6 md:pt-8">
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="flex w-full flex-col space-y-6"
        >
          <Card className="relative overflow-hidden border border-border-subtle/60 bg-gradient-to-br from-brand-soft/50 via-surface to-surface-elevated p-5 shadow-sm/40 backdrop-blur-md md:p-6">
            <div className="pointer-events-none absolute -left-8 -top-10 h-40 w-40 rounded-full bg-brand-soft blur-3xl" />
            <div className="pointer-events-none absolute -right-10 bottom-0 h-32 w-32 rounded-full bg-warning/40 blur-3xl" />
            <div className="relative flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
                  Welcome back
                </p>
                <h1 className="text-xl font-semibold tracking-tight text-foreground md:text-2xl">
                  Good morning, {student.name.split(" ")[0]}.
                </h1>
                <p className="text-sm text-muted">
                  {student.school} · {student.classLevel} · Accra, Greater Accra
                </p>
              </div>
              <div className="mt-3 inline-flex items-center gap-2 text-xs text-muted md:mt-0">
                <span className="rounded-full bg-surface px-3 py-1">
                  Today’s focus
                </span>
                <span className="rounded-full bg-surface px-3 py-1">
                  Fractions & Inferencing
                </span>
              </div>
            </div>
          </Card>

          <div className="flex flex-1 items-center">
            <div className="grid w-full gap-4 md:grid-cols-3">
              <ActionCard
                href="/student/assessment"
                iconSrc="/images/diagnose.png"
                alt="Diagnostic assessment icon"
                title="Diagnostic Assessment"
                description="Find your exact literacy and numeracy skill levels. ~15 mins."
                meta="Adaptive · Immediate feedback"
              />
              <ActionCard
                href="/student/tutor"
                iconSrc="/images/ai_tutor.png"
                alt="AI tutor icon"
                title="AI Tutor Session"
                description="Study any topic with your personal AI tutor."
                meta="Voice or text · Step-by-step"
              />
              <ActionCard
                href="/student/results"
                iconSrc="/images/progress.jpg"
                alt="Progress chart icon"
                title="My Progress"
                description="View your skill mastery map and track improvement."
                meta="Skill gaps · Growth over time"
              />
            </div>
          </div>
        </motion.section>
      </div>
    </main>
  );
}

type ActionCardProps = {
  href: string;
  iconSrc: string;
  alt: string;
  title: string;
  description: string;
  meta: string;
};

function ActionCard({ href, iconSrc, alt, title, description, meta }: ActionCardProps) {
  return (
    <Link href={href} className="group block">
      <Card className="h-full overflow-hidden border border-border-subtle/70 bg-surface-elevated/90 p-4 shadow-sm/40 backdrop-blur-md transition-transform duration-200 hover:-translate-y-[2px] hover:border-brand-soft/80 hover:shadow-md md:p-5">
        <div className="pointer-events-none absolute inset-x-0 -top-12 h-24 bg-gradient-to-b from-brand-soft/70 to-transparent" />
        <div className="flex items-start justify-between gap-3">
          <div className="relative space-y-1">
            <div className="flex items-center gap-2">
              <span className="grid h-10 w-10 place-items-center rounded-2xl bg-surface shadow-sm ring-1 ring-white/40">
                <Image
                  src={iconSrc}
                  alt={alt}
                  width={28}
                  height={28}
                  className="h-7 w-7 object-contain"
                />
              </span>
              <h2 className="text-base font-semibold text-foreground md:text-lg">
                {title}
              </h2>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-muted">{description}</p>
          </div>
          <span className="relative text-muted transition-transform group-hover:translate-x-0.5">
            →
          </span>
        </div>
        <p className="mt-4 inline-flex rounded-full bg-brand-soft px-3 py-1 text-xs font-medium text-brand">
          {meta}
        </p>
      </Card>
    </Link>
  );
}

