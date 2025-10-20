"use client";

import { LoadingMore } from "@/components/loading-more";
import { LoadingSpinner } from "@/components/loading-spinner";
import { PokemonCard } from "@/components/pokemon-card";
import { PokemonGrid } from "@/components/pokemon-grid";
import { SearchBar } from "@/components/search-bar";
import { getAllPokemon } from "@/lib/pokemon-api";
import { PokemonListItem } from "@/types/pokemon";
import { useCallback, useEffect, useRef, useState } from "react";

const ITEMS_PER_PAGE = 200;

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [allPokemon, setAllPokemon] = useState<PokemonListItem[]>([]);
  const [displayedPokemon, setDisplayedPokemon] = useState<PokemonListItem[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [selectedPokemon, setSelectedPokemon] =
    useState<PokemonListItem | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observerTarget = useRef<HTMLDivElement>(null);

  // Load all Pokémon on initial render
  useEffect(() => {
    const loadAllPokemon = async () => {
      try {
        const data = await getAllPokemon();
        setAllPokemon(data.results);
        setDisplayedPokemon(data.results.slice(0, ITEMS_PER_PAGE));
        setHasMore(data.results.length > ITEMS_PER_PAGE);
      } catch (error) {
        console.error("Error loading Pokémon:", error);
      } finally {
        setLoading(false);
      }
    };
    loadAllPokemon();
  }, []);

  // Handle search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim()) {
        const filtered = allPokemon.filter(
          (pokemon) =>
            pokemon.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            pokemon.id.toString() === searchQuery
        );
        setDisplayedPokemon(filtered.slice(0, ITEMS_PER_PAGE));
        setCurrentPage(1);
        setHasMore(filtered.length > ITEMS_PER_PAGE);
      } else {
        // Reset to show all when search is cleared
        setDisplayedPokemon(allPokemon.slice(0, ITEMS_PER_PAGE));
        setCurrentPage(1);
        setHasMore(allPokemon.length > ITEMS_PER_PAGE);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, allPokemon]);

  // Infinite scroll handler
  const loadMorePokemon = useCallback(async () => {
    if (searchQuery.trim() || loadingMore || !hasMore) return;

    setLoadingMore(true);

    try {
      const nextPage = currentPage + 1;
      const startIndex = 0;
      const endIndex = nextPage * ITEMS_PER_PAGE;

      const pokemonToDisplay = allPokemon.slice(startIndex, endIndex);
      setDisplayedPokemon(pokemonToDisplay);
      setCurrentPage(nextPage);

      // Check if there are more to load
      setHasMore(endIndex < allPokemon.length);
    } catch (error) {
      console.error("Error loading more Pokémon:", error);
    } finally {
      setLoadingMore(false);
    }
  }, [allPokemon, currentPage, loadingMore, hasMore, searchQuery]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          !loadingMore &&
          !searchQuery.trim() &&
          hasMore
        ) {
          loadMorePokemon();
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [loadMorePokemon, loadingMore, searchQuery, hasMore]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-200">
      {/* Pokemon-style tricolor bar */}
      <div
        className="w-full h-6 sticky top-0 z-50 flex"
        style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}
      >
        <div className="flex-1" style={{ background: "#ee1515" }} />
        <div className="flex-1" style={{ background: "#222" }} />
        <div className="flex-1" style={{ background: "#fff" }} />
      </div>
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            Pokémon Search
          </h1>
          <p className="text-gray-600 text-lg">
            Discover your favorite Pokémon with detailed information
          </p>
        </header>

        <div className="max-w-2xl mx-auto mb-8">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search by name or ID..."
          />
        </div>

        {displayedPokemon.length > 0 && (
          <>
            <PokemonGrid
              pokemon={displayedPokemon}
              onSelect={setSelectedPokemon}
            />

            {/* Loading more indicator */}
            {loadingMore && <LoadingMore />}

            {/* Infinite scroll trigger */}
            {!searchQuery.trim() && hasMore && !loadingMore && (
              <div ref={observerTarget} className="h-10" />
            )}

            {/* End of results message */}
            {!searchQuery.trim() && !hasMore && (
              <div className="text-center py-8">
                <p className="text-gray-500">
                  You've reached the end! All Pokémon loaded.
                </p>
              </div>
            )}
          </>
        )}

        {searchQuery && displayedPokemon.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No Pokémon found</p>
          </div>
        )}

        {selectedPokemon && (
          <PokemonCard
            pokemon={selectedPokemon}
            onClose={() => setSelectedPokemon(null)}
          />
        )}
      </div>
    </div>
  );
}
