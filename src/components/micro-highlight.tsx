"use client";

import { motion } from "framer-motion";
import { Card } from "./ui/card";

type MicroHighlightProps = {
  label: string;
  description: string;
  index: number;
};

const containerVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut" as const,
    },
  },
};

export function MicroHighlight({
  label,
  description,
  index,
}: MicroHighlightProps) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      transition={{ delay: 0.3 + index * 0.08 }}
    >
      <Card className="relative border border-border-subtle/60 bg-surface-elevated/80 p-3 shadow-sm/30 backdrop-blur-md overflow-hidden group cursor-default">
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{
            background: "linear-gradient(135deg, rgba(125, 42, 231, 0.1), rgba(243, 233, 255, 0.05))",
          }}
        />

        <div className="relative z-10">
          <motion.p
            className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-brand"
            animate={{
              opacity: [1, 0.85, 1],
            }}
            transition={{
              duration: 2.5,
              ease: "easeInOut",
              repeat: Infinity,
              delay: index * 0.2,
            }}
          >
            {label}
          </motion.p>
          <motion.p
            className="mt-1 text-[0.78rem] leading-relaxed text-muted"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 + index * 0.08, duration: 0.4 }}
          >
            {description}
          </motion.p>
        </div>

        <motion.div
          className="absolute top-0 right-0 w-20 h-20 bg-brand/5 rounded-full blur-2xl pointer-events-none"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 3,
            ease: "easeInOut",
            repeat: Infinity,
            delay: index * 0.3,
          }}
        />
      </Card>
    </motion.div>
  );
}
