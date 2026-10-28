import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { ArrowLeft, Heart } from "lucide-react";

import { getCharacterById } from "../services/api";
import { normalizeApiCharacter } from "../services/characterAdapter";
import type { Character } from "../data/characters";

interface CharacterDetailsProps {
  favoriteIds: string[];
  onToggleFavorite: (id: string) => void;
}

export default function CharacterDetails({
  favoriteIds,
  onToggleFavorite,
}: CharacterDetailsProps) {
  const { id } = useParams<{ id: string }>();

  const [character, setCharacter] =
    useState<Character | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let ignore = false;

    async function loadCharacter() {
      setLoading(true);
      setError(false);
      setCharacter(null);

      try {
        if (!id) {
          throw new Error("Missing character ID");
        }

        const response = await getCharacterById(id);
        const normalized = normalizeApiCharacter(response);

        if (!ignore) {
          setCharacter(normalized);
        }
      } catch (err) {
        console.error("Failed to load character:", err);

        if (!ignore) {
          setError(true);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadCharacter();

    return () => {
      ignore = true;
    };
  }, [id]);

  if (loading) {
    return (
      <main className="page-container details-page">
        <p role="status">Loading character details...</p>
      </main>
    );
  }

  if (error || !character) {
    return (
      <main className="page-container details-page">
        <div className="character-not-found">
          <h1>Character Unavailable</h1>
          <p>We couldn't load this character.</p>

          <Link to="/" className="back-link">
            <ArrowLeft size={16} />
            Back to Characters
          </Link>
        </div>
      </main>
    );
  }

  const isFavorite = favoriteIds.includes(character.id);

  return (
    <main className="page-container details-page">
      <Link to="/" className="back-link">
        <ArrowLeft size={16} />
        Back to Characters
      </Link>

      <section className="details-card">
        <div className="details-image-container">
          <img
            src={character.fullImage ?? character.image}
            alt={character.name}
            className="details-image"
          />
        </div>

        <div className="details-content">
          <div className="details-header">
            <h1>{character.name}</h1>
            <p>
              {character.crew} - {character.role}
            </p>
          </div>

          <div className="bounty-box">
            <p className="bounty-label">
              CURRENT BOUNTY
            </p>

            <h2>
              {character.bounty !== null
                ? `฿${character.bounty.toLocaleString()}`
                : "Unknown"}
            </h2>
          </div>

          <div className="details-information">
            <h2>Character Information</h2>

            <div className="information-grid">
              <div className="information-item">
                <span>Age</span>
                <strong>
                  {character.age !== null
                    ? `${character.age} years`
                    : "Unknown"}
                </strong>
              </div>

              <div className="information-item">
                <span>Height</span>
                <strong>{character.height}</strong>
              </div>

              <div className="information-item">
                <span>Status</span>
                <strong>{character.status}</strong>
              </div>
            </div>
          </div>

          <button
            type="button"
            className="favorite-button"
            aria-pressed={isFavorite}
            onClick={() =>
              onToggleFavorite(character.id)
            }
          >
            <Heart
              size={18}
              fill={isFavorite ? "#FFFFFF" : "none"}
            />

            {isFavorite
              ? "Remove from Favorites"
              : "Add to Favorites"}
          </button>
        </div>
      </section>
    </main>
  );
}
