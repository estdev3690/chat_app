import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function LoadingTimer({ initialSeconds = 20 }) {
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"
      />
      <div className="text-center space-y-2">
        <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
          Please wait, waking up the server...
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          This may take up to {initialSeconds} seconds
        </p>
        <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
          {seconds}s
        </div>
      </div>
    </div>
  );
} 