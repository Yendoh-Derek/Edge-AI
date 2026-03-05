"use client";

import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const wordVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut" as const,
    },
  },
};

const brandSpanVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut" as const,
    },
  },
  animate: {
    opacity: [1, 0.95, 1],
    transition: {
      duration: 4,
      ease: "easeInOut" as const,
      repeat: Infinity,
      delay: 1.5,
    },
  },
};

const shimmerVariants = {
  animate: {
    backgroundPosition: ["200% center", "-200% center"],
    transition: {
      duration: 8,
      ease: "linear" as const,
      repeat: Infinity,
    },
  },
};

export function HeroHeadline() {
  const words = ["Structured", "learning", "with", "teacher", "insight."];
  const brandText = "Measure progress. Improve outcomes.";

  return (
    <div className="space-y-4">
      <motion.div variants={containerVariants} initial="hidden" animate="visible">
        <h1 className="max-w-2xl text-balance text-3xl font-semibold tracking-tight text-foreground md:text-4xl lg:text-5xl">
          {words.map((word) => (
            <motion.span key={word} variants={wordVariants} className="inline-block mr-2">
              {word}
            </motion.span>
          ))}
        </h1>
      </motion.div>

      <motion.div
        variants={brandSpanVariants}
        initial="hidden"
        animate={["visible", "animate"]}
        className="inline-block"
      >
        <motion.div
          variants={shimmerVariants}
          animate="animate"
          className="max-w-2xl text-balance text-2xl md:text-3xl font-semibold tracking-tight"
          style={{
            backgroundImage: "linear-gradient(90deg, #7d2ae7, #5c1fba, #7d2ae7)",
            backgroundSize: "200% center",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            color: "transparent",
          }}
        >
          {brandText}
        </motion.div>
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5, ease: "easeOut" }}
        className="max-w-xl text-sm leading-relaxed text-muted md:text-base"
      >
        A diagnostic and learning platform for Ghanaian JHS/SHS students. Teacher-controlled, data-driven, built for real classrooms.
      </motion.p>
    </div>
  );
}
