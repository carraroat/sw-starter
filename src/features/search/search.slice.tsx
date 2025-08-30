import { createSlice, type PayloadAction, isAnyOf } from "@reduxjs/toolkit";

import { searchDetails, searchResults } from "./search.thunks";

import type {
  SearchType,
  SearchResult,
  MovieDetails,
  PeopleDetails,
} from "@types";

export type SearchState = {
  // Results
  type: SearchType;
  searchTerm: string;
  results: SearchResult[];
  isSearching: boolean;

  // Details
  details: MovieDetails | PeopleDetails | null;
  isSearchingDetails: boolean;

  // Error and cache
  // Last fetch
  error: string | null;
  lastFetched?: { type?: SearchType; searchTerm?: string; id?: string };
};

const initialState: SearchState = {
  type: "people",
  searchTerm: "",
  results: [],
  isSearching: false,
  error: null,
  details: null,
  isSearchingDetails: false,
};

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
    setType: (state, action: PayloadAction<SearchType>) => {
      state.type = action.payload;
    },
    clearDetails: (state) => {
      state.details = null;
    },
  },
  extraReducers: (builder) => {
    // Pending states
    builder.addMatcher(isAnyOf(searchResults.pending), (state) => {
      state.isSearching = true;
      state.error = null;
    });
    builder.addMatcher(isAnyOf(searchDetails.pending), (state) => {
      state.isSearchingDetails = true;
      state.details = null;
      state.error = null;
    });

    // Fulfilled states
    builder.addMatcher(isAnyOf(searchResults.fulfilled), (state, action) => {
      state.isSearching = false;
      state.results = action.payload;
      state.lastFetched = { type: state.type, searchTerm: state.searchTerm };
    });
    builder.addMatcher(isAnyOf(searchDetails.fulfilled), (state, action) => {
      state.isSearchingDetails = false;
      state.details = action.payload;
      state.lastFetched = {
        type: action.meta.arg.type,
        id: action.meta.arg.id,
      };
    });

    // Error states
    builder.addMatcher(
      isAnyOf(searchResults.rejected, searchDetails.rejected),
      (state, action) => {
        state.isSearching = false;
        state.isSearchingDetails = false;
        state.results = [];
        state.details = null;
        state.error = action.error.message ?? "Failed while retrieving data";
      }
    );
  },
});

export const { setSearchTerm, setType, clearDetails } = searchSlice.actions;
export const searchReducer = searchSlice.reducer;
export const selectSearch = (s: { search: SearchState }) => s.search;
