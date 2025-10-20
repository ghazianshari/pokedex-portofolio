"use client";

import { PokemonListItem } from "@/types/pokemon";
import { motion } from "framer-motion";
import Image from "next/image";
import { getPokemonImageUrl, getFallbackImage } from "@/lib/pokemon-images";

interface PokemonGridProps {
  pokemon: PokemonListItem[];
  onSelect: (pokemon: PokemonListItem) => void;
}

export function PokemonGrid({ pokemon, onSelect }: PokemonGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {pokemon.map((p, index) => (
        <motion.div
          key={p.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          whileHover={{ scale: 1.05 }}
          onClick={() => onSelect(p)}
          className="bg-white rounded-xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-all duration-200"
        >
          <div className="relative w-24 h-24 mx-auto mb-4">
            <Image
              src={getPokemonImageUrl(p.id)}
              alt={p.name}
              fill
              className="object-contain"
              priority={index < 20} // Only prioritize first 20 images
              unoptimized
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = getFallbackImage(p.id);
              }}
            />
          </div>
          <h3 className="text-center font-semibold text-gray-800 capitalize">
            {p.name}
          </h3>
          <p className="text-center text-sm text-gray-500 mt-1">
            #{p.id.toString().padStart(3, "0")}
          </p>
        </motion.div>
      ))}
    </div>
  );
}
