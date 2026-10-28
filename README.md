# GRAND LINE – One Piece Character Explorer

A full-stack web application that allows users to explore characters from *One Piece*, view their bounties and character information, and save their favorite characters.

Built for **UC Berkeley's Full Stack DeCal – Project 2: APImagination**.

## Features

- **Character Explorer:** Browse characters from the One Piece universe using data from the One Piece API.
- **Character Search:** Search for characters by name.
- **Bounty Sorting:** Sort displayed characters by highest or lowest bounty.
- **Character Details:** View individual character information, including name, age, height, status, and current bounty.
- **Favorites:** Add or remove characters from a saved collection.
- **Persistent Storage:** Store favorite character IDs in a MySQL database so they remain saved after refreshing the browser.

## Tech Stack

| Category | Technologies |
|---|---|
| Frontend | React, TypeScript, Vite |
| Styling | CSS, Lucide React Icons |
| Routing | React Router |
| API Requests | Axios |
| Backend | Node.js, Express.js |
| Database | MySQL, MySQL2 |
| External API | [One Piece API](https://www.onepieceapi.com/documentation) |
| Design | Figma |

## Project Structure

```text
one-piece-character-explorer/
├── client/
│   ├── public/
│   │   └── images/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.tsx
│   │   │   └── CharacterCard.tsx
│   │   ├── pages/
│   │   │   ├── Home.tsx
│   │   │   ├── CharacterDetails.tsx
│   │   │   └── Favorites.tsx
│   │   ├── services/
│   │   │   ├── api.ts
│   │   │   └── characterAdapter.ts
│   │   ├── data/
│   │   │   └── characters.ts
│   │   ├── App.tsx
│   │   └── App.css
│   └── package.json
├── server/
│   ├── server.js
│   ├── package.json
│   └── .env
└── README.md
```

## Getting Started

### Prerequisites

Make sure the following are installed:

- Node.js 22 or newer and npm
- MySQL Server
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/tylerpak18/fullstackdecalclass.git
cd fullstackdecalclass/one-piece-character-explorer
```

### 2. Set Up MySQL

Log into MySQL with an administrator account:

```bash
mysql -u root -p
```

Create the database and table:

```sql
CREATE DATABASE IF NOT EXISTS grand_line;

USE grand_line;

CREATE TABLE IF NOT EXISTS favorite_characters (
    character_id CHAR(36) PRIMARY KEY,
    saved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

For a fresh setup, create a dedicated application account:

```sql
CREATE USER 'grandline_app'@'localhost'
IDENTIFIED BY 'replace_with_a_secure_password';

GRANT SELECT, INSERT, DELETE
ON grand_line.*
TO 'grandline_app'@'localhost';
```

Replace the example password with a private password of your choice.

### 3. Configure Environment Variables

Create a `.env` file inside the `server` directory:

```dotenv
PORT=3001
DB_HOST=localhost
DB_PORT=3306
DB_USER=grandline_app
DB_PASSWORD=your_app_database_password
DB_NAME=grand_line
```

Use the password you configured for `grandline_app`.

**Never commit your `.env` file or database credentials to GitHub.**

### 4. Install and Start the Backend

In the first terminal:

```bash
cd server
npm install
npm run dev
```

The Express server runs at:

`http://localhost:3001`

### 5. Install and Start the Frontend

In a second terminal, from the project root:

```bash
cd client
npm install
npm run dev
```

Open the local URL displayed by Vite, normally:

`http://localhost:5173`

Keep both servers running while using the application.

## API Endpoints

The Express backend provides the following routes:

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Verify Express and MySQL connectivity |
| GET | `/api/characters` | Retrieve characters, with optional search and pagination |
| GET | `/api/characters/:id` | Retrieve one character by UUID |
| GET | `/api/favorites` | Retrieve saved character IDs |
| POST | `/api/favorites` | Save a character to Favorites |
| DELETE | `/api/favorites/:id` | Remove a character from Favorites |

Example request to save a favorite:

```http
POST /api/favorites
Content-Type: application/json
```

```json
{
  "characterId": "7cc1d5ca-fb8c-46d4-b521-521fc7b28b3c"
}
```

The backend uses parameterized MySQL queries to store and remove favorite character IDs.

## Application Architecture

The React frontend communicates with the Express backend using Axios.

Express handles character-data requests by forwarding them to the external One Piece API. It also manages favorites through MySQL.

```text
React + TypeScript
        |
        | Axios HTTP Requests
        v
Express.js Backend
        |
        |----------------------|
        v                      v
   One Piece API          MySQL Database
   Character Data         Saved Favorites
```

During local development, Vite proxies `/api` requests to the Express server on port 3001.

## Testing

To verify the frontend builds and passes lint checks:

```bash
cd client
npm run build
npm run lint
```

To test the backend health endpoint:

```bash
curl http://localhost:3001/api/health
```

Expected response:

```json
{
  "status": "ok",
  "database": "connected"
}
```

The application can also be tested by searching for a character, opening their details, adding them to Favorites, refreshing the browser, and verifying that the saved character remains available.

## Current Scope

This project is designed for local development and educational use. Favorites are stored as one shared collection, without user accounts or authentication.

Production deployment would require hosting the frontend and backend and configuring persistent database access outside the local development environment.

## Acknowledgments

- [One Piece API](https://www.onepieceapi.com/documentation) — Character information and images.
- [Full Stack DeCal](https://fullstackdecal.com/) — Course and project assignment.
- *One Piece*, created by Eiichiro Oda — Original characters and universe.

This project was created for educational purposes and is not affiliated with the official One Piece franchise.