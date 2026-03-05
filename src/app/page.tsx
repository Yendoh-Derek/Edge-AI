"use client";

import { motion } from "framer-motion";
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

