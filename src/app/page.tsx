"use client";

<<<<<<< HEAD
import { motion } from "framer-motion";
=======
import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
>>>>>>> db1c20f (Update Hero and Home page for better UI UX experience)
import Link from "next/link";
import { BrandLogo } from "../components/brand-logo";
import { AnimatedBackground } from "../components/animated-background";
import { HeroHeadline } from "../components/hero-headline";
import { RoleCard } from "../components/role-card";
import { MicroHighlight } from "../components/micro-highlight";
import { ImageCarousel } from "../components/image-carousel";

const navItems = [
  { label: "Prices", href: "#prices" },
  { label: "Products", href: "#products" },
  { label: "Contact", href: "#contact" },
  { label: "Sign up", href: "/login/student" },
  { label: "Login", href: "/login/student" },
] as const;

export default function Home() {
  return (
    <main className="relative mx-auto flex min-h-[100svh] max-w-7xl flex-col px-4 pb-10 pt-5 md:px-6 md:pt-10">
      <AnimatedBackground />

      <motion.nav
        initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-20 flex items-center justify-between border-b border-white/10 pb-4 md:pb-6 backdrop-blur-sm"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <BrandLogo compact />
        </motion.div>
        <ul className="flex flex-wrap items-center gap-x-8 gap-y-2 text-xs text-muted md:gap-x-10 md:text-sm">
          {navItems.map(({ label, href }, index) => (
            <motion.li
              key={label}
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.06, duration: 0.4 }}
            >
              <Link
                href={href}
                className="relative group transition-colors hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 rounded-sm"
              >
                {label}
                <motion.span
                  className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-brand to-brand/50"
                  initial={{ width: 0 }}
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                />
              </Link>
            </motion.li>
          ))}
        </ul>
      </motion.nav>

      <motion.section
<<<<<<< HEAD
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 flex flex-1 flex-col gap-16 pt-10 md:pt-16 lg:pt-20"
      >
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div className="space-y-8">
            <HeroHeadline />

            <div className="grid gap-4 sm:grid-cols-2">
              <RoleCard
                iconSrc="/images/ai_tutor.png"
                alt="Teacher icon"
                title="Teacher"
                description="Identify learning gaps, guide remediation, track progress with precision."
                href="/login/teacher"
                index={0}
              />
              <RoleCard
                iconSrc="/images/student.png"
                alt="Student icon"
                title="Student"
                description="Take assessments and learn with personalized, adaptive guidance."
                href="/login/student"
                index={1}
              />
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.4 }}
              className="pt-4 text-[0.7rem] text-muted font-medium tracking-wider uppercase"
            >
              Prototype — Designed for Ghanaian classrooms
            </motion.p>
          </div>

          <ImageCarousel />
=======
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="flex flex-1 flex-col gap-10 pt-8 md:flex-row md:items-center md:pt-10"
      >
        <div className="flex-1 space-y-8">
          <div className="space-y-4">
            <h1 className="max-w-xl text-balance text-4xl font-extrabold tracking-tight text-foreground md:text-6xl">
              Find learning gaps.{" "}
              <span className="text-brand">Close them with AI.</span>
            </h1>
          </div>

          <div className="grid max-w-xl gap-4 md:grid-cols-2">
            <RoleCard
              iconSrc="/images/ai_tutor.png"
              alt="AI tutor icon"
              title="Teacher"
              href="/login/teacher"
            />
            <RoleCard
              iconSrc="/images/student.png"
              alt="Student icon"
              title="Student"
              href="/login/student"
            />
          </div>

          <p className="pt-2 text-[0.7rem] text-muted">
            Prototype — built for Ghanaian classrooms.
          </p>
        </div>

        <div className="mt-6 flex flex-1 flex-col items-center justify-center gap-4 md:mt-0">
          <GeometricHeroCanvas />
          <ScrollingHighlights />
>>>>>>> db1c20f (Update Hero and Home page for better UI UX experience)
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="grid gap-3 text-xs text-muted md:grid-cols-3"
        >
          <MicroHighlight
            label="Instant Diagnostics"
            description="Comprehensive skill mapping across numeracy and literacy domains."
            index={0}
          />
          <MicroHighlight
            label="Teacher Control"
            description="Full visibility and agency over learner progress and remediation."
            index={1}
          />
          <MicroHighlight
            label="Built for Ghana"
            description="Culturally relevant contexts and examples for every classroom."
            index={2}
          />
        </motion.div>
      </motion.section>
    </main>
  );
}

<<<<<<< HEAD
=======
type RoleCardProps = {
  iconSrc: string;
  alt: string;
  title: "Teacher" | "Student";
  href: string;
};

function RoleCard({ iconSrc, alt, title, href }: RoleCardProps) {
  return (
    <Link href={href} className="group block">
      <motion.div
        initial={{ opacity: 0, y: -18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
      >
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
        <div className="mt-1 flex items-center justify-between text-sm font-semibold tracking-tight text-brand md:text-base">
          <span className="inline-flex items-center gap-1">
            {title === "Teacher" ? "Enter teacher space" : "Enter learner space"}
          </span>
          <span className="transition-transform group-hover:translate-x-0.5">→</span>
        </div>
      </Card>
      </motion.div>
    </Link>
  );
}

function GeometricHeroCanvas() {
  const shapes = [
    { delay: 0, x: -40, width: 90, height: 60, borderRadius: "1.25rem" },
    { delay: 0.15, x: 10, width: 80, height: 80, borderRadius: "999px" },
    { delay: 0.3, x: 60, width: 70, height: 50, borderRadius: "1rem" },
  ] as const;

  return (
    <motion.div
      initial={{ opacity: 0, y: -70 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative aspect-[4/3] w-full max-w-sm overflow-hidden rounded-3xl border border-border-subtle/70 bg-gradient-to-br from-surface-elevated/90 via-background/60 to-surface-elevated/90 shadow-[0_18px_40px_rgba(15,23,42,0.35)]"
      aria-hidden="true"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(139,92,246,0.28),transparent_55%),radial-gradient(circle_at_bottom,_rgba(59,130,246,0.18),transparent_55%)]" />

      <div className="relative flex h-full items-center justify-center">
        {shapes.map((shape, index) => (
          <motion.div
            key={index}
            className="absolute bg-gradient-to-br from-brand-soft/70 to-brand/70 shadow-[0_14px_30px_rgba(88,28,135,0.55)]"
            style={{
              width: shape.width,
              height: shape.height,
              borderRadius: shape.borderRadius,
              left: `calc(50% + ${shape.x}px)`,
            }}
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: [-40, 0, 8, 0], opacity: [0, 1, 1, 1] }}
            transition={{
              duration: 5,
              ease: "easeInOut",
              repeat: Infinity,
              delay: shape.delay,
            }}
          />
        ))}

        <motion.div
          className="absolute bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/10 bg-black/25 px-3 py-1 text-[0.7rem] text-slate-100 backdrop-blur-md"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          <span>Live AI diagnostics animation</span>
        </motion.div>
      </div>
    </motion.div>
  );
}

function ScrollingHighlights() {
  const items = [
    "Instant skill map",
    "AI tutor on demand",
    "Built for Ghana",
    "Teacher controls",
    "Track progress",
  ] as const;

  const reduceMotion = useReducedMotion();
  const visibleCount = 3;
  const cardWidthPx = 72; // w-[4.5rem]
  const gapPx = 12; // gap-3
  const stepPx = cardWidthPx + gapPx;
  const shiftPx = stepPx * Math.max(0, items.length - visibleCount);

  return (
    <div className="w-full max-w-sm">
      <div className="edge-marquee mx-auto w-2/3 max-w-[240px] rounded-2xl">
        <motion.div
          className="flex flex-nowrap gap-3 py-1"
          animate={reduceMotion ? { x: 0 } : { x: [0, -shiftPx] }}
          transition={
            reduceMotion
              ? undefined
              : {
                  duration: 10,
                  ease: "linear",
                  repeat: Infinity,
                  repeatType: "mirror",
                }
          }
        >
          {items.map((label) => (
            <Card
              key={label}
              className="w-[4.5rem] shrink-0 border border-border-subtle/60 bg-surface-elevated/85 px-2 py-2 shadow-sm/30 backdrop-blur-md transition-all duration-200 hover:-translate-y-[1px] hover:border-brand-soft/80 hover:shadow-md"
            >
              <p className="text-center text-[0.75rem] font-semibold leading-tight tracking-tight text-brand">
                {label}
              </p>
            </Card>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

>>>>>>> db1c20f (Update Hero and Home page for better UI UX experience)
