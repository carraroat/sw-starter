import { Link } from "react-router-dom";

import type { SearchResult } from "@types";

import "./ResultsList.scss";

type ResultsListProps = {
  results: SearchResult[];
};

const ResultsList = ({ results = [] }: ResultsListProps) => {
  return (
    <ul className="results-list">
      {results.map((result: SearchResult) => (
        <li key={result.id} className="results-list_item">
          <span>{result.value}</span>
          {result.url && (
            <Link className="button" to={result.url}>
              See Details
            </Link>
          )}
        </li>
      ))}
    </ul>
  );
};

export default ResultsList;
