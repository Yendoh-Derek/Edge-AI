"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export function HeroImage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
      className="hidden lg:flex items-center justify-center"
    >
      <div className="relative w-full max-w-sm">
        <motion.div
          className="absolute inset-0 bg-gradient-to-tr from-brand/20 via-brand/10 to-transparent rounded-3xl blur-2xl"
          animate={{
            opacity: [0.3, 0.5, 0.3],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 4,
            ease: "easeInOut",
            repeat: Infinity,
          }}
        />

        <div className="relative z-10 rounded-3xl overflow-hidden shadow-xl">
          <div className="aspect-square relative bg-gradient-to-br from-brand-soft to-brand/5">
            <Image
              src="https://images.pexels.com/photos/7974896/pexels-photo-7974896.jpeg?auto=compress&cs=tinysrgb&w=600"
              alt="Young student learning with tablet"
              fill
              className="object-cover object-center"
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-brand/20 via-transparent to-transparent" />

            <motion.div
              className="absolute inset-0 border border-white/30"
              animate={{
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 3,
                ease: "easeInOut",
                repeat: Infinity,
              }}
              style={{
                borderRadius: "1.5rem",
              }}
            />
          </div>
        </div>

        <motion.div
          className="absolute -bottom-6 -right-6 w-32 h-32 bg-brand/10 rounded-full blur-2xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 5,
            ease: "easeInOut",
            repeat: Infinity,
          }}
        />
      </div>
    </motion.div>
  );
}
