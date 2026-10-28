import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router";

// Components
import Navbar from "./components/Navbar";

// Pages
import Home from "./pages/Home";
import CharacterDetails from "./pages/CharacterDetails";
import Favorites from "./pages/Favorites";

// Express API functions
import {
  getFavorites,
  addFavorite,
  removeFavorite,
} from "./services/api";

// Styles
import "./App.css";

function App() {
  // Store favorite character UUIDs from MySQL
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  // Track loading and errors
  const [favoritesLoading, setFavoritesLoading] = useState(true);
  const [favoritesError, setFavoritesError] = useState(false);

  // Prevent duplicate requests from repeated clicks
  const pendingFavorites = useRef(new Set<string>());

  // =========================================
  // Load Favorites from MySQL
  // =========================================

  useEffect(() => {
    let ignore = false;

    async function loadFavorites() {
      try {
        const savedIds = await getFavorites();

        if (!ignore) {
          setFavoriteIds(savedIds);
          setFavoritesError(false);
        }
      } catch (error) {
        console.error("Failed to load favorites:", error);

        if (!ignore) {
          setFavoritesError(true);
        }
      } finally {
        if (!ignore) {
          setFavoritesLoading(false);
        }
      }
    }

    loadFavorites();

    return () => {
      ignore = true;
    };
  }, []);

  // =========================================
  // Add / Remove Favorites using Express
  // =========================================

  const toggleFavorite = useCallback(
    async (id: string) => {
      // Ignore duplicate clicks while request is pending
      if (pendingFavorites.current.has(id)) {
        return;
      }

      pendingFavorites.current.add(id);

      const isFavorite = favoriteIds.includes(id);

      try {
        if (isFavorite) {
          // DELETE /api/favorites/:id
          await removeFavorite(id);

          setFavoriteIds((previous) =>
            previous.filter(
              (favoriteId) => favoriteId !== id
            )
          );
        } else {
          // POST /api/favorites
          await addFavorite(id);

          setFavoriteIds((previous) =>
            previous.includes(id)
              ? previous
              : [...previous, id]
          );
        }
      } catch (error) {
        console.error(
          "Failed to update favorite:",
          error
        );

        window.alert(
          "Could not update favorites. Please try again."
        );
      } finally {
        pendingFavorites.current.delete(id);
      }
    },
    [favoriteIds]
  );

  // =========================================
  // React Router
  // =========================================

  return (
    <BrowserRouter>
      <Navbar />

      {favoritesLoading ? (
        <main className="page-container">
          <p role="status">
            Loading your favorites...
          </p>
        </main>
      ) : favoritesError ? (
        <main className="page-container">
          <p role="alert">
            Unable to load favorites from the server.
          </p>

          <button
            type="button"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </main>
      ) : (
        <Routes>
          {/* Home - Character Explorer */}
          <Route
            path="/"
            element={
              <Home
                favoriteIds={favoriteIds}
                onToggleFavorite={toggleFavorite}
              />
            }
          />

          {/* Character Details */}
          <Route
            path="/characters/:id"
            element={
              <CharacterDetails
                favoriteIds={favoriteIds}
                onToggleFavorite={toggleFavorite}
              />
            }
          />

          {/* Favorites Page */}
          <Route
            path="/favorites"
            element={
              <Favorites
                favoriteIds={favoriteIds}
                onToggleFavorite={toggleFavorite}
              />
            }
          />

          {/* 404 Page */}
          <Route
            path="*"
            element={
              <main className="page-container">
                <h1>404 - Page Not Found</h1>
              </main>
            }
          />
        </Routes>
      )}
    </BrowserRouter>
  );
}

export default App;
