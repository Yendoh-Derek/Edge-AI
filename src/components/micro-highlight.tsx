"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Card } from "./ui/card";

type MicroHighlightProps = {
  label: string;
  description: string;
  index: number;
};

const containerVariants = {
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

export function MicroHighlight({
  label,
  description,
  index,
}: MicroHighlightProps) {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      transition={{ delay: 0.45 + index * 0.1 }}
    >
      <Card className="relative border border-white/15 bg-gradient-to-br from-white/8 to-white/3 p-4 md:p-5 shadow-lg backdrop-blur-xl overflow-hidden group cursor-default hover:border-white/25 transition-colors"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none"
          animate={{
            opacity: isHovering ? 0.12 : 0,
          }}
          style={{
            background: "linear-gradient(135deg, rgba(125, 42, 231, 0.15), rgba(243, 233, 255, 0.08))",
          }}
        />

        <motion.div
          className="absolute inset-0 rounded-xl pointer-events-none"
          animate={{
            opacity: isHovering ? 0.06 : 0,
          }}
          style={{
            background: "radial-gradient(circle at 30% 30%, rgba(125, 42, 231, 0.2), transparent 60%)",
          }}
        />

        <div className="relative z-10 space-y-2">
          <motion.p
            className="text-[0.65rem] font-semibold uppercase tracking-widest text-brand"
            animate={{
              opacity: isHovering ? 1 : 0.9,
              scale: isHovering ? 1.02 : 1,
            }}
            transition={{
              duration: 0.3,
              ease: "easeOut",
            }}
          >
            {label}
          </motion.p>
          <motion.p
            className="text-xs leading-relaxed text-muted/90"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
          >
            {description}
          </motion.p>
        </div>

        <motion.div
          className="absolute -top-8 -right-8 w-24 h-24 bg-brand/20 rounded-full blur-2xl pointer-events-none"
          animate={{
            scale: isHovering ? [1, 1.3, 1] : [1, 1.15, 1],
            opacity: isHovering ? [0.3, 0.5, 0.3] : [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: isHovering ? 2 : 4,
            ease: "easeInOut",
            repeat: Infinity,
            delay: index * 0.2,
          }}
        />

        <motion.div
          className="absolute inset-0 rounded-xl pointer-events-none"
          animate={{
            boxShadow: isHovering
              ? "inset 0 0 20px rgba(125, 42, 231, 0.08)"
              : "inset 0 0 0px rgba(125, 42, 231, 0)",
          }}
        />
      </Card>
    </motion.div>
  );
}
