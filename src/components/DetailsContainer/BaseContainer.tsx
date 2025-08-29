import { LinksList } from "@components";

import type { SearchResult } from "@types";

type BaseContainerProps = {
  title: string;
  leftSubtitle: string;
  rightSubtitle: string;
  leftContent: React.ReactElement;
  links: SearchResult[];
};

const BaseContainer = ({
  title,
  leftSubtitle,
  rightSubtitle,
  leftContent,
  links,
}: BaseContainerProps) => {
  return (
    <>
      <h1>{title}</h1>
      <div className="details-container-sections">
        <div>
          <h2>{leftSubtitle}</h2>
          <hr />
          {leftContent}
        </div>
        <div>
          <h2>{rightSubtitle}</h2>
          <hr />
          <LinksList links={links} />
        </div>
      </div>
    </>
  );
};

export default BaseContainer;
