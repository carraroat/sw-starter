import type { SearchResult } from "@types";

import "./LinksList.scss";

type LinksListProps = {
  links: SearchResult[];
};

const LinksList = ({ links }: LinksListProps) => {
  return (
    <div className="links">
      {links.map((link: SearchResult) => (
        <span key={link.id}>
          <a href={link.url}>{link.value}</a>
        </span>
      ))}
    </div>
  );
};

export default LinksList;
