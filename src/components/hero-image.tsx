"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export function HeroImage() {
  const floatingElements = [
    { icon: "📚", delay: 0, x: "15%", y: "10%", duration: 6 },
    { icon: "✏️", delay: 1, x: "-10%", y: "25%", duration: 7 },
    { icon: "💡", delay: 2, x: "85%", y: "15%", duration: 8 },
    { icon: "📊", delay: 0.5, x: "-15%", y: "70%", duration: 7.5 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.3, duration: 0.7, ease: "easeOut" }}
      className="hidden lg:flex items-center justify-center"
    >
      <div className="relative w-full max-w-sm">
        <motion.div
          className="absolute inset-0 bg-gradient-to-tr from-brand/25 via-brand/12 to-transparent rounded-3xl blur-3xl"
          animate={{
            opacity: [0.2, 0.4, 0.2],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 6,
            ease: "easeInOut",
            repeat: Infinity,
          }}
        />

        <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-sm border border-white/20">
          <div className="aspect-square relative bg-gradient-to-br from-brand-soft/50 to-brand/10">
            <Image
              src="https://images.pexels.com/photos/7974896/pexels-photo-7974896.jpeg?auto=compress&cs=tinysrgb&w=600"
              alt="Young student learning with tablet"
              fill
              className="object-cover object-center"
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />

            <motion.div
              className="absolute inset-0 bg-gradient-to-t from-brand/30 via-transparent to-transparent"
              animate={{
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 4,
                ease: "easeInOut",
                repeat: Infinity,
              }}
            />

            <motion.div
              className="absolute inset-0 border border-white/20"
              animate={{
                opacity: [0.2, 0.5, 0.2],
                boxShadow: [
                  "inset 0 0 0px rgba(255,255,255,0)",
                  "inset 0 0 20px rgba(125, 42, 231, 0.2)",
                  "inset 0 0 0px rgba(255,255,255,0)",
                ],
              }}
              transition={{
                duration: 4,
                ease: "easeInOut",
                repeat: Infinity,
              }}
              style={{
                borderRadius: "1.5rem",
              }}
            />
          </div>
        </div>

        {floatingElements.map((element, idx) => (
          <motion.div
            key={idx}
            className="absolute text-3xl"
            style={{
              left: element.x,
              top: element.y,
            }}
            animate={{
              y: [0, 20, -10, 0],
              x: [0, 15, -8, 0],
              rotate: [0, 10, -5, 0],
              opacity: [0.6, 1, 0.7, 0.6],
            }}
            transition={{
              duration: element.duration,
              ease: "easeInOut",
              repeat: Infinity,
              delay: element.delay,
            }}
          >
            {element.icon}
          </motion.div>
        ))}

        <motion.div
          className="absolute -bottom-8 -right-8 w-40 h-40 bg-brand/15 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.25, 0.1],
          }}
          transition={{
            duration: 8,
            ease: "easeInOut",
            repeat: Infinity,
          }}
        />

        <motion.div
          className="absolute -top-8 -left-8 w-32 h-32 bg-brand/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.08, 0.2, 0.08],
          }}
          transition={{
            duration: 7,
            ease: "easeInOut",
            repeat: Infinity,
            delay: 1,
          }}
        />
      </div>
    </motion.div>
  );
}
