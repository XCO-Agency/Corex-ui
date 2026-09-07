import { useState, useEffect, useCallback, useMemo } from "react";

export type UseParamsResultType<T extends Record<string, string> = Record<string, string>> = {
  /**
   * Key-value map of all URL search parameters.
   */
  params: T;
  /**
   * Helper to get a specific search parameter with optional fallback.
   */
  get: (key: string, fallback?: string) => string | undefined;
  /**
   * Shopify store domain (e.g. `store.myshopify.com`) if present in query parameters.
   */
  shop: string | null;
  /**
   * Base64 Shopify App Bridge host parameter if present in query parameters.
   */
  host: string | null;
  /**
   * Merchant locale code (e.g. `en`, `fr`) if present in query parameters.
   */
  locale: string | null;
  /**
   * Update or remove a single URL search parameter without reloading the page.
   */
  setParam: (key: string, value: string | null | undefined) => void;
  /**
   * Update or remove multiple URL search parameters simultaneously.
   */
  setParams: (updates: Record<string, string | null | undefined>) => void;
};

const URL_CHANGE_EVENT = "corex-url-change";

function parseQueryParams<T extends Record<string, string>>(): T {
  if (typeof window === "undefined") {
    return {} as T;
  }
  const searchParams = new URLSearchParams(window.location.search);
  const result: Record<string, string> = {};
  searchParams.forEach((val, key) => {
    result[key] = val;
  });
  return result as T;
}

/**
 * Hook to access and manipulate URL query parameters, specifically optimized for Shopify app embeds.
 * Safely parses Shopify parameters (`shop`, `host`, `locale`, etc.) and handles in-app navigation.
 */
export function useParams<
  T extends Record<string, string> = Record<string, string>,
>(): UseParamsResultType<T> {
  const [params, setParamsState] = useState<T>(() => parseQueryParams<T>());

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleUrlChange = () => {
      setParamsState(parseQueryParams<T>());
    };

    window.addEventListener("popstate", handleUrlChange);
    window.addEventListener(URL_CHANGE_EVENT, handleUrlChange);

    return () => {
      window.removeEventListener("popstate", handleUrlChange);
      window.removeEventListener(URL_CHANGE_EVENT, handleUrlChange);
    };
  }, []);

  const get = useCallback(
    (key: string, fallback?: string): string | undefined => {
      return params[key] ?? fallback;
    },
    [params],
  );

  const shop = useMemo(() => params["shop"] ?? null, [params]);
  const host = useMemo(() => params["host"] ?? null, [params]);
  const locale = useMemo(() => params["locale"] ?? null, [params]);

  const setParams = useCallback(
    (updates: Record<string, string | null | undefined>) => {
      if (typeof window === "undefined") return;

      const searchParams = new URLSearchParams(window.location.search);
      Object.entries(updates).forEach(([key, val]) => {
        if (val === null || val === undefined || val === "") {
          searchParams.delete(key);
        } else {
          searchParams.set(key, val);
        }
      });

      const newQuery = searchParams.toString();
      const newRelativePathQuery = newQuery
        ? `${window.location.pathname}?${newQuery}${window.location.hash}`
        : `${window.location.pathname}${window.location.hash}`;

      try {
        window.history.replaceState(window.history.state, "", newRelativePathQuery);
      } catch {
        // Fallback for restricted contexts
      }

      setParamsState(parseQueryParams<T>());
      window.dispatchEvent(new CustomEvent(URL_CHANGE_EVENT));
    },
    [],
  );

  const setParam = useCallback(
    (key: string, value: string | null | undefined) => {
      setParams({ [key]: value });
    },
    [setParams],
  );

  return {
    params,
    get,
    shop,
    host,
    locale,
    setParam,
    setParams,
  };
}
