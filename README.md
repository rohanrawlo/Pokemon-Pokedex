# 🟡  Pokémon Pokédex — Search All Pokémon

A fast, modern Pokédex web app to search and explore all **1,025 Pokémon** with official artwork,
base stats, types, abilities, and more — plus a **Featured Strongest** showcase.

🔴 **Live:** [https://<your-project-name>.pages.dev](https://71026b27.pokemon-pokedex-3yc.pages.dev/)
<!-- Replace <your-project-name> with the URL Wrangler printed after deploy -->

![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![PokeAPI](https://img.shields.io/badge/Powered_by-PokeAPI-ee1515)

## ✨ Features

- 🔍 **Search all 1,025 Pokémon** by name or ID with instant autocomplete (e.g. `pikachu`, `charizard`, `150`)
- 📇 **Full details modal** — official artwork, types, height/weight, abilities (incl. hidden), base-stat bars + total, flavor text, sample moves
- ⭐ **Featured — Strongest Pokémon** ranked by base-stat total (Mewtwo, Rayquaza, Dialga, Palkia, Arceus, Kyogre)
- 🖼️ **All images included** via official PokeAPI artwork CDN (no local downloads needed)
- 📱 Responsive UI with loading skeletons, error states, and infinite "load more" grid
- ⚡ Client-side caching of the Pokémon list in `localStorage` for fast repeat visits

## 🛠️ Tech Stack

| Layer   | Choice                                   |
|---------|------------------------------------------|
| Framework | React 19 + TypeScript                  |
| Build   | Vite 6                                     |
| Data    | [PokeAPI](https://pokeapi.co) (REST)       |
| Images  | PokeAPI official-artwork CDN               |
| Hosting | Cloudflare Pages                           |


##🖼️ UI
**Home:** <img width="1900" height="868" alt="Screenshot 2026-09-30 223726" src="https://github.com/user-attachments/assets/b9d8374f-4f72-4a2e-9904-f35b7b53149a" />


## 🚀 Run Locally

**Prerequisites:** Node.js 20.19+ or 22, npm 10+, internet access (data + images load live from PokeAPI).

```bash
cd Pokemon
npm install   # first time only
npm run dev   # → http://localhost:5174/
```

Other scripts: `npm run build` (outputs `dist/`), `npm run preview`.

> Always open `http://localhost:5174/` (plain HTTP) — the dev server has no HTTPS.

## ☁️ Deploy (Cloudflare Pages)

```bash
npm run build
npx wrangler login
npx wrangler pages deploy dist --project-name=<your-project-name>
```

Your live URL will be `https://<your-project-name>.pages.dev`.

## 📁 Project Structure

```
Pokemon/
├── index.html
├── package.json / package-lock.json
├── vite.config.ts / tsconfig.json
├── .gitignore
└── src/
    ├── main.tsx
    ├── App.tsx            # layout: hero + search + featured + grid + detail modal
    ├── index.css          # Poké-theme styling
    └── lib/pokeapi.ts     # PokeAPI client, caching, featured list, type colors
```

## 📌 Notes & Limitations

- Requires internet — Pokémon data and artwork stream from PokeAPI/CDN at runtime (nothing bundled offline).
- Dev server is plain HTTP: always open `http://` (not `https://`) for localhost.
- `node_modules/` and `dist/` are git-ignored — never commit them.

## 🙏 Credits

Data & artwork: [PokeAPI](https://pokeapi.co) • Built with React + Vite
