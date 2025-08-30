import { useEffect } from "react";
import { Link } from "react-router-dom";

import BaseContainer from "./BaseContainer";

import type { PeopleDetails, MovieDetails, SearchType } from "@types";
import { Search } from "@features/search/constants";

import { useAppDispatch, useAppSelector } from "@app/hooks";
import { selectSearch, clearDetails } from "@features/search/search.slice";
import { searchDetails } from "@features/search/search.thunks";

import "./DetailsContainer.scss";

type DetailsContainerProps = {
  type: SearchType;
  id: string;
};

const DetailsContainer = ({ type, id }: DetailsContainerProps) => {
  const dispatch = useAppDispatch();
  const { details, isSearchingDetails, error } = useAppSelector(selectSearch);
  let Container = null;

  useEffect(() => {
    if (id) {
      dispatch(searchDetails({ type, id }));
    }
    return () => {
      dispatch(clearDetails());
    };
  }, [dispatch, id, type]);

  if (isSearchingDetails) {
    Container = <span className="legend">Searching for details...</span>;
  } else if (details) {
    if (type === Search.People) {
      const _details = details as PeopleDetails;
      const leftContent = (
        <div className="details">
          <span>Birth Year: {_details.birthYear}</span>
          <span>Gender: {_details.gender}</span>
          <span>Eye Color: {_details.eyeColor}</span>
          <span>Hair Color: {_details.hairColor}</span>
          <span>Height: {_details.height}</span>
          <span>Mass: {_details.mass}</span>
        </div>
      );
      Container = (
        <BaseContainer
          title={details.value}
          leftSubtitle="Details"
          rightSubtitle="Movies"
          leftContent={leftContent}
          links={_details.movies}
        />
      );
    } else if (type === Search.Movies) {
      const _details = details as MovieDetails;
      Container = (
        <BaseContainer
          title={details.value}
          leftSubtitle="Details"
          rightSubtitle="Movies"
          leftContent={<pre className="details">{_details.openingCrawl}</pre>}
          links={_details.characters}
        />
      );
    }
  } else if (!isSearchingDetails && error) {
    Container = <span className="legend">{error}</span>;
  }

  return (
    <div className="container details-container">
      {Container}
      <Link className="button" to="/">
        Back to search
      </Link>
    </div>
  );
};

export default DetailsContainer;
