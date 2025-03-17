"use client";

import { usePathname } from "next/navigation";
import { Suspense, useState, useEffect } from "react";

import { paths } from "@/routes/paths";
import { SplashScreen } from "@/components/loading-screen";
import { useRouter, useSearchParams } from "@/routes/hooks";

import { BrowseContext } from "./browse-context";

type SearchProviderProps = {
  children: React.ReactNode;
};

export function BrowseProvider({ children }: SearchProviderProps) {
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
    if (pathname === paths.browse) {
      router.push(`/search?query=${encodeURIComponent(value.trim())}`);
    }
  };

  return (
    <BrowseContext.Provider value={{ search, setSearch: updateSearch }}>
      {children}
    </BrowseContext.Provider>
  );
}
