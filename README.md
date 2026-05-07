# Chef's Lexicon

Chef's Lexicon is a full-stack recipe website for browsing recipes, viewing recipe details, saving favorite recipes, managing user profiles, using a recipe assistant, and managing recipes through an admin dashboard.

## Project Structure

```text
Recipe_Website/
  backend/    Express + TypeScript API
  frontend/   React + Vite + TypeScript client
```

## Requirements

Install these before running the project:

- Node.js 20 or newer
- npm
- MongoDB, either local MongoDB or MongoDB Atlas
- Supabase project, only required for uploaded recipe images

Check Node and npm:

```bash
node -v
npm -v
```

## Open the Project

After receiving or extracting the submitted folder, open the project root:

```bash
cd Recipe_Website
```

If the folder is in a different location, use that path instead:

```bash
cd "Recipe_Website"
```

## Install Dependencies

Install backend dependencies:

```bash
cd backend
npm install
```

Install frontend dependencies:

```bash
cd ../frontend
npm install
```

## Environment Configuration

The backend requires environment configuration for the server port, database connection, authentication secret, and optional image storage service.

For security, real environment values should not be written in this README. Add the required values in a local backend `.env` file before running the server. Keep this file private and do not share real keys publicly.

The frontend uses this API URL by default:

```text
http://localhost:3000/api
```

If the backend runs somewhere else, configure the frontend API URL in a local frontend environment file, then restart the Vite dev server.

## Run in Development

Open two terminals.

Terminal 1, start the backend:

```bash
cd backend
npm run dev
```

Expected output:

```text
MongoDB connected
Server running on port 3000
```

Terminal 2, start the frontend:

```bash
cd frontend
npm run dev
```

Open the Vite URL shown in the terminal, usually:

```text
http://localhost:5173/
```

## Build the Project

Build the backend:

```bash
cd backend
npm run build
```

Build the frontend:

```bash
cd ../frontend
npm run build
```

Preview the built frontend:

```bash
npm run preview
```

## Available Scripts

Backend:

```bash
npm run dev
npm run build
npm start
```

Frontend:

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

## Main Features

- Recipe browsing and category filtering
- Advanced filtering by ingredients, cooking time, and calories
- Recipe detail pages with ingredients and instructions
- User registration and login
- Saved recipe collection
- Profile update, profile image upload, and password change
- Recipe assistant chat
- Admin recipe create, edit, and delete workflow
- Recipe image upload through Supabase Storage

## Troubleshooting

If the frontend cannot load recipes:

- Make sure the backend is running.
- Make sure MongoDB is connected.
- Check that the frontend API URL points to the backend API.

If MongoDB does not connect:

- Check the backend database connection value.
- If using local MongoDB, make sure MongoDB is running.
- If using MongoDB Atlas, check username, password, database access, and IP allowlist.

If image upload fails:

- Check the backend image storage configuration.
- Restart the backend after changing environment configuration.

If authentication fails:

- Check the backend authentication secret.
- Sign out and sign in again.
- Clear browser local storage if an old token is stored.

## Additional Guide

A longer setup and project guide is available at:

```text
frontend/UserGuide.md
```
