# Perficient Hackathon

Monorepo project with React frontend and Node.js + Supabase backend.

## 📁 Project Structure

```
perficient-hackathon/
├── frontend/          # React + Vite application
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Page components
│   │   ├── services/     # API and Supabase services
│   │   ├── hooks/        # Custom React hooks
│   │   ├── utils/        # Utility functions
│   │   ├── App.jsx       # Main app component
│   │   └── main.jsx      # Entry point
│   └── package.json
├── backend/           # Node.js + Express + Supabase
│   ├── src/
│   └── package.json
└── package.json       # Root workspace configuration
```

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0

### Installation

1. Clone the repository
2. Install all dependencies:
   ```bash
   npm install
   ```

### Development

Run both frontend and backend concurrently:
```bash
npm run dev
```

Or run them separately:

**Frontend only:**
```bash
npm run dev:frontend
```
The frontend will be available at `http://localhost:5173`

**Backend only:**
```bash
npm run dev:backend
```

## 📝 Environment Variables

### Frontend
Create a `.env` file in the `frontend/` directory based on `.env.example`:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_URL=http://localhost:3000
```

### Backend
Create a `.env` file in the `backend/` directory with your configuration.

## 🛠️ Available Scripts

- `npm run dev` - Run both frontend and backend
- `npm run dev:frontend` - Run frontend only
- `npm run dev:backend` - Run backend only
- `npm run build` - Build frontend for production
- `npm run clean` - Remove all node_modules

## 🏗️ Tech Stack

### Frontend
- React 18
- Vite
- React Router
- Supabase Client

### Backend
- Node.js
- Express
- Supabase
- dotenv

## 📦 Workspace Management

This project uses npm workspaces for monorepo management. Each package (frontend/backend) can be managed independently while sharing a common root configuration.
