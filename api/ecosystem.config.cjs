const env = {
  NODE_ENV: "production",
  SQLITE_DB: process.env.SQLITE_DB || "./data/app.db",
  REDIS_URL: process.env.REDIS_URL || "redis://redis:6379",
  TZ: "America/Mexico_City",
};

module.exports = {
  apps: [
    {
      name: "api",
      script: "dist/index.js",
      env,
    },
    {
      name: "worker",
      script: "dist/worker.js",
      env,
    },
  ],
};
