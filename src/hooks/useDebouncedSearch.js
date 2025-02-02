import { useDeferredValue, useEffect } from "react";

export default function useDebouncedSearch(
  onSearch,
  query,
  language,
  delay = 600
) {
  const deferredQuery = useDeferredValue(query);

  useEffect(() => {
    const handler = setTimeout(() => {
      onSearch(deferredQuery, language);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [deferredQuery, language, onSearch, delay]);
}
