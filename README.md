# AI ChatBot Integration Platform

Phase 1 is the React dashboard for managing chatbot configurations. It currently uses sample data and browser-only React state; the Express API and MongoDB database will be added in Phase 2.

## Run locally

From this project folder, run:

```bash
npm install
npm run dev
```

Open the local address printed by Vite (normally `http://localhost:5173`). Press `Ctrl+C` in the terminal to stop the development server.

## Available checks

```bash
npm run lint
npm run build
```

## Phase 1 features

- Dashboard and chatbot list with Web, WhatsApp, and Slack sample bots
- Create form with required fields, optional details, and inline validation
- Search and platform filtering
- Delete confirmation, loading feedback, empty states, and success/error messages
- Responsive layout and keyboard-friendly controls

Chatbot changes are kept in memory and reset when the page is refreshed. No backend or AI provider is connected yet.
