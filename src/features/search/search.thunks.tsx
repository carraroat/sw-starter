import { createAsyncThunk } from "@reduxjs/toolkit";

import { getResults, getDetails } from "./search.api";
import type { SearchState } from "./search.slice";

import type {
  SearchType,
  SearchResult,
  MovieDetails,
  PeopleDetails,
} from "types";

const searchResults = createAsyncThunk<
  SearchResult[],
  void,
  { state: { search: SearchState } }
>(
  "getResults",
  async (_arg, { getState }) => {
    const { searchTerm, type } = getState().search;
    return await getResults(type, searchTerm);
  },
  {
    condition: (_arg, { getState }) => {
      const { searchTerm, type, lastFetched, isSearching } = getState().search;
      return !!(
        searchTerm.trim() &&
        !isSearching &&
        (lastFetched?.type !== type || lastFetched?.searchTerm !== searchTerm)
      );
    },
  }
);

const searchDetails = createAsyncThunk<
  MovieDetails | PeopleDetails | null,
  { type: SearchType; id: string },
  { state: { search: SearchState } }
>(
  "getDetails",
  async ({ type, id }) => {
    return await getDetails(type, id);
  },
  {
    condition: ({ type, id }, { getState }) => {
      const { lastFetched } = getState().search;
      return !!(lastFetched?.id !== id || lastFetched?.type !== type);
    },
  }
);

export { searchResults, searchDetails };
