import { useCallback, useEffect, useState } from 'react';
export function useUrlFilters(keys: readonly string[]) {
  const read = useCallback(() => {
    const query = new URLSearchParams(
      typeof location === 'undefined' ? '' : location.search,
    );
    return Object.fromEntries(keys.map((k) => [k, query.get(k) ?? '']));
  }, [keys]);
  const [filters, setFilters] = useState<Record<string, string>>(read);
  useEffect(() => {
    const restore = () => setFilters(read());
    window.addEventListener('popstate', restore);
    return () => window.removeEventListener('popstate', restore);
  }, [read]);
  const change = (values: Record<string, string>) => {
    const next = { ...read(), ...values };
    setFilters(next);
    const url = new URL(location.href);
    for (const key of keys) {
      if (next[key]) url.searchParams.set(key, next[key]);
      else url.searchParams.delete(key);
    }
    history.pushState(history.state, '', url);
  };
  return { filters, change };
}
