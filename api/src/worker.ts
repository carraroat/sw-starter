import "dotenv/config";
import { Queue, Worker } from "bullmq";
import { Redis } from "ioredis";
import pino from "pino";

import { initializeDB } from "@lib";
import type { QueryRow } from "@types";

const REDIS_URL: string = process.env.REDIS_URL || "redis://localhost:6379";
const SCHEDULER_TIME: number = 5 * 60 * 1000;
const QUEUE_STATS = "queue_stats";

const log = pino();
const connection = new Redis(REDIS_URL, {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
});
const DB = initializeDB();

const analyzeStats = () => {
  const rows = DB.getRows<
    QueryRow[]
  >(`SELECT term, type, duration_ms, created_at FROM queries
      WHERE created_at >= strftime('%s','now','-7 days')
      ORDER BY created_at DESC`);

  const totalQueries = rows.length;
  const avgRequestTime = totalQueries
    ? Math.round(
        rows.reduce((s, r) => s + (r.duration_ms || 0), 0) / totalQueries
      )
    : 0;

  const termCounts: Record<string, number> = {};
  const hours = Array.from({ length: 24 }, () => 0);

  for (const r of rows) {
    const t = (r.term || "").toLowerCase();
    termCounts[t] = (termCounts[t] || 0) + 1;

    const h = new Date(r.created_at * 1000).getHours();
    if (!Number.isNaN(h)) {
      hours[h]++;
    }
  }

  const topTerms = Object.entries(termCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([term, count]) => ({
      term,
      count,
      percentage: totalQueries ? Math.round((count / totalQueries) * 100) : 0,
    }));

  let mostPopularHour = 0;
  for (let i = 1; i < 24; i++) {
    if (hours[i] > hours[mostPopularHour]) {
      mostPopularHour = i;
    }
  }

  const snapshot = {
    totalQueries,
    avgRequestTime,
    topTerms,
    mostPopularHour,
  };

  DB.runQuery(
    `INSERT OR REPLACE INTO stats(id,data) VALUES('latest',?)`,
    JSON.stringify(snapshot)
  );

  log.info({ snapshot }, "Stats updated");
};

(async () => {
  const queue = new Queue(QUEUE_STATS, { connection });
  const worker = new Worker(QUEUE_STATS, async () => analyzeStats(), {
    connection,
  });

  await queue.add("analyze-stats", {}, { repeat: { every: SCHEDULER_TIME } });
  analyzeStats();

  log.info(`Worker up. Repeatable job scheduled every ${SCHEDULER_TIME}ms.`);
  worker.on("active", (j) => console.log("Worker is active", j.name, j.id));
  worker.on("completed", (j) =>
    console.log("Worker is completed", j.name, j.id)
  );
  worker.on("failed", (j, e) =>
    console.error("Worker failed", j?.name, j?.id, e)
  );
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
