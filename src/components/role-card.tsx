"use client";

import { motion } from "framer-motion";
import { useState } from "react";
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
      duration: 0.6,
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
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isHovering) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setMousePosition({ x, y });
  };

  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => {
    setIsHovering(false);
    setMousePosition({ x: 0.5, y: 0.5 });
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      transition={{ delay: 0.15 + index * 0.1 }}
    >
      <Link href={href} className="group block perspective">
        <motion.div
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          animate={{
            rotateX: isHovering ? (mousePosition.y - 0.5) * 5 : 0,
            rotateY: isHovering ? (mousePosition.x - 0.5) * -5 : 0,
          }}
          transition={{ type: "spring", stiffness: 400, damping: 40 }}
          style={{ perspective: "1200px" }}
        >
          <Card className="relative flex h-full flex-col justify-between gap-4 border border-white/20 bg-gradient-to-br from-white/10 to-white/5 p-5 shadow-lg backdrop-blur-xl md:p-6 overflow-hidden hover:border-white/30 transition-colors">
            <motion.div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
              animate={{
                opacity: isHovering ? 0.15 : 0,
              }}
              style={{
                background: `radial-gradient(circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, rgba(125, 42, 231, 0.2), transparent 50%)`,
              }}
            />

            <motion.div
              className="absolute inset-0 rounded-xl pointer-events-none"
              animate={{
                opacity: isHovering ? 0.08 : 0,
              }}
              style={{
                background: "linear-gradient(135deg, rgba(125, 42, 231, 0.1), rgba(243, 233, 255, 0.05))",
              }}
            />

            <div className="relative z-10 flex items-center gap-4">
              <motion.div
                className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-brand/30 to-brand/10 shadow-lg ring-1 ring-white/40 backdrop-blur-md"
                animate={{
                  scale: isHovering ? 1.1 : 1,
                }}
                transition={{ type: "spring", stiffness: 400, damping: 40 }}
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
                <motion.p
                  className="text-[0.65rem] font-semibold uppercase tracking-widest text-brand/70"
                  animate={{
                    opacity: isHovering ? 1 : 0.7,
                  }}
                >
                  {title === "Teacher" ? "For Teachers" : "For Learners"}
                </motion.p>
                <p className="text-lg font-semibold text-foreground md:text-xl">{title}</p>
              </div>
            </div>

            <motion.p
              className="relative z-10 flex-1 text-sm leading-relaxed text-muted/90"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25 + index * 0.1, duration: 0.5 }}
            >
              {description}
            </motion.p>

            <motion.div
              className="relative z-10 flex items-center justify-between text-sm font-semibold text-brand"
              animate={{
                x: isHovering ? 6 : 0,
              }}
              transition={{ type: "spring", stiffness: 400, damping: 40 }}
            >
              <span className="inline-flex items-center gap-1">
                {title === "Teacher" ? "Enter teacher space" : "Enter learner space"}
              </span>
              <motion.span
                animate={{ x: [0, 6, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                →
              </motion.span>
            </motion.div>

            <motion.div
              className="absolute inset-0 rounded-xl pointer-events-none"
              animate={{
                boxShadow: isHovering
                  ? "inset 0 0 20px rgba(125, 42, 231, 0.1)"
                  : "inset 0 0 0px rgba(125, 42, 231, 0)",
              }}
            />
          </Card>
        </motion.div>
      </Link>
    </motion.div>
  );
}
