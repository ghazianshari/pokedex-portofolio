export function getPokemonImageUrl(id: number): string {
    // Use jsdelivr CDN which is more reliable
    return `https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/sprites/pokemon/${id}.png`;
}

export function getFallbackImage(id: number): string {
    // SVG placeholder as fallback
    return `data:image/svg+xml;base64,${btoa(`
    <svg width="96" height="96" xmlns="http://www.w3.org/2000/svg">
      <rect width="96" height="96" fill="#f3f4f6" rx="8"/>
      <circle cx="48" cy="48" r="20" fill="#e5e7eb"/>
      <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#9ca3af" font-family="Arial, sans-serif" font-size="14" font-weight="bold">
        #${id}
      </text>
    </svg>
  `)}`;
}