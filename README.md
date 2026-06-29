# Taskify - Clean & Minimalist Task Management Workspace

**Live Demo**: [taskify-task-management-zeta.vercel.app](https://taskify-task-management-zeta.vercel.app)

Taskify is a modern, fast, and highly legible task management dashboard built with **Next.js (App Router), React, TypeScript, Tailwind CSS, and Prisma with Vercel Postgres (PostgreSQL)**. It is designed with a focus on simplicity, high readability, and clean layout controls.

---

## ✨ Features

- **Color-Coded Dashboard Statistics**:
  - **Total Tasks** (Blue card)
  - **Pending Tasks** (Red card)
  - **Completed Tasks** (Green card)
  - **Workspace Progress** (Linear completion track)
- **Flexible Task Actions**:
  - Create, view, edit, check off, and delete tasks.
  - Nullable descriptions (make task details optional).
  - Attach file URLs or external reference links.
- **Due Date Calculations**:
  - Live warning indicators (e.g., "Due tomorrow", "3 days left", or flashing "2 days overdue").
- **Interactive Calendar View**:
  - A clean, monthly calendar grid displaying due tasks.
  - Clicking any date displays a sidebar list of deadlines.
- **User Profile Management**:
  - Update user name and upload profile pictures stored locally.
- **Native Dark Mode**:
  - Toggle between dark and light themes instantly.
- **Relational Database**:
  - Data persistence managed with Prisma ORM (SQLite locally, PostgreSQL / Neon in production).

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI & Iconography**: React, Tailwind CSS, Lucide React
- **Database ORM**: Prisma Client
- **Database**: SQLite (local) / PostgreSQL & Neon (production)
- **Environment**: Node.js, TypeScript

---

## 🚀 Getting Started

Follow these steps to run the project locally.

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up the Database
For local development (SQLite):
```bash
npx prisma db push
```
For production (PostgreSQL / Neon):
The deployment build script dynamically checks and auto-creates a dedicated `taskify` database on Neon, and routes the database connection to it to avoid schema clashes with other projects.

### 3. Run Development Server
Start the Next.js development server locally:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

### 4. Build for Production
To build the application for optimized production serving:
```bash
npm run build
```
