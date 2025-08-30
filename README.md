# SW Starter

![React](https://img.shields.io/badge/React-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-white?logo=typescript)
![Express](https://img.shields.io/badge/Express.js-lightgrey?logo=express)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)
![Accessible](https://img.shields.io/badge/Accessible-WCAG%202.1%20AA-%2358a55c)
![Responsive](https://img.shields.io/badge/Responsive-Mobile--first-%2300bcd4)

A simple web app to explore the **Star Wars universe**. It lets you search for movies and characters and view their details in a clean, UI-focused interface.

## ✨ Features

- **Search movies** from the Star Wars saga.
- **Find characters** by name and explore their details.
- Display film metadata (title, opening crawl, characters).
- Show character information (name, birth year, gender, etc...).
- Easy to run with Docker. Monorepo built with Typescript.

## 🛠️ Tech Stack

- **Front-end**: React with TypeScript.
- **Build Tool**: Vite.
- **Styling**: SCSS.
- **Back-end**: Express.js with Typescript.
- **Deployment**: Docker & Docker Compose

## 🚀 Getting Started

### Prerequisites

- Node.js **v20+** (recommended)
- [Install Docker](https://docs.docker.com/get-docker/)
- Docker Compose (bundled with Docker Desktop)

### Run with Docker

1. Clone the repository:

   ```
   git clone https://github.com/carraroat/sw-starter.git
   cd sw-starter
   ```

2. Build and launch services:

   ```
   docker compose up --build
   ```

3. Services should be running:

   - **Frontend**: `http://localhost:5173`
   - **API**: `http://localhost:5173/api`
   - **Swagger**: `http://localhost:5173/api/swagger`

## 📂 Project Structure

---

```php
.
├── api/                 # Backend service (Express.js + Typescript)
├  └── Dockerfile        # Dockerfile for API
├── src/                 # Frontend source code (React + TypeScript)
├── public/              # Static assets (favicon)
├── docker-compose.yml   # Docker setup
├── Dockerfile.web       # Dockerfile for frontend
├── vite.config.ts       # Vite build/dev server config
├── tsconfig*.json       # TypeScript configuration
└── README.md            # Documentation

```

## License

This project is licensed under the MIT License.

---

## 💬 Contact

For questions or feedback, open an issue or reach out to carraro.atenas@gmail.com
