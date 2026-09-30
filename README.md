# Pokédex — Search All Pokémon

Standalone Vite + React site in `Pokemon/`.

- Search all 1,025 Pokémon by name or ID (live PokeAPI)
- Click any card for full info: image, types, height, weight, abilities, base stats, moves, description
- Featured section: 6 strongest by stat total (Mewtwo, Rayquaza, Dialga, Palkia, Arceus, Kyogre)
- All images via official PokeAPI CDN (no local download needed)

## Run on localhost

```bash
export PATH="$HOME/.local/node/bin:$PATH"
cd Pokemon
npm install   # first time only
npm run dev   # → http://localhost:5174/
```

Data: https://pokeapi.co — Images: https://raw.githubusercontent.com/PokeAPI/sprites/
