import { FC, useState } from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";
import {cn} from "src/lib/utils";

export type DesktopHeaderProps = {
    data: { title: string; href: string }[];
    className?: string;
    totalEmojis?: number;
};

export const DesktopHeader: FC<DesktopHeaderProps> = ({
                                                    data,
                                                    className,
                                                    totalEmojis = 5804335,
                                                }) => {
    const [search, setSearch] = useState("");

    return (
        <header
            className={cn('fixed top-[var(--desktop-header-top)] isolate w-screen select-none px-4 hidden items-center justify-center md:flex', className)}
        >
            <nav
                className="flex flex-col justify-between gap-3 mx-auto h-[var(--desktop-header-height)] w-full max-w-[calc(72rem+2rem)] rounded-xl py-3 bg-system-marketing-primary bg-clip-padding shadow-[0_10px_15px_-3px_rgb(0_0_0_/_0.08),_0_4px_6px_-4px_rgb(0_0_0_/_0.08)] dark:bg-system-marketing-primary/60 dark:bg-clip-border dark:backdrop-blur-xl dark:backdrop-saturate-150 border-[0.5px] border-black/[0.13] dark:border-white/[0.13]">
                <div className="flex flex-row flex-nowrap items-center justify-between gap-4 px-3">
                    <Link
                        href="/"
                        className="relative outline-none flex flex-row flex-nowrap items-center gap-2.5 whitespace-nowrap rounded-lg text-[0.9375rem] font-[550] leading-none"
                    >
                        <img
                            aria-hidden="true"
                            alt="AI Emojis"
                            width={32}
                            height={32}
                            src="https://attic.sh/_static/emojis-opengraph/favicon-96x96.png"
                        />
                        AI Emojis
                    </Link>

                    {data.map(({title, href}) => (
                        <Link
                            key={href}
                            href={href}
                            className="relative font-medium rounded-lg px-1 text-system-marketing-primary/80 transition-colors duration-250 ease-out hover:text-system-marketing-primary text-[0.9375rem]"
                        >
                            {title}
                        </Link>
                    ))}

                    <div className="flex flex-row flex-nowrap items-center justify-end gap-3">
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

                <hr className="border-[0.5px] border-black/[0.13] h-px border-b-0"/>

                <div className="px-3">
                    <div className="relative isolate">
                        <div className="absolute left-0 top-0 z-10 flex size-6 items-center justify-center">
                            <Icon icon="mdi:magnify" className="shrink-0 text-system-marketing-primary/60" width={20} height={20}/>
                        </div>
                        <p className={cn('pointer-events-none absolute left-8 top-0 z-10 w-full bg-transparent text-[0.9375rem] text-system-marketing-primary/60', search ? 'hidden' : '')}>
                            Search and download over <span className="tabular-nums">{totalEmojis.toLocaleString()}</span> AI emojis
                        </p>
                        <input
                            className="relative outline-none after:pointer-events-none after:absolute after:ring-inset after:ring-transparent data-[focus]:sm:after:ring-1 data-[focus]:sm:after:ring-blue-500 data-[focus]:sm:after:outline data-[focus]:sm:after:outline-3 data-[focus]:sm:after:outline-offset-0 data-[focus]:sm:after:outline-blue-200 data-[focus]:sm:after:dark:outline-blue-700/50 after:inset-0 after:rounded-[inherit] w-full bg-transparent pl-8 text-[0.9375rem] text-system-marketing-primary placeholder:text-system-marketing-primary/60"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>
            </nav>
        </header>
    );
};
