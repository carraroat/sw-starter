type SearchType = "films" | "people";

interface SearchResult {
  id: string;
  value: string;
  url: string;
}

interface MovieDetails extends SearchResult {
  openingCrawl: string;
  characters: SearchResult[];
}

interface PeopleDetails extends SearchResult {
  birthYear: string;
  gender: "male" | "female";
  eyeColor: string;
  hairColor: string;
  height: number;
  mass: number;
  movies: SearchResult[];
}

export type { SearchType, SearchResult, MovieDetails, PeopleDetails };
