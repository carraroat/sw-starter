import { ResultsList } from "@components";

import { useAppSelector } from "@app/hooks";
import { selectSearch } from "@features/search/search.slice";

import "./ResultsContainer.scss";

const ResultsContainer = () => {
  const { results, isSearching, error } = useAppSelector(selectSearch);

  const successfulLoad = !isSearching && !results.length && !error;
  const failedLoad = !isSearching && !results.length && error;

  return (
    <div className="container results-container">
      <h1>Results</h1>
      <hr />
      {results.length > 0 && !isSearching ? (
        <ResultsList {...{ results }} />
      ) : (
        <div className="results-container-empty">
          {isSearching && <span>Searching...</span>}
          {failedLoad && <span>{error}</span>}
          {successfulLoad && (
            <>
              <span>There are zero matches.</span>
              <br />
              <span>Use the form to search for People or Movies.</span>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ResultsContainer;
