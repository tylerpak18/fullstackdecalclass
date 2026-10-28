import type { ApiCharacter } from "./api";
import {
  characters,
  type Character,
} from "../data/characters";

function getText(value: unknown): string {
  return typeof value === "string" && value.trim()
    ? value
    : "Unknown";
}

function getBounty(
  character: ApiCharacter
): number | null {
  const validBounties = (character.bounties ?? []).filter(
    (bounty) =>
      typeof bounty.amount === "number" &&
      Number.isFinite(bounty.amount)
  );

  if (validBounties.length === 0) {
    return null;
  }

  const activeBounties = validBounties.filter(
    (bounty) => bounty.is_active
  );

  const selected =
    activeBounties.length > 0
      ? activeBounties
      : validBounties;

  return Math.max(
    ...selected.map((bounty) => bounty.amount as number)
  );
}

export function normalizeApiCharacter(
  character: ApiCharacter
): Character {
  const name =
    character.name?.en ||
    character.name?.romaji ||
    character.name?.jp ||
    "Unknown Character";

  const extra = character.extra_data ?? {};

  // Preserve the Figma assets and details for
  // Luffy, Zoro and Nami when available.
  const featured = characters.find(
    (item) =>
      item.name.toLowerCase() === name.toLowerCase()
  );

  return {
    // Always use the external API's UUID
    id: character.id,

    name,
    bounty: getBounty(character),

    image:
      featured?.image ??
      character.image_url ??
      "/images/jolly-roger.png",

    fullImage: featured?.fullImage,

    age: character.age,

    height:
      character.height != null
        ? `${character.height} cm`
        : "Unknown",

    status: getText(character.status),

    crew:
      featured?.crew ??
      getText(extra.affiliation),

    role:
      featured?.role ??
      getText(extra.occupation),
  };
}
