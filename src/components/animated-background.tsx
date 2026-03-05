"use client";

import { motion } from "framer-motion";

export function AnimatedBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-brand/3 via-transparent to-brand-soft/5"
        animate={{
          backgroundPosition: ["0% 0%", "100% 100%"],
        }}
        transition={{
          duration: 20,
          ease: "linear",
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />

      <svg
        className="absolute inset-0 w-full h-full opacity-15"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="eduGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7d2ae7" stopOpacity="0.08" />
            <stop offset="50%" stopColor="#f3e9ff" stopOpacity="0.03" />
            <stop offset="100%" stopColor="#7d2ae7" stopOpacity="0.08" />
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
              strokeWidth="0.4"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#eduGrid)" />
      </svg>

      <FloatingElement
        delay={0}
        x="8%"
        y="12%"
        size={200}
        opacity={0.06}
        duration={25}
        colorStop={1}
      />
      <FloatingElement
        delay={2.5}
        x="82%"
        y="18%"
        size={220}
        opacity={0.05}
        duration={30}
        colorStop={2}
      />
      <FloatingElement
        delay={5}
        x="12%"
        y="78%"
        size={180}
        opacity={0.055}
        duration={28}
        colorStop={3}
      />
      <FloatingElement
        delay={1}
        x="78%"
        y="72%"
        size={210}
        opacity={0.045}
        duration={32}
        colorStop={4}
      />
      <FloatingElement
        delay={3.5}
        x="50%"
        y="50%"
        size={160}
        opacity={0.04}
        duration={35}
        colorStop={5}
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
  colorStop,
}: {
  delay: number;
  x: string;
  y: string;
  size: number;
  opacity: number;
  duration: number;
  colorStop: number;
}) {
  const colorGradients = [
    "from-brand/50 to-brand-soft/20",
    "from-brand-soft/50 to-brand/20",
    "from-brand/40 to-brand-soft/30",
    "from-brand-soft/40 to-brand/30",
    "from-brand/35 to-brand-soft/25",
  ];

  return (
    <motion.div
      className={`absolute rounded-full bg-gradient-to-br ${colorGradients[colorStop - 1]} blur-3xl`}
      style={{
        width: size,
        height: size,
        left: x,
        top: y,
        opacity,
        transform: "translate(-50%, -50%)",
      }}
      animate={{
        y: [0, 40, -20, 0],
        x: [0, 30, -15, 0],
        scale: [1, 1.15, 0.95, 1],
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
