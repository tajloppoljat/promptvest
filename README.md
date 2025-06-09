# PromptVest 🚀

A modern prompt management application built with React, Express, and PostgreSQL.

## ✨ Features
- Create and manage prompt collections
- Add, edit, and delete prompts
- Drag-and-drop prompt reordering
- Copy prompts to clipboard
- PIN-protected access
- Modern, responsive UI

## 🚀 Zero-Setup Deployment

**PromptVest is completely self-contained!** No database setup required.

### Deploy to Any Platform:

1. **Push to GitHub**
2. **Connect to your hosting provider** (Vercel, Railway, Render, etc.)
3. **Deploy** - That's it! 🎉

The app includes a pre-configured Neon PostgreSQL database and will work immediately.

### Optional: Use Your Own Database
If you want to use your own database, just set the `DATABASE_URL` environment variable on your hosting platform.

## 🛠️ Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5000`

## 📁 Project Structure
- `client/` - React frontend
- `server/` - Express backend
- `shared/` - Shared TypeScript types and schemas

## 🎯 Tech Stack
- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: Express, TypeScript
- **Database**: PostgreSQL (Neon)
- **ORM**: Drizzle ORM
- **Build**: Vite, esbuild 