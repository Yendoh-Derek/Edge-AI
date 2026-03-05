"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Image from "next/image";

const images = [
  {
    src: "https://images.pexels.com/photos/7974896/pexels-photo-7974896.jpeg?auto=compress&cs=tinysrgb&w=600",
    alt: "Young student learning with tablet",
    label: "Adaptive Learning",
  },
  {
    src: "https://images.pexels.com/photos/5088193/pexels-photo-5088193.jpeg?auto=compress&cs=tinysrgb&w=600",
    alt: "Teacher instructing students in classroom",
    label: "Teacher Insights",
  },
  {
    src: "https://images.pexels.com/photos/8348192/pexels-photo-8348192.jpeg?auto=compress&cs=tinysrgb&w=600",
    alt: "Students collaborating together",
    label: "Collaborative Learning",
  },
];

export function ImageCarousel() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);
  const [autoplay, setAutoplay] = useState(true);

  useEffect(() => {
    if (!autoplay) return;
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
      setDirection(1);
    }, 6000);
    return () => clearInterval(interval);
  }, [autoplay]);

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrent((prev) => (prev + newDirection + images.length) % images.length);
    setAutoplay(false);
    setTimeout(() => setAutoplay(true), 8000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.3, duration: 0.7, ease: "easeOut" }}
      className="hidden lg:flex items-center justify-center"
    >
      <div className="relative w-full max-w-sm group">
        <motion.div
          className="absolute inset-0 bg-gradient-to-tr from-brand/30 via-brand/15 to-transparent rounded-3xl blur-3xl"
          animate={{
            opacity: [0.2, 0.4, 0.2],
            scale: [1, 1.08, 1],
          }}
          transition={{
            duration: 6,
            ease: "easeInOut",
            repeat: Infinity,
          }}
        />

        <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-sm">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={current}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5 }}
              className="aspect-square relative bg-gradient-to-br from-brand-soft to-brand/5"
            >
              <Image
                src={images[current].src}
                alt={images[current].alt}
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
            </motion.div>
          </AnimatePresence>

          <motion.div
            className="absolute bottom-6 left-6 right-6 z-20 bg-black/40 backdrop-blur-md rounded-2xl p-3 border border-white/15"
            animate={{
              opacity: [0.8, 1, 0.8],
            }}
            transition={{
              duration: 3,
              ease: "easeInOut",
              repeat: Infinity,
            }}
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-white/90">
              {images[current].label}
            </p>
          </motion.div>
        </div>

        <div className="mt-8 flex items-center justify-center gap-2">
          {images.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => {
                setDirection(index > current ? 1 : -1);
                setCurrent(index);
                setAutoplay(false);
                setTimeout(() => setAutoplay(true), 8000);
              }}
              className={`h-2 rounded-full transition-all ${
                index === current ? "bg-brand w-6" : "bg-border-subtle/50 w-2 hover:bg-border-subtle"
              }`}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.95 }}
            />
          ))}
        </div>

        <motion.button
          onClick={() => paginate(-1)}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/30 backdrop-blur-md border border-white/20 text-white hover:bg-black/50 transition-colors opacity-0 group-hover:opacity-100"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          ←
        </motion.button>

        <motion.button
          onClick={() => paginate(1)}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/30 backdrop-blur-md border border-white/20 text-white hover:bg-black/50 transition-colors opacity-0 group-hover:opacity-100"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          →
        </motion.button>

        <motion.div
          className="absolute -bottom-8 -right-8 w-40 h-40 bg-brand/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.25, 1],
            opacity: [0.15, 0.3, 0.15],
          }}
          transition={{
            duration: 7,
            ease: "easeInOut",
            repeat: Infinity,
          }}
        />
      </div>
    </motion.div>
  );
}
