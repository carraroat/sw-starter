const Search = {
  Movies: "films",
  People: "people",
};

const SearchOptions = [
  {
    key: Search.People,
    value: "People",
    placeholder: "e.g. Chewbacca, Yoda, Boba Fett",
  },
  {
    key: Search.Movies,
    value: "Movies",
    placeholder: "e.g. A New Hope, The Empire Strikes Back",
  },
];

export { Search, SearchOptions };
