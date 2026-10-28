
const express = require("express");
const mysql = require("mysql2/promise");
const axios = require("axios");

const app = express();
const PORT = Number(process.env.PORT || 3001);

app.use(express.json());

// ======================================
// MySQL Connection
// ======================================

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 5,
});

// ======================================
// One Piece API
// ======================================

const onePieceApi = axios.create({
  baseURL: "https://www.onepieceapi.com/api",
  timeout: 10000,
});

// UUID validation
function isValidUUID(id) {
  return typeof id === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
}

function handleApiError(error, res) {
  console.error("One Piece API error:", error.message);

  if (error.response?.status === 404) {
    return res.status(404).json({
      error: "Character not found",
    });
  }

  return res.status(502).json({
    error: "Failed to fetch One Piece API data",
  });
}

// ======================================
// GET /api/health
// Test Express and MySQL connection
// ======================================

app.get("/api/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");

    res.json({
      status: "ok",
      database: "connected",
    });
  } catch (error) {
    console.error("MySQL error:", error.message);

    res.status(503).json({
      status: "error",
      database: "disconnected",
    });
  }
});

// ======================================
// GET /api/characters
// Retrieve or search characters
// ======================================

app.get("/api/characters", async (req, res) => {
  const { q } = req.query;
  const limit = Number(req.query.limit ?? 20);
  const page = Number(req.query.page ?? 1);

  if (
    (q !== undefined &&
      (typeof q !== "string" || q.length > 100)) ||
    !Number.isInteger(limit) ||
    limit < 1 ||
    limit > 100 ||
    !Number.isInteger(page) ||
    page < 1
  ) {
    return res.status(400).json({
      error: "Invalid search parameters",
    });
  }

  try {
    const response = await onePieceApi.get("/characters", {
      params: {
        q: q || undefined,
        limit,
        page,
      },
    });

    res.json(response.data);
  } catch (error) {
    handleApiError(error, res);
  }
});

// ======================================
// GET /api/characters/:id
// Retrieve individual character
// ======================================

app.get("/api/characters/:id", async (req, res) => {
  const { id } = req.params;

  if (!isValidUUID(id)) {
    return res.status(400).json({
      error: "Invalid character UUID",
    });
  }

  try {
    const response = await onePieceApi.get(
      `/characters/${id}`
    );

    res.json(response.data);
  } catch (error) {
    handleApiError(error, res);
  }
});

// ======================================
// GET /api/favorites
// Retrieve saved character IDs
// ======================================

app.get("/api/favorites", async (req, res) => {
  try {
    const [rows] = await pool.execute(
      `SELECT character_id
       FROM favorite_characters
       ORDER BY saved_at ASC, character_id ASC`
    );

    res.json(
      rows.map((row) => row.character_id)
    );
  } catch (error) {
    console.error("GET favorites error:", error.message);

    res.status(500).json({
      error: "Failed to retrieve favorites",
    });
  }
});

// ======================================
// POST /api/favorites
// Save a favorite character
// ======================================

app.post("/api/favorites", async (req, res) => {
  const { characterId } = req.body || {};

  if (!isValidUUID(characterId)) {
    return res.status(400).json({
      error: "Valid characterId UUID required",
    });
  }

  try {
    const [result] = await pool.execute(
      `INSERT IGNORE INTO favorite_characters
       (character_id) VALUES (?)`,
      [characterId]
    );

    res.status(result.affectedRows === 1 ? 201 : 200).json({
      characterId,
      saved: true,
    });
  } catch (error) {
    console.error("POST favorites error:", error.message);

    res.status(500).json({
      error: "Failed to save favorite",
    });
  }
});

// ======================================
// DELETE /api/favorites/:id
// Remove a favorite character
// ======================================

app.delete("/api/favorites/:id", async (req, res) => {
  const { id } = req.params;

  if (!isValidUUID(id)) {
    return res.status(400).json({
      error: "Invalid character UUID",
    });
  }

  try {
    await pool.execute(
      `DELETE FROM favorite_characters
       WHERE character_id = ?`,
      [id]
    );

    res.json({
      characterId: id,
      saved: false,
    });
  } catch (error) {
    console.error("DELETE favorites error:", error.message);

    res.status(500).json({
      error: "Failed to remove favorite",
    });
  }
});

// ======================================
// Start Express Server
// ======================================

async function startServer() {
  try {
    // Test the MySQL connection
    await pool.query("SELECT 1");

    app.listen(PORT, (error) => {
      if (error) {
        console.error("Express startup error:", error.message);
        process.exitCode = 1;
        return;
      }

      console.log(
        `Express server running at http://localhost:${PORT}`
      );
      console.log("MySQL connected successfully");
    });
  } catch (error) {
    console.error(
      "Failed to connect to MySQL:",
      error.message
    );

    await pool.end();
    process.exitCode = 1;
  }
}

startServer();
