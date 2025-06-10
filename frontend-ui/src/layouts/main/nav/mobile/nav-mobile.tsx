"use client";

import type { FC } from "react";

import { Icon } from "@iconify/react";

import { Input } from "@/components/ui/input";
import { useBrowseContext } from "@/sections/browse/context";

import { paths } from "@/routes/paths";
import { usePathname } from "@/routes/hooks";

import { cn } from "@/lib/utils";

import type { DesktopHeaderProps } from "../desktop";
import { UserMenu } from "@/layouts/components";
import Link from "next/link";
import { AIDialogOpener } from "@/sections/search/components";
import { AddProfileDialogOpener } from "@/sections/profile/components/add-profile-opener";

export type MobileNavProps = {
  data: { title: string; href: string; icon?: string }[];
  className?: string;
};

export function MobileHeader() {
  const pathname = usePathname();
  const { search, setSearch } = useBrowseContext();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  return (
    <header className="z-20 bg-white dark:bg-black fixed inset-x-0 top-0 select-none grid grid-cols-3 grid-rows-[repeat(1,calc(var(--mobile-header-height)-1px))] items-center justify-center border-b px-safe-offset-4 md:hidden">
      {/* Left: Beaudelaire Profile */}
      <div className="flex flex-row items-center data-[align=start]:col-start-1 data-[align=start]:[place-self:center_start] data-[align=end]:col-start-3 data-[align=end]:[place-self:center_end]">
        <Link
          href="https://beaudelaire.ca"
          target="_blank"
          rel="noopener noreferrer"
          className="relative rounded outline-none after:pointer-events-none after:absolute after:ring-inset after:ring-transparent after:-inset-px after:rounded-md"
        >
          <Icon icon="mdi:apple" width={24} height={24} />
          <span className="sr-only">Beaudelaire</span>
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
            value={search}
            className="bg-gray-100/85 dark:bg-gray-900/80"
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
      {data.map(({ title, href, icon }) =>
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
