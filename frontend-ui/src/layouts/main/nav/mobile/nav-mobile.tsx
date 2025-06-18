"use client";

import type { FC } from "react";
import { useCallback, useState, useEffect } from "react";

import { Icon } from "@iconify/react";

import { Input } from "@/components/ui/input";
import { useBrowseContext } from "@/sections/browse/context";
import { useDebounce } from "@/hooks/use-debounce/use-debounce";

import { paths } from "@/routes/paths";
import { usePathname } from "@/routes/hooks";

import { cn } from "@/lib/utils";

import type { DesktopHeaderProps } from "../desktop";
import { UserMenu } from "@/layouts/components";
import Link from "next/link";
import { AIDialogOpener } from "@/sections/search/components";
import { AddProfileDialogOpener } from "@/sections/profile/components/add-profile-opener";
import { CONFIG } from "@/global-config";
import Image from "next/image";

export type MobileNavProps = {
  data: { title: string; href: string; icon?: string }[];
  className?: string;
};

export function MobileHeader() {
  const pathname = usePathname();
  const { search, setSearch } = useBrowseContext();

  // Local state for immediate input updates
  const [localSearchValue, setLocalSearchValue] = useState(search);

  // Sync local value with context when search changes from other sources
  useEffect(() => {
    setLocalSearchValue(search);
  }, [search]);

  // Debounced search to avoid searching on every character
  const { debouncedFn: debouncedSearch } = useDebounce(
    useCallback((value: string) => {
      setSearch(value);
    }, [setSearch]),
    { delay: 400 }
  );

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Update local state immediately for responsiveness
    setLocalSearchValue(value);
    // Debounce the actual search
    debouncedSearch(value);
  }, [debouncedSearch]);

  return (
    <header className="z-20 bg-white dark:bg-black fixed inset-x-0 top-0 select-none grid grid-cols-3 grid-rows-[repeat(1,calc(var(--mobile-header-height)-1px))] items-center justify-center border-b px-safe-offset-4 md:hidden">
      {/* Left: Beaudelaire Profile */}
      <div className="flex flex-row items-center data-[align=start]:col-start-1 data-[align=start]:[place-self:center_start] data-[align=end]:col-start-3 data-[align=end]:[place-self:center_end]">
        <Link
          href="/"
          className="relative rounded outline-none after:pointer-events-none after:absolute after:ring-inset after:ring-transparent after:-inset-px after:rounded-md"
        >
          <Image
              aria-hidden="true"
              alt="Linky"
              width={32}
              height={32}
              src={`${CONFIG.assetsDir}/logo/logo.svg`}
            />
          <span className="sr-only">Linky</span>
        </Link>
      </div>

      {/* Center: Branding */}
      <p className="col-start-2 place-self-center text-[17px] font-semibold">
        {pathname === "/"
          ? "Linky"
          : pathname.slice(1).charAt(0).toUpperCase() + pathname.slice(2)}
      </p>

      {/* Right: Login/Profile Button */}
      <div className="flex flex-row items-center justify-end data-[align=end]:col-start-3 data-[align=end]:[place-self:center_end]">
        <UserMenu />
      </div>

      {pathname === paths.browse.root && (
        <div className="col-span-3 pb-4 pt-1.5">
          <Input
            placeholder="Search Profiles..."
            value={localSearchValue}
            className="bg-black/[0.06] dark:bg-white/[0.08]"
            onChange={handleSearchChange}
          />
        </div>
      )}
    </header>
  );
}

export const MobileNav: FC<DesktopHeaderProps> = ({
  data,
  className,
}: MobileNavProps) => {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        "z-30 bg-white dark:bg-black fixed inset-x-0 bottom-0 h-[calc(var(--mobile-tab-bar-height)-1px)] select-none flex min-w-full flex-row justify-evenly border-t py-[5px] md:hidden",
        className,
      )}
    >
      {data
      .filter(({ href }) => href !== paths.cv.edit)
      .map(({ title, href, icon }) =>
        href === paths.search.root ? (
          <AIDialogOpener key={title} />
        ) : href === paths.people.root ? (
          <AddProfileDialogOpener key={title} />
        ) : (
          <Link
            key={title}
            href={href}
            className={cn(
              "rounded relative outline-none flex flex-1 flex-col items-center justify-center gap-[5px] [-webkit-touch-callout:_none] text-gray-500 dark:text-gray-400 transition-colors",
              pathname === href && "text-black dark:text-white",
              "after:pointer-events-none after:absolute after:ring-inset after:ring-transparent after:-inset-1 after:rounded-[inherit]",
            )}
          >
            {icon && (
              <Icon
                icon={icon}
                width={28}
                height={28}
                className="h-7 w-7 shrink-0"
              />
            )}
            <p className="pb-0.75 text-[10px] font-medium leading-none tracking-wide">
              {title}
            </p>
          </Link>
        ),
      )}
    </nav>
  );
};
