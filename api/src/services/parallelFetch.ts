import { formatSearchResult } from "./helpers.js";
import { httpClient } from "./httpClient.js";

import type { Search, SearchResult } from "@types";

type CacheValue = { data: SearchResult; expiresAt: number };
const cache = new Map<string, CacheValue>();
const TTL_MS = 5 * 60_000;

const getCached = (url: string) => {
  const hit = cache.get(url);
  if (hit && hit.expiresAt > Date.now()) return hit.data;
  if (hit) cache.delete(url);
  return undefined;
};

const setCached = (url: string, data: SearchResult) => {
  cache.set(url, { data, expiresAt: Date.now() + TTL_MS });
};

// Fetches multiple urls in parallel by memory-caching.
const parallelFetch = async (
  urls: string[],
  type: Search
): Promise<(SearchResult | undefined)[]> => {
  const unique = Array.from(new Set(urls));
  const resultMap = new Map<string, SearchResult>();
  const toFetch: string[] = [];

  for (const url of unique) {
    const hit = getCached(url);
    if (hit) resultMap.set(url, hit);
    else toFetch.push(url);
  }

  if (toFetch.length) {
    const fetched = await Promise.all(
      toFetch.map(async (url) => {
        const res = await httpClient.get(url);
        const data = formatSearchResult(res?.data, type) as SearchResult;
        setCached(url, data);
        return { url, data };
      })
    );
    for (const { url, data } of fetched) resultMap.set(url, data);
  }

  return urls.map((u) => resultMap.get(u));
};

export { parallelFetch };
