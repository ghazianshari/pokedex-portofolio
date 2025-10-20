"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, Zap, Shield, Sword, Wind } from "lucide-react";
import { PokemonListItem } from "@/types/pokemon";
import { getPokemonById } from "@/lib/pokemon-api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Image from "next/image";

interface PokemonCardProps {
  pokemon: PokemonListItem;
  onClose: () => void;
}

export function PokemonCard({ pokemon, onClose }: PokemonCardProps) {
  const [details, setDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const data = await getPokemonById(pokemon.id);
        setDetails(data);
      } catch (error) {
        console.error("Error fetching details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [pokemon.id]);

  // NEW: Prevent body scroll when modal is open
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  const getPokemonImageUrl = (id: number) => {
    return `https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/sprites/pokemon/${id}.png`;
  };

  const getStatIcon = (statName: string) => {
    switch (statName) {
      case "hp":
        return <Heart className="w-4 h-4 text-red-500" />;
      case "attack":
        return <Sword className="w-4 h-4 text-orange-500" />;
      case "defense":
        return <Shield className="w-4 h-4 text-blue-500" />;
      case "special-attack":
        return <Zap className="w-4 h-4 text-yellow-500" />;
      case "special-defense":
        return <Shield className="w-4 h-4 text-green-500" />;
      case "speed":
        return <Wind className="w-4 h-4 text-purple-500" />;
      default:
        return null;
    }
  };

  const getTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      normal: "bg-gray-400",
      fighting: "bg-red-600",
      flying: "bg-blue-400",
      poison: "bg-purple-600",
      ground: "bg-yellow-600",
      rock: "bg-yellow-800",
      bug: "bg-green-600",
      ghost: "bg-purple-800",
      steel: "bg-gray-600",
      fire: "bg-red-500",
      water: "bg-blue-500",
      grass: "bg-green-500",
      electric: "bg-yellow-500",
      psychic: "bg-pink-500",
      ice: "bg-blue-200",
      dragon: "bg-purple-500",
      dark: "bg-gray-800",
      fairy: "bg-pink-400",
    };
    return colors[type] || "bg-gray-500";
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="bg-white/95 backdrop-blur-md rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl border border-white/20 pokemon-modal"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header with gradient background */}
          <div className="relative bg-gradient-to-br from-blue-50 to-purple-50 rounded-t-3xl p-8">
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-3 rounded-full bg-white/80 hover:bg-white/90 transition-all duration-200 shadow-lg backdrop-blur-sm z-10"
            >
              <X className="w-5 h-5 text-gray-700" />
            </button>

            <div className="text-center">
              <div className="relative w-40 h-40 mx-auto mb-4">
                {loading ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                  </div>
                ) : (
                  <Image
                    src={getPokemonImageUrl(pokemon.id)}
                    alt={pokemon.name}
                    fill
                    className="object-contain hover:scale-110 transition-transform duration-300"
                    unoptimized
                    onError={() => setImageError(true)}
                  />
                )}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <h2 className="text-4xl font-bold text-gray-800 capitalize mb-2">
                  {pokemon.name}
                </h2>
                <p className="text-gray-600 text-lg font-medium">
                  #{pokemon.id.toString().padStart(3, "0")}
                </p>
              </motion.div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Types */}
            {!loading && details && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-wrap gap-3 justify-center mb-8"
              >
                {details.types.map((type: any, index: number) => (
                  <motion.div
                    key={type.slot}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                  >
                    <Badge
                      className={`${getTypeColor(
                        type.type.name
                      )} text-white capitalize px-4 py-2 text-sm font-semibold rounded-full shadow-md hover:shadow-lg transition-shadow duration-200`}
                    >
                      {type.type.name}
                    </Badge>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* Stats Grid */}
            {!loading && details && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="grid grid-cols-3 gap-6 mb-8 text-center"
              >
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-4">
                  <p className="text-sm text-blue-600 font-medium mb-1">
                    Height
                  </p>
                  <p className="font-bold text-blue-800 text-xl">
                    {details?.height / 10} m
                  </p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-4">
                  <p className="text-sm text-green-600 font-medium mb-1">
                    Weight
                  </p>
                  <p className="font-bold text-green-800 text-xl">
                    {details?.weight / 10} kg
                  </p>
                </div>
                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl p-4">
                  <p className="text-sm text-yellow-600 font-medium mb-1">
                    Base XP
                  </p>
                  <p className="font-bold text-yellow-800 text-xl">
                    {details?.base_experience}
                  </p>
                </div>{" "}
              </motion.div>
            )}

            {/* Base Stats */}
            {!loading && details && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="space-y-6"
              >
                <h3 className="text-xl font-bold text-gray-800 text-center mb-6">
                  Base Stats
                </h3>
                <div className="space-y-4">
                  {details.stats.map((stat: any, index: number) => (
                    <motion.div
                      key={stat.stat.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + index * 0.05 }}
                      className="space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {getStatIcon(stat.stat.name)}
                          <span className="text-sm font-semibold capitalize text-gray-700">
                            {stat.stat.name.replace("-", " ")}
                          </span>
                        </div>
                        <span className="text-sm font-bold text-gray-800">
                          {stat.base_stat}
                        </span>
                      </div>
                      <div className="relative">
                        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{
                              width: `${(stat.base_stat / 255) * 100}%`,
                            }}
                            transition={{
                              delay: 0.7 + index * 0.05,
                              duration: 0.8,
                            }}
                            className="h-full bg-gradient-to-r from-blue-400 to-purple-500 rounded-full"
                            style={{
                              width: `${(stat.base_stat / 255) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
