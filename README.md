# React + Hono Boilerplate

A modern full-stack boilerplate featuring a **React** frontend and a **Hono** backend API, designed for rapid development with type-safe end-to-end communication.

## 🏗️ Project Structure

This repository contains two main applications:

- **`/api`** - Backend API built with Hono, PostgreSQL, and Drizzle ORM
- **`/ui`** - Frontend application built with React, Shadcn/UI, TanStack Router, and TailwindCSS

## 🚀 Key Technologies & Dependencies

### Backend (API)

- **[Hono](https://hono.dev/)** - Ultra-fast web framework for the Edge
- **[Drizzle ORM](https://orm.drizzle.team/)** - TypeScript ORM for PostgreSQL
- **[PostgreSQL](https://www.postgresql.org/)** - Relational database
- **[Zod](https://zod.dev/)** - TypeScript-first schema validation
- **[@hono/zod-validator](https://github.com/honojs/middleware/tree/main/packages/zod-validator)** - Request validation middleware
- **[hono-rate-limiter](https://github.com/honojs/middleware/tree/main/packages/rate-limiter)** - Rate limiting middleware

### Frontend (UI)

- **[React 19](https://react.dev/)** - UI library
- **[TanStack Router](https://tanstack.com/router)** - Type-safe routing
- **[Vite](https://vitejs.dev/)** - Build tool and dev server
- **[TailwindCSS](https://tailwindcss.com/)** - Utility-first CSS framework
- \*\*[shadcn/ui](https://ui.shadcn.com/) - Re-usable component library
- **[React Hook Form](https://react-hook-form.com/)** - Form state management
- **[Zod](https://zod.dev/)** - Schema validation (shared with backend)
- **[Hono Client](https://hono.dev/guides/rpc)** - Type-safe API client

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **PostgreSQL** (v12 or higher)

## 🛠️ Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd react-hono-boilerplate
```

### 2. Database Setup

1. Make sure PostgreSQL is running on your system
2. Create a new database (or use an existing one)

### 3. Backend (API) Setup

1. Navigate to the API directory:

   ```bash
   cd api
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the `api` directory with the following variables:

   ```env
   DB_USER=your_postgres_user
   DB_PASSWORD=your_postgres_password
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=your_database_name
   DB_SCHEMA=public
   API_PORT=3000
   ```

4. Initialize the database (creates tables and seeds initial data):

   ```bash
   npm run seedDatabase
   ```

5. Start the API server:

   ```bash
   npm start
   ```

   The API will be running on `http://localhost:3000` (or the port specified in your `.env` file).

### 4. Frontend (UI) Setup

1. Navigate to the UI directory (in a new terminal):

   ```bash
   cd ui
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the `ui` directory with the following variable:

   ```env
   VITE_API_URL=http://localhost:3000
   ```

   > **Note:** Make sure this URL matches your API server's address and port.

4. Start the development server:

   ```bash
   npm start
   ```

   The UI will be running on `http://localhost:5173` (or the port Vite assigns).

## 🎮 Running the Application

1. **Start the API server:**

   ```bash
   cd api
   npm start
   ```

2. **Start the UI server** (in a separate terminal):

   ```bash
   cd ui
   npm start
   ```

3. **Open your browser** and navigate to the UI URL (typically `http://localhost:5173`)

4. **Explore the application:**
   - The home page welcomes you with a button to navigate to the User Management page
   - The `/user` route provides a full CRUD interface for managing users
   - Create, edit, and delete users through the intuitive UI

## 📚 Available Scripts

### API Scripts

- `npm start` - Start the API server in watch mode
- `npm run compile` - Type-check the TypeScript code
- `npm run format` - Format code using Prettier
- `npm run test` - Run tests
- `npm run db:push` - Push database schema changes
- `npm run db:generate` - Generate database migrations
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Drizzle Studio (database GUI)
- `npm run seedDatabase` - Initialize database with tables and seed data

### UI Scripts

- `npm start` - Start the Vite development server
- `npm run build` - Build for production
- `npm run preview` - Preview the production build
- `npm run compile` - Type-check the TypeScript code
- `npm run format` - Format code using Prettier

## 🔧 Features

- ✅ **Type-safe API communication** - End-to-end type safety between frontend and backend
- ✅ **Form validation** - Zod schemas shared between client and server
- ✅ **Modern UI** - Beautiful, responsive interface with TailwindCSS and shadcn/ui
- ✅ **Database ORM** - Type-safe database queries with Drizzle ORM
- ✅ **Rate limiting** - Built-in API rate limiting (200 requests per minute per IP)
- ✅ **CORS enabled** - Cross-origin requests configured
- ✅ **Request logging** - Comprehensive HTTP request/response logging
- ✅ **Hot reload** - Fast development with watch mode and Vite HMR

## 📝 Project Highlights

- **Shared Type Safety**: The API routes are typed and shared with the frontend, ensuring compile-time safety for all API calls
- **File-based Routing**: TanStack Router uses file-based routing for intuitive route organization
- **Component Library**: Pre-configured with shadcn/ui components for rapid UI development
- **Database Migrations**: Drizzle ORM handles database schema management and migrations

## 🤝 Contributing

This is a boilerplate project. Feel free to fork and customize it for your needs!

## 📄 License

MIT License - You are free to use, modify, and distribute this project as per your needs. Feel free to fork and customize it for your own projects!
