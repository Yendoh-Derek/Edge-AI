"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { BrandLogo } from "../components/brand-logo";
import { Card } from "../components/ui/card";

const navItems = [
  { label: "Prices", href: "#prices" },
  { label: "Products", href: "#products" },
  { label: "Contact", href: "#contact" },
  { label: "Sign up", href: "/login/student" },
  { label: "Login", href: "/login/student" },
] as const;

export default function Home() {
  return (
    <main className="mx-auto flex min-h-[100svh] max-w-6xl flex-col px-4 pb-10 pt-5 md:px-6 md:pt-10">
      <nav className="flex items-center justify-between border-b border-border-subtle/70 pb-4 md:pb-5">
        <BrandLogo compact />
        <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-muted md:gap-x-8 md:text-sm">
          {navItems.map(({ label, href }) => (
            <li key={label}>
              <Link
                href={href}
                className="transition-colors hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 rounded-sm"
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="flex flex-1 flex-col gap-8 pt-8 md:items-center md:pt-10"
      >
        <div className="space-y-8">
          <div className="space-y-4">
            <h1 className="max-w-xl text-balance text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
              Find learning gaps.{" "}
              <span className="text-brand">Close them with AI.</span>
            </h1>
            <p className="max-w-xl text-sm leading-relaxed text-muted md:text-base">
              A focused diagnostic and tutor for Ghanaian JHS/SHS learners. Quick to start,
              centred on numeracy and literacy basics.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <RoleCard
              iconSrc="/images/ai_tutor.png"
              alt="AI tutor icon"
              title="Teacher"
              description="Identify gaps, govern remediation, track learner growth."
              href="/login/teacher"
            />
            <RoleCard
              iconSrc="/images/student.png"
              alt="Student icon"
              title="Student"
              description="Take your diagnostic and learn with your AI tutor."
              href="/login/student"
            />
          </div>

          <p className="pt-2 text-[0.7rem] text-muted">
            Prototype — built for Ghanaian classrooms.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.45, ease: "easeOut" }}
            className="mt-4 grid gap-3 text-xs text-muted md:grid-cols-3"
          >
            <MicroHighlight
              label="Instant skill map"
              description="See numeracy and literacy gaps in a single glassy canvas."
            />
            <MicroHighlight
              label="AI tutor on demand"
              description="Drop into short, focused sessions—anytime, even on low bandwidth."
            />
            <MicroHighlight
              label="Built for Ghana"
              description="Contexts, names, and examples that feel familiar to your classroom."
            />
          </motion.div>
        </div>
      </motion.section>
    </main>
  );
}

type RoleCardProps = {
  iconSrc: string;
  alt: string;
  title: "Teacher" | "Student";
  description: string;
  href: string;
};

function RoleCard({ iconSrc, alt, title, description, href }: RoleCardProps) {
  return (
    <Link href={href} className="group block">
      <Card className="flex h-full flex-col justify-between gap-4 border border-border-subtle/70 bg-surface-elevated/90 p-4 shadow-sm/40 backdrop-blur-md transition-transform duration-200 hover:-translate-y-[2px] hover:border-brand-soft/80 hover:shadow-md md:p-5">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-brand-soft/60 shadow-sm ring-1 ring-white/40">
            <Image
              src={iconSrc}
              alt={alt}
              width={32}
              height={32}
              className="h-8 w-8 object-contain"
            />
          </div>
          <div>
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-muted">
              {title === "Teacher" ? "For Teachers" : "For Learners"}
            </p>
            <p className="text-base font-semibold text-foreground md:text-lg">{title}</p>
          </div>
        </div>
        <p className="flex-1 text-sm leading-relaxed text-muted">{description}</p>
        <div className="mt-1 flex items-center justify-between text-xs font-medium text-brand">
          <span className="inline-flex items-center gap-1">
            {title === "Teacher" ? "Enter teacher space" : "Enter learner space"}
          </span>
          <span className="transition-transform group-hover:translate-x-0.5">→</span>
        </div>
      </Card>
    </Link>
  );
}

type MicroHighlightProps = {
  label: string;
  description: string;
};

function MicroHighlight({ label, description }: MicroHighlightProps) {
  return (
    <Card className="border border-border-subtle/60 bg-surface-elevated/80 p-3 shadow-sm/30 backdrop-blur-md">
      <p className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-brand">
        {label}
      </p>
      <p className="mt-1 text-[0.78rem] leading-relaxed text-muted">{description}</p>
    </Card>
  );
}

