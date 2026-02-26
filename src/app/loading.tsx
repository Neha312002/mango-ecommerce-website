'use client';

import { motion } from 'framer-motion';

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50 flex items-center justify-center">
      <div className="text-center">
        {/* Animated Mango Loading */}
        <motion.div
          animate={{
            rotate: [0, 360],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="text-8xl mb-6"
        >
          🥭
        </motion.div>

        {/* Loading Text */}
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-2xl font-bold text-[#3D4F42] mb-4"
        >
          Loading Fresh Content...
        </motion.h2>

        {/* Loading Dots */}
        <div className="flex gap-2 justify-center">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-3 h-3 bg-[#ffa62b] rounded-full"
              animate={{
                y: [0, -10, 0],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-gray-600 mt-6"
        >
          Harvesting the freshest mangoes for you...
        </motion.p>
      </div>
    </div>
  );
}
