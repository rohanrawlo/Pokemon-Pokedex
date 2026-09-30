// PokeAPI layer — covers all ~1025 Pokémon with CDN images, no local downloads.

export interface PokemonListItem {
  name: string;
  url: string;
  id: number;
  image: string;
}

export interface PokemonDetail {
  id: number;
  name: string;
  height: number; // decimetres
  weight: number; // hectograms
  base_experience: number | null;
  types: { slot: number; type: { name: string } }[];
  abilities: { ability: { name: string }; is_hidden: boolean }[];
  stats: { base_stat: number; stat: { name: string } }[];
  sprites: {
    front_default: string | null;
    other?: {
      'official-artwork'?: { front_default: string | null };
      showdown?: { front_default: string | null };
    };
  };
  moves: { move: { name: string } }[];
}

const API = 'https://pokeapi.co/api/v2';

export function idFromUrl(url: string): number {
  const m = url.match(/\/pokemon\/(\d+)\/?$/);
  return m ? parseInt(m[1], 10) : 0;
}

export function artworkForId(id: number): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}

export function spriteForId(id: number): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
}

const LIST_KEY = 'pokedex-list-v1';

export async function fetchAllPokemon(limit = 1025): Promise<PokemonListItem[]> {
  const cached = localStorage.getItem(LIST_KEY);
  if (cached) {
    try {
      const parsed = JSON.parse(cached) as PokemonListItem[];
      if (parsed.length >= 900) return parsed;
    } catch {
      /* ignore */
    }
  }
  const res = await fetch(`${API}/pokemon?limit=${limit}`);
  if (!res.ok) throw new Error(`List fetch failed: ${res.status}`);
  const data = await res.json();
  const items: PokemonListItem[] = data.results.map((r: { name: string; url: string }) => {
    const id = idFromUrl(r.url);
    return { name: r.name, url: r.url, id, image: artworkForId(id) };
  });
  localStorage.setItem(LIST_KEY, JSON.stringify(items));
  return items;
}

const detailCache = new Map<string, PokemonDetail>();

export async function fetchPokemonDetail(nameOrId: string | number): Promise<PokemonDetail> {
  const key = String(nameOrId).toLowerCase();
  if (detailCache.has(key)) return detailCache.get(key)!;
  const res = await fetch(`${API}/pokemon/${key}`);
  if (!res.ok) throw new Error(`Pokémon "${nameOrId}" not found`);
  const data = (await res.json()) as PokemonDetail;
  detailCache.set(key, data);
  detailCache.set(String(data.id), data);
  return data;
}

export async function fetchSpeciesFlavor(nameOrId: string | number): Promise<string> {
  try {
    const res = await fetch(`${API}/pokemon-species/${String(nameOrId).toLowerCase()}`);
    if (!res.ok) return '';
    const data = await res.json();
    const entry = (data.flavor_text_entries as { flavor_text: string; language: { name: string } }[]).find(
      (e) => e.language.name === 'en'
    );
    return entry ? entry.flavor_text.replace(/[\n\f\r]/g, ' ') : '';
  } catch {
    return '';
  }
}

// Strongest by base-stat total — stable hardcoded list (all valid PokeAPI names).
export const FEATURED_NAMES = ['mewtwo', 'rayquaza', 'dialga', 'palkia', 'arceus', 'kyogre'];

export function statTotal(d: PokemonDetail): number {
  return d.stats.reduce((s, x) => s + x.base_stat, 0);
}

export function bestImage(d: PokemonDetail): string {
  return (
    d.sprites.other?.['official-artwork']?.front_default ||
    d.sprites.front_default ||
    artworkForId(d.id)
  );
}

export const TYPE_COLORS: Record<string, string> = {
  normal: '#A8A77A',
  fire: '#EE8130',
  water: '#6390F0',
  electric: '#F7D02C',
  grass: '#7AC74C',
  ice: '#96D9D6',
  fighting: '#C22E28',
  poison: '#A33EA1',
  ground: '#E2BF65',
  flying: '#A98FF3',
  psychic: '#F95587',
  bug: '#A6B91A',
  rock: '#B6A136',
  ghost: '#735797',
  dragon: '#6F35FC',
  dark: '#705746',
  steel: '#B7B7CE',
  fairy: '#D685AD',
};
