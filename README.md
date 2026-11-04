# VacationHub

A full-stack vacation website. Users browse vacations, like their favorites, get an AI trip recommendation and ask questions about the vacation data. Administrators manage the vacations and see a report of the likes.

**Project link:** https://github.com/ilyaborz23/VacationHub

- **Server:** Node.js + TypeScript + Express, REST API, JWT authentication
- **Database:** PostgreSQL on [Neon](https://neon.tech)
- **Client:** React + TypeScript (Vite), React Router, Tailwind CSS, Recharts
- **AI:** Google Gemini, with an MCP server built into the backend for questions about the database

## Features

**Everyone**

- Register and log in, with validation on the client and on the server
- About page with details about the system and the developer

**Registered users**

- Vacation cards sorted by start date, 9 per page
- Like and unlike vacations, and see the total number of likes
- Filters: all vacations, my likes, active now, not started yet
- AI trip recommendation for any destination
- Questions about the database in plain language, answered through the MCP server

**Administrators**

- Add, edit and delete vacations, with a confirmation before deleting
- Upload vacation images, saved in a folder on the server
- Likes report as a bar chart, and a CSV download that opens in Excel
- Administrators cannot like vacations

## Project structure

```
VacationHub/
├── database/
│   ├── vacations.sql         # Creates the tables and inserts 12 vacations
│   └── image-credits.md      # Authors and licenses of the vacation photos
├── server/                   # Express API
│   ├── images/               # Vacation images
│   ├── .env.example
│   ├── VacationHub.postman_collection.json
│   └── src/
│       ├── app.ts            # Express app and startup
│       ├── db/connect.ts     # Neon connection
│       ├── routes/           # /api/auth, /api/vacations, /api/ai, /api/mcp
│       ├── controllers/      # Request handlers and SQL queries
│       ├── middleware/       # JWT, roles, validation, image upload
│       ├── mcp/              # MCP server and client
│       ├── types/            # User, Vacation
│       └── utils/            # JWT, Gemini, images, dates
└── client/                   # React app
    └── src/
        ├── pages/            # One file per page
        ├── components/       # Layout, cards, forms, route guards
        ├── auth/             # Logged-in user and token
        ├── api.ts            # Calls to the server
        └── styles.ts         # Shared Tailwind classes
```

## Getting started

### Prerequisites

- Node.js 22 or newer
- A free [Neon](https://neon.tech) account
- A [Gemini API key](https://aistudio.google.com/apikey)

### 1. Database

1. Create a project in Neon.
2. Open the **SQL Editor**, paste the whole content of [`database/vacations.sql`](database/vacations.sql) and click **Run**. This creates the tables and adds 12 vacations.
3. Click **Connect** and copy the connection string.

### 2. Server

```bash
cd server
npm install
cp .env.example .env    # then fill in your own values
npm run dev
```

`.env`:

```
DATABASE_URL=postgresql://<user>:<password>@<host>/<database>?sslmode=require
JWT_SECRET=<a long random string>
GEMINI_API_KEY=<your Gemini API key>
PORT=3000
```

The server runs on http://localhost:3000. The `.env` file is in `.gitignore`, so it never reaches GitHub.

### 3. Client

Run the client in a second terminal, and keep the server running:

```bash
cd client
npm install
npm run dev
```

Open http://localhost:5173. Vite forwards `/api` and `/images` requests to the server on port 3000.

### 4. Create an administrator

Registration always creates a regular user. Register on the site, run this in the Neon **SQL Editor**, and then log in again:

```sql
UPDATE users SET role = 'admin' WHERE email = 'your@email.com';
```

## API

Base URL: `http://localhost:3000/api`

Routes marked **User** or **Admin** need the header `Authorization: Bearer <token>`. **Any** means any logged-in user.

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/auth/register` | Public | Create a user and return a token |
| POST | `/auth/login` | Public | Log in and return a token |
| GET | `/vacations?page=1&filter=all` | Any | One page of vacations. `filter` is `all`, `liked`, `active` or `upcoming` |
| GET | `/vacations/:id` | Any | One vacation |
| POST | `/vacations/:id/like` | User | Like a vacation |
| DELETE | `/vacations/:id/like` | User | Remove a like |
| POST | `/vacations` | Admin | Add a vacation (`multipart/form-data`, image required) |
| PUT | `/vacations/:id` | Admin | Edit a vacation (`multipart/form-data`, image optional) |
| DELETE | `/vacations/:id` | Admin | Delete a vacation, its likes and its image |
| GET | `/vacations/report` | Admin | Likes per destination, as JSON |
| GET | `/vacations/report/csv` | Admin | Likes per destination, as a CSV file |
| POST | `/ai/recommendation` | Any | Body: `{ "destination": "Paris" }` |
| POST | `/mcp/ask` | Any | Body: `{ "question": "What is the average price?" }` |

Images are served from `http://localhost:3000/images/<file name>`.

Error responses have the form `{ "error": "..." }`.

All routes are in the Postman collection [`server/VacationHub.postman_collection.json`](server/VacationHub.postman_collection.json). Import it into Postman, set `adminEmail` and `adminPassword`, and run the folders from top to bottom.

## MCP server

The backend includes an MCP server with three read-only tools: `search_vacations`, `get_vacation_statistics` and `get_database_totals`. Gemini calls these tools to answer questions. The tools only return vacation data and total counts, so user emails and passwords stay out of reach.

## Credits

The vacation photos come from Wikimedia Commons. Their authors and licenses are listed in [`database/image-credits.md`](database/image-credits.md).

## Author

**Ilya Borzyh** · [github.com/ilyaborz23](https://github.com/ilyaborz23)
