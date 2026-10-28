import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Heart } from "lucide-react";

import CharacterCard from "../components/CharacterCard";
import { getCharacterById } from "../services/api";
import { normalizeApiCharacter } from "../services/characterAdapter";
import type { Character } from "../data/characters";

interface FavoritesProps {
  favoriteIds: string[];
  onToggleFavorite: (id: string) => void;
}

export default function Favorites({
  favoriteIds,
  onToggleFavorite,
}: FavoritesProps) {
  const [savedCharacters, setSavedCharacters] =
    useState<Character[]>([]);

  const [loading, setLoading] = useState(
    favoriteIds.length > 0
  );
  const [error, setError] = useState(false);

  useEffect(() => {
    let ignore = false;

    async function loadFavorites() {
      if (favoriteIds.length === 0) {
        setSavedCharacters([]);
        setLoading(false);
        setError(false);
        return;
      }

      setLoading(true);
      setError(false);

      const results = await Promise.allSettled(
        favoriteIds.map((id) => getCharacterById(id))
      );

      if (ignore) return;

      const successful = results
        .filter(
          (result) => result.status === "fulfilled"
        )
        .map((result) =>
          normalizeApiCharacter(result.value)
        );

      setSavedCharacters(successful);

      if (
        results.some(
          (result) => result.status === "rejected"
        )
      ) {
        setError(true);
      }

      setLoading(false);
    }

    loadFavorites();

    return () => {
      ignore = true;
    };
  }, [favoriteIds]);

  return (
    <main className="page-container favorites-page">
      <section className="favorites-hero">
        <h1>Your Favorite Characters</h1>

        <p>
          Your collection of favorite pirates from
          the Grand Line
        </p>
      </section>

      <section className="favorites-content">
        <div className="favorites-section-heading">
          <h2>Saved Characters</h2>

          <span>
            {savedCharacters.length}{" "}
            {savedCharacters.length === 1
              ? "Favorite"
              : "Favorites"}
          </span>
        </div>

        {loading ? (
          <p role="status">Loading favorites...</p>
        ) : (
          <>
            {error && (
              <p role="alert">
                Some favorites could not be loaded.
              </p>
            )}

            {savedCharacters.length > 0 ? (
              <div className="character-grid">
                {savedCharacters.map((character) => (
                  <CharacterCard
                    key={character.id}
                    character={character}
                    isFavorite={true}
                    onToggleFavorite={onToggleFavorite}
                  />
                ))}
              </div>
            ) : !error ? (
              <div className="favorites-empty">
                <Heart size={44} color="#996515" />

                <h3>No Favorites Yet</h3>

                <p>
                  Start exploring characters and save
                  your favorites here.
                </p>

                <Link to="/" className="explore-button">
                  Explore Characters
                </Link>
              </div>
            ) : null}
          </>
        )}
      </section>
    </main>
  );
}
