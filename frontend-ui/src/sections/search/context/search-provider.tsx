"use client";

import { usePathname } from "next/navigation";
import { Suspense, useState, useEffect } from "react";

import { paths } from "@/src/routes/paths";
import { SplashScreen } from "@/components/loading-screen";
import { useRouter, useSearchParams } from "@/src/routes/hooks";

import { SearchContext } from "./search-context";

type SearchProviderProps = {
  children: React.ReactNode;
};

export function SearchProvider({ children }: SearchProviderProps) {
  return (
    <Suspense fallback={<SplashScreen />}>
      <SearchContainer>{children}</SearchContainer>
    </Suspense>
  );
}

function SearchContainer({ children }: SearchProviderProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const query = searchParams.get("query") || "";

  const [search, setSearch] = useState(query);

  useEffect(() => {
    setSearch(query);
  }, [query]);

  const updateSearch = (value: string) => {
    setSearch(value);
    if (pathname === paths.search) {
      router.push(`/search?query=${encodeURIComponent(value.trim())}`);
    }
  };

  return (
    <SearchContext.Provider value={{ search, setSearch: updateSearch }}>
      {children}
    </SearchContext.Provider>
  );
}
