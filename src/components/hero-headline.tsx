"use client";

import { motion } from "framer-motion";
import { useState } from "react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.15,
    },
  },
};

const wordVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut" as const,
    },
  },
};

const brandSpanVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut" as const,
    },
  },
  animate: {
    opacity: [1, 0.92, 1],
    transition: {
      duration: 5,
      ease: "easeInOut" as const,
      repeat: Infinity,
      delay: 2,
    },
  },
};

const shimmerVariants = {
  animate: {
    backgroundPosition: ["200% center", "-200% center"],
    transition: {
      duration: 9,
      ease: "linear" as const,
      repeat: Infinity,
    },
  },
};

const descriptionVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.5,
      duration: 0.6,
      ease: "easeOut" as const,
    },
  },
};

export function HeroHeadline() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const words = ["Structured", "learning", "with", "teacher", "insight."];
  const brandText = "Measure progress. Improve outcomes.";

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div className="space-y-6" onMouseMove={handleMouseMove}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative"
      >
        <h1 className="max-w-3xl text-balance text-4xl font-semibold tracking-tight text-foreground md:text-5xl lg:text-6xl leading-tight">
          {words.map((word, idx) => (
            <motion.span
              key={word}
              variants={wordVariants}
              className="inline-block mr-3 relative"
              whileHover={{
                scale: 1.05,
                transition: { duration: 0.2 },
              }}
            >
              {word}
            </motion.span>
          ))}
        </h1>
      </motion.div>

      <motion.div
        variants={brandSpanVariants}
        initial="hidden"
        animate={["visible", "animate"]}
        className="inline-block relative"
      >
        <motion.div
          variants={shimmerVariants}
          animate="animate"
          className="max-w-2xl text-balance text-2xl md:text-3xl lg:text-4xl font-semibold tracking-tight"
          style={{
            backgroundImage: "linear-gradient(110deg, #7d2ae7, #5c1fba, #7d2ae7, #5c1fba)",
            backgroundSize: "200% center",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            color: "transparent",
          }}
        >
          {brandText}
        </motion.div>

        <motion.div
          className="absolute inset-0 rounded-lg blur-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none"
          style={{
            background: "linear-gradient(135deg, #7d2ae7, #5c1fba)",
          }}
        />
      </motion.div>

      <motion.p
        variants={descriptionVariants}
        initial="hidden"
        animate="visible"
        className="max-w-2xl text-base leading-relaxed text-muted md:text-lg"
      >
        A diagnostic and learning platform for Ghanaian JHS/SHS students. Teacher-controlled, data-driven, built for real classrooms.
      </motion.p>
    </div>
  );
}
