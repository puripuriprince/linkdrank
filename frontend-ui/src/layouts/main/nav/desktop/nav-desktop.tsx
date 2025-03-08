'use client';

import { cn } from 'src/lib/utils';

export type NavDesktopProps = {
    data: { title: string; href: string }[];
    className?: string;
};

export function NavDesktop({ data, className }: NavDesktopProps) {
    return (
        <header
            className={cn(
                'fixed inset-x-0 top-0 select-none grid grid-cols-3 grid-rows-[repeat(1,calc(var(--mobile-header-height)-1px))] items-center justify-center border-b bg-system-marketing-primary px-safe-offset-4 md:hidden',
                className
            )}
        >
            <div data-align="start" className="flex flex-row items-center">
                <button className="relative outline-none rounded-full after:pointer-events-none after:absolute after:ring-inset after:ring-transparent data-[focus]:sm:after:ring-1 data-[focus]:sm:after:ring-blue-500 after:inset-0">
                    <span className="absolute left-1/2 top-1/2 size-[max(100%,2.75rem)] -translate-x-1/2 -translate-y-1/2" aria-hidden="true"></span>
                    <span className="sr-only">Login</span>
                    <span className="relative flex shrink-0 select-none overflow-hidden rounded-full avatar h-[--avatar-size] w-[--avatar-size]">
            <span className="flex h-full w-full items-center justify-center rounded-full border bg-system-marketing-secondary text-system-marketing-tertiary">
              <svg
                  className="shrink-0"
                  width="20"
                  height="20"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.2"
              >
                <path d="M11.9883 12.4831C11.5225 11.8664 10.9198 11.3662 10.2278 11.022C9.53575 10.6779 8.77324 10.4991 8.00033 10.4998C7.22743 10.4991 6.46492 10.6779 5.77288 11.022C5.08084 11.3662 4.47816 11.8664 4.01233 12.4831M10.0003 6.4998C10.0003 7.03024 9.78962 7.53894 9.41455 7.91402C9.03948 8.28909 8.53077 8.4998 8.00033 8.4998C7.4699 8.4998 6.96119 8.28909 6.58612 7.91402C6.21105 7.53894 6.00033 7.03024 6.00033 6.4998C6.00033 5.96937 6.21105 5.46066 6.58612 5.08559C6.96119 4.71052 7.4699 4.4998 8.00033 4.4998C8.53077 4.4998 9.03948 4.71052 9.41455 5.08559C9.78962 5.46066 10.0003 5.96937 10.0003 6.4998Z"></path>
              </svg>
            </span>
          </span>
                </button>
            </div>
            <p className="col-start-2 place-self-center text-[17px] font-semibold">AI Emojis</p>
            <div data-align="end" className="flex flex-row items-center">
                {data.map((item) => (
                    <a
                        key={item.title}
                        href={item.href}
                        className="rounded relative outline-none after:pointer-events-none after:absolute after:ring-inset after:ring-transparent"
                    >
                        {item.title}
                    </a>
                ))}
            </div>
        </header>
    );
}