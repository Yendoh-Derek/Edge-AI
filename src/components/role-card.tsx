"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Card } from "./ui/card";

type RoleCardProps = {
  iconSrc: string;
  alt: string;
  title: "Teacher" | "Student";
  description: string;
  href: string;
  index: number;
};

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut" as const,
    },
  },
};

export function RoleCard({
  iconSrc,
  alt,
  title,
  description,
  href,
  index,
}: RoleCardProps) {
  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" transition={{ delay: 0.1 + index * 0.1 }}>
      <Link href={href} className="group block">
        <Card className="relative flex h-full flex-col justify-between gap-4 border border-border-subtle/70 bg-surface-elevated/90 p-4 shadow-sm/40 backdrop-blur-md md:p-5 overflow-hidden">
          <motion.div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
            style={{
              background: "radial-gradient(circle at 50% 50%, rgba(125, 42, 231, 0.08), transparent)",
            }}
          />

          <div className="relative z-10 flex items-center gap-3">
            <motion.div
              className="grid h-11 w-11 place-items-center rounded-2xl bg-brand-soft/60 shadow-sm ring-1 ring-white/40"
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ duration: 0.3 }}
            >
              <Image
                src={iconSrc}
                alt={alt}
                width={32}
                height={32}
                className="h-8 w-8 object-contain"
              />
            </motion.div>
            <div>
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-muted">
                {title === "Teacher" ? "For Teachers" : "For Learners"}
              </p>
              <p className="text-base font-semibold text-foreground md:text-lg">{title}</p>
            </div>
          </div>

          <motion.p
            className="relative z-10 flex-1 text-sm leading-relaxed text-muted"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 + index * 0.1, duration: 0.4 }}
          >
            {description}
          </motion.p>

          <motion.div
            className="relative z-10 mt-1 flex items-center justify-between text-xs font-medium text-brand"
            whileHover={{ x: 4 }}
            transition={{ duration: 0.2 }}
          >
            <span className="inline-flex items-center gap-1">
              {title === "Teacher" ? "Enter teacher space" : "Enter learner space"}
            </span>
            <motion.span
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              →
            </motion.span>
          </motion.div>
        </Card>
      </Link>
    </motion.div>
  );
}
