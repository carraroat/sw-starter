import { useParams } from "react-router-dom";

import { DetailsContainer } from "@components";

import type { SearchType } from "@types";

const DetailsPage = () => {
  const params = useParams();
  const type = params.type as SearchType;
  const id = params.id || "";

  return (
    <div className="page details-page">
      <DetailsContainer {...{ type }} {...{ id }} />
    </div>
  );
};

export default DetailsPage;
