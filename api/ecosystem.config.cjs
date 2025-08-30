module.exports = {
  apps: [
    {
      name: "api",
      script: "dist/index.js",
      env: {
        NODE_ENV: "production",
        PORT: process.env.PORT || 3001,
        SQLITE_DB: process.env.SQLITE_DB || "./data/app.db",
        REDIS_URL: process.env.REDIS_URL || "redis://redis:6379",
      },
    },
    {
      name: "worker",
      script: "dist/worker.js",
      env: {
        NODE_ENV: "production",
        SQLITE_DB: process.env.SQLITE_DB || "./data/app.db",
        REDIS_URL: process.env.REDIS_URL || "redis://redis:6379",
      },
    },
  ],
};
