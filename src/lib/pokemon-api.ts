import { Pokemon, PokemonListResponse } from '@/types/pokemon';

const BASE_URL = 'https://pokeapi-proxy.freecodecamp.rocks/api/pokemon';

export async function getAllPokemon(): Promise<PokemonListResponse> {
    const response = await fetch(BASE_URL);
    if (!response.ok) {
        throw new Error('Failed to fetch Pokémon list');
    }
    return response.json();
}

export async function getPokemonById(id: number): Promise<Pokemon> {
    const response = await fetch(`${BASE_URL}/${id}`);
    if (!response.ok) {
        throw new Error('Failed to fetch Pokémon details');
    }
    return response.json();
}

export async function searchPokemon(query: string): Promise<PokemonListResponse> {
    const allPokemon = await getAllPokemon();
    const filtered = allPokemon.results.filter(pokemon =>
        pokemon.name.toLowerCase().includes(query.toLowerCase()) ||
        pokemon.id.toString() === query
    );
    return {
        count: filtered.length,
        results: filtered
    };
}