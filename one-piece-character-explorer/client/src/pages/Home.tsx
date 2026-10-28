import { useEffect, useState } from "react";
import { Search, ChevronDown } from "lucide-react";

import CharacterCard from "../components/CharacterCard";
import { getCharacters } from "../services/api";
import { normalizeApiCharacter } from "../services/characterAdapter";
import type { Character } from "../data/characters";

interface HomeProps {
  favoriteIds: string[];
  onToggleFavorite: (id: string) => void;
}

const featuredCharacters = [
  { query: "luffy", name: "Monkey D. Luffy" },
  { query: "zoro", name: "Roronoa Zoro" },
  { query: "nami", name: "Nami" },
];

export default function Home({
  favoriteIds,
  onToggleFavorite,
}: HomeProps) {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("all");

  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    async function loadCharacters() {
      setLoading(true);
      setError(null);

      try {
        let results: Character[];

        if (search.trim()) {
          // Search the live API
          const response = await getCharacters(
            search.trim(),
            20
          );

          results = response.map(normalizeApiCharacter);
        } else {
          // Load the three featured characters
          const responses = await Promise.all(
            featuredCharacters.map((item) =>
              getCharacters(item.query, 20)
            )
          );

          results = featuredCharacters.map((item, index) => {
            const match = responses[index].find(
              (character) =>
                character.name?.en?.toLowerCase() ===
                item.name.toLowerCase()
            );

            if (!match) {
              throw new Error(
                `Could not find ${item.name}`
              );
            }

            return normalizeApiCharacter(match);
          });
        }

        if (!ignore) {
          setCharacters(results);
        }
      } catch (err) {
        console.error("Failed to load characters:", err);

        if (!ignore) {
          setError("Unable to load characters. Please try again.");
          setCharacters([]);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    const timeout = window.setTimeout(
      loadCharacters,
      300
    );

    return () => {
      ignore = true;
      window.clearTimeout(timeout);
    };
  }, [search]);

  // Sort only the currently loaded characters
  const sortedCharacters = [...characters].sort((a, b) => {
    if (sort === "all") return 0;

    // Unknown bounties appear last
    if (a.bounty === null) return 1;
    if (b.bounty === null) return -1;

    if (sort === "highest") {
      return b.bounty - a.bounty;
    }

    return a.bounty - b.bounty;
  });

  return (
    <main className="page-container">
      <section className="hero">
        <h1>Explore The Grand Line</h1>
        <p>
          Discover characters, explore their bounties,
          and save your favorites
        </p>
      </section>

      <section className="search-section">
        <div className="search-box">
          <Search size={24} />

          <input
            type="text"
            placeholder="Search Characters..."
            aria-label="Search characters"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="filter-box">
          <select
            aria-label="Sort characters"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="all">
              All Characters
            </option>
            <option value="highest">
              Highest Bounty
            </option>
            <option value="lowest">
              Lowest Bounty
            </option>
          </select>

          <ChevronDown size={20} />
        </div>
      </section>

      <section className="characters-section">
        <h2>
          {search.trim()
            ? "Search Results"
            : "Popular Characters"}
        </h2>

        {loading ? (
          <p role="status" className="empty-results">
            Loading characters...
          </p>
        ) : error ? (
          <p role="alert" className="empty-results">
            {error}
          </p>
        ) : sortedCharacters.length === 0 ? (
          <p className="empty-results">
            No characters found. Try another name.
          </p>
        ) : (
          <div className="character-grid">
            {sortedCharacters.map((character) => (
              <CharacterCard
                key={character.id}
                character={character}
                isFavorite={favoriteIds.includes(
                  character.id
                )}
                onToggleFavorite={onToggleFavorite}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
