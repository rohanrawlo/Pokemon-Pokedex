import { useEffect, useMemo, useState } from 'react';
import {
  FEATURED_NAMES,
  TYPE_COLORS,
  artworkForId,
  bestImage,
  fetchAllPokemon,
  fetchPokemonDetail,
  fetchSpeciesFlavor,
  statTotal,
  type PokemonDetail,
  type PokemonListItem,
} from './lib/pokeapi';

const PAGE_SIZE = 48;

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export default function App() {
  const [all, setAll] = useState<PokemonListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [query, setQuery] = useState('');
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [showSuggest, setShowSuggest] = useState(false);

  const [featured, setFeatured] = useState<PokemonDetail[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [detail, setDetail] = useState<PokemonDetail | null>(null);
  const [flavor, setFlavor] = useState('');
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const list = await fetchAllPokemon(1025);
        setAll(list);
      } catch (e) {
        setLoadError(e instanceof Error ? e.message : 'Failed to load Pokémon list');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const results = await Promise.all(FEATURED_NAMES.map((n) => fetchPokemonDetail(n)));
        results.sort((a, b) => statTotal(b) - statTotal(a));
        setFeatured(results);
      } catch {
        /* featured optional */
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return all;
    return all.filter((p) => p.name.includes(q) || String(p.id) === q);
  }, [all, query]);

  const suggestions = useMemo(() => filtered.slice(0, 8), [filtered]);

  useEffect(() => {
    setVisible(PAGE_SIZE);
  }, [query]);

  async function openDetail(name: string) {
    setSelected(name);
    setDetail(null);
    setFlavor('');
    setDetailError('');
    setDetailLoading(true);
    setShowSuggest(false);
    try {
      const [d, f] = await Promise.all([fetchPokemonDetail(name), fetchSpeciesFlavor(name)]);
      setDetail(d);
      setFlavor(f);
    } catch (e) {
      setDetailError(e instanceof Error ? e.message : 'Not found');
    } finally {
      setDetailLoading(false);
    }
  }

  function closeDetail() {
    setSelected(null);
    setDetail(null);
  }

  return (
    <div className="app">
      <header className="hero">
        <div className="hero-inner">
          <div className="logo-row">
            <span className="pokeball" aria-hidden />
            <h1>
              Poké<span>dex</span>
            </h1>
          </div>
          <p className="subtitle">Search all 1,025 Pokémon — info, stats, types & official artwork</p>

          <div className="search-wrap">
            <input
              className="search"
              placeholder="Search Pokémon by name or ID… e.g. pikachu, charizard, 150"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setShowSuggest(true);
              }}
              onFocus={() => setShowSuggest(true)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && suggestions.length > 0) openDetail(suggestions[0].name);
                if (e.key === 'Escape') setShowSuggest(false);
              }}
            />
            {query && (
              <button className="clear" onClick={() => setQuery('')} aria-label="Clear search">
                ✕
              </button>
            )}
            {showSuggest && query.trim() && suggestions.length > 0 && (
              <div className="suggest">
                {suggestions.map((s) => (
                  <button key={s.id} className="suggest-item" onClick={() => openDetail(s.name)}>
                    <img src={artworkForId(s.id)} alt="" loading="lazy" onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${s.id}.png`;
                    }} />
                    <span>#{String(s.id).padStart(3, '0')} {capitalize(s.name)}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="stats-line">
            {loading ? 'Loading Pokédex…' : `${filtered.length} / ${all.length} Pokémon`}
            {loadError && <span className="error"> — {loadError}</span>}
          </div>
        </div>
      </header>

      <main className="main">
        <section>
          <h2 className="section-title">⭐ Featured — Strongest Pokémon</h2>
          <p className="section-sub">Ranked by base-stat total (legendaries & mythicals)</p>
          <div className="featured-grid">
            {featured.length === 0 && <div className="skeleton-row">Loading strongest…</div>}
            {featured.map((f, i) => (
              <button key={f.id} className="featured-card" onClick={() => openDetail(f.name)}>
                <div className="rank">#{i + 1}</div>
                <img src={bestImage(f)} alt={f.name} loading="lazy" />
                <div className="fname">{capitalize(f.name)}</div>
                <div className="ftotal">Total {statTotal(f)}</div>
                <div className="types">
                  {f.types.map((t) => (
                    <span key={t.type.name} className="type" style={{ background: TYPE_COLORS[t.type.name] || '#888' }}>
                      {t.type.name}
                    </span>
                  ))}
                </div>
              </button>
            ))}
          </div>
        </section>

        <section>
          <h2 className="section-title">All Pokémon</h2>
          <div className="grid">
            {filtered.slice(0, visible).map((p) => (
              <button key={p.id} className="card" onClick={() => openDetail(p.name)}>
                <img
                  src={p.image}
                  alt={p.name}
                  loading="lazy"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${p.id}.png`;
                  }}
                />
                <div className="pid">#{String(p.id).padStart(3, '0')}</div>
                <div className="pname">{capitalize(p.name)}</div>
              </button>
            ))}
          </div>
          {!loading && filtered.length === 0 && (
            <div className="empty">
              No Pokémon found for “{query}”. Try “pikachu”, “eevee” or “150”.
            </div>
          )}
          {visible < filtered.length && (
            <div className="more-wrap">
              <button className="more" onClick={() => setVisible((v) => v + PAGE_SIZE)}>
                Load more ({filtered.length - visible} remaining)
              </button>
            </div>
          )}
        </section>
      </main>

      <footer className="footer">
        Data & images: <a href="https://pokeapi.co" target="_blank" rel="noreferrer">PokeAPI</a> • Artwork CDN: PokeAPI sprites • Built with React + Vite
      </footer>

      {selected && (
        <div className="modal-backdrop" onClick={closeDetail}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeDetail}>✕</button>
            {detailLoading && <div className="modal-loading">Loading {selected}…</div>}
            {detailError && <div className="error">⚠ {detailError}</div>}
            {detail && (
              <>
                <div className="modal-head">
                  <img src={bestImage(detail)} alt={detail.name} />
                  <div>
                    <div className="modal-id">#{String(detail.id).padStart(3, '0')}</div>
                    <h2 className="modal-name">{capitalize(detail.name)}</h2>
                    <div className="types">
                      {detail.types.map((t) => (
                        <span key={t.type.name} className="type" style={{ background: TYPE_COLORS[t.type.name] || '#888' }}>
                          {t.type.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                {flavor && <p className="flavor">{flavor}</p>}
                <div className="meta-grid">
                  <div><b>Height</b><span>{(detail.height / 10).toFixed(1)} m</span></div>
                  <div><b>Weight</b><span>{(detail.weight / 10).toFixed(1)} kg</span></div>
                  <div><b>Base XP</b><span>{detail.base_experience ?? '—'}</span></div>
                  <div><b>Stat total</b><span>{statTotal(detail)}</span></div>
                </div>
                <h3>Abilities</h3>
                <div className="chips">
                  {detail.abilities.map((a) => (
                    <span key={a.ability.name} className="chip">
                      {a.ability.name.replace(/-/g, ' ')}{a.is_hidden ? ' (hidden)' : ''}
                    </span>
                  ))}
                </div>
                <h3>Base stats</h3>
                <div className="stats">
                  {detail.stats.map((s) => (
                    <div key={s.stat.name} className="stat-row">
                      <span className="stat-name">{s.stat.name.replace(/-/g, ' ')}</span>
                      <div className="bar"><div className="fill" style={{ width: `${Math.min(100, (s.base_stat / 180) * 100)}%` }} /></div>
                      <span className="stat-val">{s.base_stat}</span>
                    </div>
                  ))}
                </div>
                <h3>Moves (sample)</h3>
                <div className="chips">
                  {detail.moves.slice(0, 12).map((m) => (
                    <span key={m.move.name} className="chip small">{m.move.name.replace(/-/g, ' ')}</span>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
