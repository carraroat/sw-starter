type Search = "films" | "people";

interface SearchResult {
  id: string;
  value: string;
  url: string;
}

interface MovieDetails extends SearchResult {
  openingCrawl: string;
  characters: (SearchResult | undefined)[];
}

interface PeopleDetails extends SearchResult {
  birthYear: string;
  gender: "male" | "female";
  eyeColor: string;
  hairColor: string;
  height: number;
  mass: number;
  movies: (SearchResult | undefined)[];
}

export type { Search, SearchResult, MovieDetails, PeopleDetails };
