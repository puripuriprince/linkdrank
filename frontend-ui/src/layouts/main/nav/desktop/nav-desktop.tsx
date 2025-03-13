import { FC, useState } from "react";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {useCountUp} from "@/src/hooks";
import {CONFIG} from "@/src/global-config";
import {useRouter, useSearchParams} from "@/src/routes/hooks";

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

    const searchParams = useSearchParams();
    const [search, setSearch] = useState(searchParams.get("query") || "");
    const router = useRouter();

    const { formattedValue } = useCountUp({
        start: 2000000,
        end: totalProfiles,
        duration: 2000,
        formatter: (value) => value.toLocaleString(),
    });

    const handleSearchSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && search.trim() !== "") {
            router.push(`/search?query=${encodeURIComponent(search.trim())}`);
        }
    };

    return (
        <header
            className={cn('fixed top-[var(--desktop-header-top)] isolate w-screen select-none px-4 hidden items-center justify-center md:flex z-[1000]', className)}
        >
            <nav
                className="flex flex-col justify-between gap-3 mx-auto h-[var(--desktop-header-height)] w-full max-w-[calc(72rem+2rem)] rounded-xl backdrop-blur-lg py-3 bg-clip-padding shadow-[0_10px_15px_-3px_rgb(0_0_0_/_0.08),_0_4px_6px_-4px_rgb(0_0_0_/_0.08)] dark:bg-clip-border dark:backdrop-saturate-150 border-[0.5px] border-black/[0.13] dark:border-white/[0.13]">
                <div className="flex flex-row flex-nowrap items-center justify-between gap-4 px-3">
                    <Link
                        href="/"
                        className="text-gray-500 dark:text-gray-300 relative outline-none flex flex-row flex-nowrap items-center gap-2.5 whitespace-nowrap rounded-lg text-[0.9375rem] font-[550] leading-none"
                    >
                        <img
                            aria-hidden="true"
                            alt="Linky"
                            width={32}
                            height={32}
                            src={`${CONFIG.assetsDir}/logo/logo.svg`}
                        />
                        Linky
                    </Link>

                    {data.map(({title, href}) => (
                        <Link
                            key={href}
                            href={href}
                            className="text-gray-500 dark:text-gray-300 relative font-medium rounded-lg px-1 text-system-marketing-primary/80 transition-colors duration-250 ease-out hover:text-system-marketing-primary text-[0.9375rem]"
                        >
                            {title}
                        </Link>
                    ))}

                    <div className="flex flex-row flex-nowrap items-center justify-end gap-3 text-gray-500 dark:text-gray-300">
                        <button
                            className="relative rounded-full"
                            type="button"
                        >
                            <span className="sr-only">Login</span>
                            <span
                                className="relative flex shrink-0 select-none overflow-hidden rounded-full avatar-851 h-[--avatar-size] w-[--avatar-size]">
                                <span
                                    className="flex h-full w-full items-center justify-center rounded-full border border-system-primary bg-system-marketing-secondary text-system-marketing-tertiary">
                                    <Icon icon="ph:user-circle" width="20" height="20"/>
                                </span>
                            </span>
                        </button>
                    </div>
                </div>

                <hr className="border-[0.5px] border-black/[0.13] dark:border-white/[0.13] h-px border-b-0"/>

                <div className="px-3 text-gray-500 dark:text-gray-300">
                    <div className="relative isolate">
                        <div className="absolute left-0 top-0 z-10 flex size-6 items-center justify-center">
                            <Icon icon="mdi:magnify" className="shrink-0 text-system-marketing-primary/60" width={20} height={20}/>
                        </div>
                        <p className={cn('pointer-events-none absolute left-8 top-0 z-10 w-full bg-transparent text-[0.9375rem] text-system-marketing-primary/60', search ? 'hidden' : '')}>
                            Search over <span className="tabular-nums">{formattedValue}</span> profiles on Linky
                        </p>
                        <input
                            className="relative outline-none after:pointer-events-none after:absolute after:ring-inset after:ring-transparent data-[focus]:sm:after:ring-1 data-[focus]:sm:after:ring-blue-500 data-[focus]:sm:after:outline data-[focus]:sm:after:outline-3 data-[focus]:sm:after:outline-offset-0 data-[focus]:sm:after:outline-blue-200 data-[focus]:sm:after:dark:outline-blue-700/50 after:inset-0 after:rounded-[inherit] w-full bg-transparent pl-8 text-[0.9375rem] text-system-marketing-primary placeholder:text-system-marketing-primary/60"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={handleSearchSubmit}
                        />
                    </div>
                </div>
            </nav>
        </header>
    );
};