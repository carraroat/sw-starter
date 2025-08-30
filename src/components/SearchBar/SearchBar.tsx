import { RadioGroup } from "@components";

import type { SearchType } from "@types";
import { SearchOptions } from "@features/search/constants";

import { useAppDispatch, useAppSelector } from "@app/hooks";
import {
  selectSearch,
  setSearchTerm,
  setType,
} from "@features/search/search.slice";
import { searchResults } from "@features/search/search.thunks";

import "./SearchBar.scss";

const SearchBar = () => {
  const dispatch = useAppDispatch();
  const { searchTerm, type, isSearching } = useAppSelector(selectSearch);

  const inputPlaceholder = SearchOptions.find(
    ({ key }) => key === type
  )?.placeholder;

  const onChangeSearchType = (value: SearchType) => {
    dispatch(setType(value));
  };

  const onChangeSearchTerm = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchTerm(event.target.value));
  };

  const onTriggerSearch = () => dispatch(searchResults());

  const onEnterSearch = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      onTriggerSearch();
    }
  };

  return (
    <div className="container search-bar">
      <RadioGroup
        question="What are you searching for?"
        groupName="searchOptions"
        options={SearchOptions}
        selectedOption={type}
        handleChange={onChangeSearchType}
      />
      <input
        id="search-input"
        className="search-input"
        placeholder={inputPlaceholder}
        value={searchTerm}
        onChange={onChangeSearchTerm}
        onKeyDown={onEnterSearch}
      />
      <button
        className="button"
        disabled={!searchTerm}
        onClick={onTriggerSearch}
      >
        {isSearching ? "Searching..." : "Search"}
      </button>
    </div>
  );
};

export default SearchBar;
