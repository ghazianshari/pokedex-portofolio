"use client";

import { motion } from "framer-motion";

export function LoadingMore() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex justify-center py-8"
    >
      <div className="flex items-center space-x-3 bg-white rounded-full px-6 py-3 shadow-lg">
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
        <span className="text-gray-700 font-medium">
          Loading more Pokémon...
        </span>
      </div>
    </motion.div>
  );
}
