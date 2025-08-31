import Database from "better-sqlite3";
import fs from "fs";
import path from "path";

const DB_PATH: string = process.env.SQLITE_DB || "./data/app.db";
const dir = path.dirname(DB_PATH);

// Initializes the SQLite database and methods for queries and stats.
export const initializeDB = () => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const db: Database.Database = new Database(DB_PATH);

  const runQuery = (query: string, ...args: unknown[]) =>
    db.prepare(query).run(...args);

  const getRow = <T>(query: string): T => db.prepare(query).get() as T;

  const getRows = <T>(query: string): T => db.prepare(query).all() as T;

  runQuery(`CREATE TABLE IF NOT EXISTS queries(
    id TEXT PRIMARY KEY, 
    term TEXT, 
    type TEXT, 
    duration_ms INTEGER, 
    result_count INTEGER, 
    created_at INTEGER NOT NULL DEFAULT (strftime('%s','now')) 
  )`);
  runQuery(`CREATE TABLE IF NOT EXISTS stats(
    id TEXT PRIMARY KEY, 
    data TEXT, 
    updated_at INTEGER NOT NULL DEFAULT (strftime('%s','now'))
  )`);

  return {
    runQuery,
    getRow,
    getRows,
  };
};
