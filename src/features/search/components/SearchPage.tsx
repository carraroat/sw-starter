import { SearchBar, ResultsContainer } from "@components";

import "./SearchPage.scss";

const SearchPage = () => (
  <div className="page search-page">
    <SearchBar />
    <ResultsContainer />
  </div>
);

export default SearchPage;
