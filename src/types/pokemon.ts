export interface PokemonListResponse {
    count: number;
    results: PokemonListItem[];
}

export interface PokemonListItem {
    id: number;
    name: string;
    url: string;
}

export interface Pokemon {
    id: number;
    name: string;
    base_experience: number;
    height: number;
    weight: number;
    sprites: PokemonSprites;
    stats: PokemonStat[];
    types: PokemonType[];
    order: number;
}

export interface PokemonSprites {
    back_default: string | null;
    back_female: string | null;
    back_shiny: string | null;
    back_shiny_female: string | null;
    front_default: string | null;
    front_female: string | null;
    front_shiny: string | null;
    front_shiny_female: string | null;
}

export interface PokemonStat {
    base_stat: number;
    effort: number;
    stat: {
        name: string;
        url: string;
    };
}

export interface PokemonType {
    slot: number;
    type: {
        name: string;
        url: string;
    };
}