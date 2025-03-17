import type { FC } from "react";

import Link from "next/link";
import { Icon } from "@iconify/react";
import { useRef, useEffect } from "react";

import { cn } from "@/lib/utils"
import { useCountUp } from "@/hooks";
import { paths } from "@/routes/paths";
import { CONFIG } from "@/global-config";
import { useRouter, usePathname } from "@/routes/hooks";
import { useSearchContext } from "@/sections/search/context";
import Image from "next/image";
import { UserMenu } from "@/layouts/components";

export type DesktopHeaderProps = {
  data: { title: string; href: string }[];
  className?: string;
  totalProfiles?: number;
};

export const DesktopHeader: FC<DesktopHeaderProps> = ({
  data,
  className,
  totalProfiles = 5804335,
}) => {
  const router = useRouter();
  const { search, setSearch } = useSearchContext();
  const pathname = usePathname();
  const isSearchPage = pathname === paths.search;
  const inputRef = useRef(null);

  const { formattedValue } = useCountUp({
    start: 2000000,
    end: totalProfiles,
    duration: 2000,
    formatter: (value) => value.toLocaleString(),
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && search.trim()) {
      router.push(`/search?query=${encodeURIComponent(search.trim())}`);
    }
  };

  useEffect(() => {
    if (isSearchPage && inputRef.current) {
      // @ts-expect-error - Focus on input
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [pathname, isSearchPage]);

  return (
    <header
      className={cn(
        "fixed top-[var(--desktop-header-top)] isolate w-screen select-none px-4 hidden items-center justify-center md:flex z-20",
        className,
      )}
    >
      <nav className="flex flex-col justify-between gap-3 mx-auto h-[var(--desktop-header-height)] w-full max-w-[calc(72rem+2rem)] rounded-xl backdrop-blur-lg py-3 bg-clip-padding shadow-[0_10px_15px_-3px_rgb(0_0_0_/_0.08),_0_4px_6px_-4px_rgb(0_0_0_/_0.08)] dark:bg-clip-border dark:backdrop-saturate-150 border-[0.5px] border-black/[0.13] dark:border-white/[0.13]">
        <div className="flex flex-row flex-nowrap items-center justify-between gap-4 px-3">
          <Link
            href="/"
            className="text-gray-500 dark:text-gray-300 relative outline-none flex flex-row flex-nowrap items-center gap-2.5 whitespace-nowrap rounded-lg text-[0.9375rem] font-[550] leading-none"
          >
            <Image
              aria-hidden="true"
              alt="Linky"
              width={32}
              height={32}
              src={`${CONFIG.assetsDir}/logo/logo.svg`}
            />
            Linky
          </Link>

          {data
            .filter(({ href }) => href !== paths.people.aiSearch)
            .map(({ title, href }) => (
              <Link
                key={href}
                href={href}
                className="text-gray-500 dark:text-gray-300 relative font-medium rounded-lg px-1 text-system-marketing-primary/80 transition-colors duration-250 ease-out hover:text-system-marketing-primary text-[0.9375rem]"
              >
                {title}
              </Link>
            ))}

          <div className="flex flex-row flex-nowrap items-center justify-end gap-3 text-gray-500 dark:text-gray-300">
            <UserMenu />
          </div>
        </div>

        <hr className="border-[0.5px] border-black/[0.13] dark:border-white/[0.13] h-px border-b-0" />

        <div className="px-3 text-gray-500 dark:text-gray-300">
          <div className="relative isolate">
            <div className="absolute left-0 top-0 z-10 flex size-6 items-center justify-center">
              <Icon
                icon="mdi:magnify"
                className="shrink-0 text-system-marketing-primary/60"
                width={20}
                height={20}
              />
            </div>
            <p
              className={cn(
                "pointer-events-none absolute left-8 top-0 z-10 w-full bg-transparent text-[0.9375rem] text-system-marketing-primary/60",
                search ? "hidden" : "",
              )}
            >
              Search over <span className="tabular-nums">{formattedValue}</span>{" "}
              profiles on Linky
            </p>
            <input
              ref={inputRef}
              className="relative outline-none after:pointer-events-none after:absolute after:ring-inset after:ring-transparent data-[focus]:sm:after:ring-1 data-[focus]:sm:after:ring-blue-500 data-[focus]:sm:after:outline data-[focus]:sm:after:outline-3 data-[focus]:sm:after:outline-offset-0 data-[focus]:sm:after:outline-blue-200 data-[focus]:sm:after:dark:outline-blue-700/50 after:inset-0 after:rounded-[inherit] w-full bg-transparent pl-8 text-[0.9375rem] text-system-marketing-primary placeholder:text-system-marketing-primary/60"
              value={search}
              onChange={handleSearchChange}
              onKeyDown={handleKeyDown}
            />
          </div>
        </div>
      </nav>
    </header>
  );
};
