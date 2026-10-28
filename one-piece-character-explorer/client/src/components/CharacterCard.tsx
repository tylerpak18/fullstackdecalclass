import { ArrowRight, Heart } from "lucide-react";
import { Link } from "react-router";
import type { Character } from "../data/characters";

interface CharacterCardProps {
  character: Character;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}

export default function CharacterCard({
  character,
  isFavorite,
  onToggleFavorite,
}: CharacterCardProps) {
  return (
    <article className="character-card">
      <img
        src={character.image}
        alt={character.name}
        className="character-image"
      />

      <div className="character-info">
        <div className="character-heading">
          <h3>{character.name}</h3>

          <button
            type="button"
            className="favorite-icon-button"
            aria-label={
              isFavorite
                ? `Remove ${character.name} from favorites`
                : `Add ${character.name} to favorites`
            }
            aria-pressed={isFavorite}
            onClick={() => onToggleFavorite(character.id)}
          >
            <Heart
              size={16}
              color="#C94B45"
              fill={isFavorite ? "#C94B45" : "none"}
            />
          </button>
        </div>

        <p className="bounty">
          Bounty:{" "}
          {character.bounty !== null
            ? `฿${character.bounty.toLocaleString()}`
            : "Unknown"}
        </p>

        <Link
          to={`/characters/${character.id}`}
          className="details-link"
        >
          View Details
          <ArrowRight size={16} />
        </Link>
      </div>
    </article>
  );
}
