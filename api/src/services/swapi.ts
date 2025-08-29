import { httpClient } from "./httpClient.js";
import { formatSearchResult } from "./helpers.js";
import { parallelFetch } from "./parallelFetch.js";

import type { MovieDetails, PeopleDetails, Search, SearchResult } from "@types";

const fetchItem = async (
  type: Search,
  id: string
): Promise<MovieDetails | PeopleDetails> => {
  const { data } = await httpClient.get(`/${type}/${id}`);
  const props = data?.result?.properties || {};
  const base = formatSearchResult(data, type);

  if (type === "films") {
    return {
      ...base,
      openingCrawl: props.opening_crawl,
      characters: await parallelFetch(props.characters || [], "people"),
    };
  }

  return {
    ...base,
    birthYear: props.birth_year,
    gender: props.gender,
    eyeColor: props.eye_color,
    hairColor: props.hair_color,
    height: props.height,
    mass: props.mass,
    movies: await parallelFetch(props.films || [], "films"),
  };
};

const fetchResults = async (
  type: Search,
  queryParam: string
): Promise<SearchResult[]> => {
  const { data } = await httpClient.get(`/${type}${queryParam}`);
  const results = data?.result || [];
  return results.map((result: unknown) => formatSearchResult(result, type));
};

export { fetchItem, fetchResults };
