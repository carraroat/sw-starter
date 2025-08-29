import axios from "axios";

import type {
  MovieDetails,
  PeopleDetails,
  SearchResult,
  SearchType,
} from "@types";

const http = axios.create({
  baseURL: "/api",
  timeout: 8000,
});

// Retrieves movies/people by search term
const getResults = async (
  type: SearchType,
  searchTerm: string
): Promise<SearchResult[]> => {
  if (!searchTerm) return [];
  const { data } = await http.get("/search", {
    params: { searchTerm, type },
  });
  return data?.results || [];
};

// Retrieves details of a specific movie or character
const getDetails = async (
  type: SearchType,
  id: string
): Promise<MovieDetails | PeopleDetails | null> => {
  if (!id) return null;
  const { data } = await http.get(`/search/${type}/${id}`);
  return data?.result || null;
};

export { getResults, getDetails };
