"use client";

import { motion } from "framer-motion";

export function AnimatedBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-brand/5 via-transparent to-brand-soft/8"
        animate={{
          backgroundPosition: ["0% 0%", "100% 100%"],
        }}
        transition={{
          duration: 15,
          ease: "linear",
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />

      <svg
        className="absolute inset-0 w-full h-full opacity-20"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="eduGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7d2ae7" stopOpacity="0.1" />
            <stop offset="50%" stopColor="#f3e9ff" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#7d2ae7" stopOpacity="0.1" />
          </linearGradient>
          <pattern
            id="eduGrid"
            width="80"
            height="80"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 80 0 L 0 0 0 80"
              fill="none"
              stroke="url(#eduGradient)"
              strokeWidth="0.5"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#eduGrid)" />
      </svg>

      <FloatingElement
        delay={0}
        x="10%"
        y="15%"
        size={120}
        opacity={0.08}
        duration={20}
      />
      <FloatingElement
        delay={2}
        x="85%"
        y="20%"
        size={150}
        opacity={0.06}
        duration={25}
      />
      <FloatingElement
        delay={4}
        x="15%"
        y="75%"
        size={100}
        opacity={0.07}
        duration={22}
      />
      <FloatingElement
        delay={1}
        x="75%"
        y="70%"
        size={130}
        opacity={0.05}
        duration={28}
      />
    </div>
  );
}

function FloatingElement({
  delay,
  x,
  y,
  size,
  opacity,
  duration,
}: {
  delay: number;
  x: string;
  y: string;
  size: number;
  opacity: number;
  duration: number;
}) {
  return (
    <motion.div
      className="absolute rounded-full bg-gradient-to-br from-brand/40 to-brand-soft/20 blur-3xl"
      style={{
        width: size,
        height: size,
        left: x,
        top: y,
        opacity,
      }}
      animate={{
        y: [0, 30, 0],
        x: [0, 20, 0],
        scale: [1, 1.1, 1],
      }}
      transition={{
        duration,
        ease: "easeInOut",
        repeat: Infinity,
        delay,
      }}
    />
  );
}
