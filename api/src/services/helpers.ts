import type { Search, SearchResult } from "@types";

const formatSearchResult = (data: any, type: Search): SearchResult => {
  const props = data?.properties || data?.result?.properties || {};
  const id = data?.uid || data?.result?.uid;
  return {
    id,
    value: props.name || props.title,
    url: `/details/${type}/${id}`,
  };
};

export { formatSearchResult };
