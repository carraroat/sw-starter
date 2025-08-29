import { formatSearchResult } from "./helpers.js";
import { httpClient } from "./httpClient.js";

import type { Search, SearchResult } from "@types";

//TODO: Improve

type SearchResults = SearchResult;
type CacheValue = { data: SearchResults; expiresAt: number };

const cache = new Map<string, CacheValue>();
const TTL_MS = 5 * 60_000;

const fromCache = (url: string) => {
  const hit = cache.get(url);
  if (hit && hit.expiresAt > Date.now()) return hit.data;
  if (hit) cache.delete(url);
  return undefined;
};

const toCache = (url: string, data: any) => {
  cache.set(url, { data, expiresAt: Date.now() + TTL_MS });
};

const pLimit = async <T>(n: number, tasks: (() => Promise<T>)[]) => {
  const results: T[] = new Array(tasks.length);
  let i = 0;
  const workers = Array(Math.min(n, tasks.length))
    .fill(0)
    .map(async () => {
      while (i < tasks.length) {
        const idx = i++;
        results[idx] = await tasks[idx]();
      }
    });
  await Promise.all(workers);
  return results;
};

export const parallelFetch = async (
  urls: string[],
  type: Search
): Promise<(SearchResult | undefined)[]> => {
  const unique = Array.from(new Set(urls));
  const tasks = unique.map((url) => async () => {
    const cached = fromCache(url);
    if (cached) return { url, data: cached };

    const res = await httpClient.get(url);
    const data = formatSearchResult(res?.data, type);
    toCache(url, data);
    return { url, data };
  });

  const entries = await pLimit(5, tasks);
  const map = new Map(entries.map(({ url, data }) => [url, data]));
  return Array.from(urls.map((u) => map.get(u)));
};
