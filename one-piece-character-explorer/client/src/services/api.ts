import axios from "axios";

// Our own Express backend
const api = axios.create({
  baseURL: "/api",
  timeout: 10000,
});

// External One Piece character data structure
export interface ApiCharacter {
  id: string;
  name: {
    en: string;
    jp: string;
    romaji: string;
  } | null;
  age: number | null;
  height: number | null;
  status: string;
  image_url: string | null;
  extra_data: Record<string, unknown> | null;
  bounties: {
    id: string;
    amount: number | null;
    is_active: boolean;
  }[];
}

// GET /api/characters
// Fetch characters or search by name
export async function getCharacters(
  query = "",
  limit = 20
): Promise<ApiCharacter[]> {
  const response = await api.get<ApiCharacter[]>(
    "/characters",
    {
      params: {
        q: query || undefined,
        limit,
      },
    }
  );

  return response.data;
}

// GET /api/characters/:id
// Fetch one character by UUID
export async function getCharacterById(
  id: string
): Promise<ApiCharacter> {
  const response = await api.get<ApiCharacter>(
    `/characters/${encodeURIComponent(id)}`
  );

  return response.data;
}

// GET /api/favorites
// Retrieve all saved character UUIDs
export async function getFavorites(): Promise<string[]> {
  const response = await api.get<string[]>(
    "/favorites"
  );

  return response.data;
}

// POST /api/favorites
// Save a character UUID to MySQL
export async function addFavorite(
  characterId: string
): Promise<void> {
  await api.post("/favorites", {
    characterId,
  });
}

// DELETE /api/favorites/:id
// Remove a character UUID from MySQL
export async function removeFavorite(
  characterId: string
): Promise<void> {
  await api.delete(
    `/favorites/${encodeURIComponent(characterId)}`
  );
}
