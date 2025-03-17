import type { FC } from "react";

import Link from "next/link";
import { Icon } from "@iconify/react";

import { CONFIG } from "@/global-config";

import { paths } from "@/routes/paths";

import { cn } from "@/lib/utils";
import Image from "next/image";

interface LinkItem {
  label?: string;
  href: string;
  icon?: string;
}

interface LinksStructure {
  features: LinkItem[];
  company: LinkItem[];
  social: LinkItem[];
}

const LINKS: LinksStructure = {
  features: [
    { label: "Search", href: paths.search },
    { label: "Vote", href: paths.vote },
    { label: "Leaderboard", href: paths.leaderboard },
  ],
  company: [
    { label: "Contact", href: paths.feedback },
    { label: "Privacy Policy", href: paths.privacy },
    { label: "Terms of Service", href: paths.terms },
  ],
  social: [
    { icon: "mdi:tiktok", href: "https://www.tiktok.com/@emojis.sh" },
    { icon: "mdi:instagram", href: "https://www.instagram.com/emojis.sh" },
    { icon: "mdi:twitter", href: "https://x.com/emojis_sh" },
    { icon: "mdi:github", href: "https://github.com/851-labs" },
  ],
};

interface FooterProps {
  className?: string;
}

export const Footer: FC<FooterProps> = ({ className }) => (
  <footer
    className={cn(
      "w-full border-t bg-white dark:bg-black py-14 px-4",
      className,
    )}
  >
    <div className="flex flex-col max-w-6xl mx-auto space-y-16">
      <div className="flex flex-wrap gap-8 justify-between">
        <div className="flex flex-col col-span-2 gap-4 md:col-span-2">
          <Link href="/" className="w-fit font-semibold">
            <Image
              aria-hidden="true"
              alt="Linky"
              width={96}
              height={96}
              className="w-12 md:w-10"
              src={`${CONFIG.assetsDir}/logo/logo.svg`}
            />
          </Link>
          <div className="flex gap-4">
            {LINKS.social.map(({ icon, href }, idx) => (
              <a
                key={idx}
                href={href}
                className="text-black dark:text-white hover:text-gray-700 dark:hover:text-gray-300"
              >
                <Icon icon={icon!} className="w-6 h-6" />
              </a>
            ))}
          </div>
        </div>
        {["features", "company"].map((category) => (
          <div key={category}>
            <h3 className="text-black dark:text-white mb-4">
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </h3>
            <div className="flex flex-col gap-3">
              {LINKS[category as keyof LinksStructure].map(
                ({ label, href }) => (
                  <a
                    key={href}
                    href={href}
                    className="text-gray-500 dark:text-gray-400 hover:text-gray-950 dark:hover:text-gray-100 transition-colors ease-out"
                  >
                    {label}
                  </a>
                ),
              )}
            </div>
          </div>
        ))}
      </div>
      <hr className="border-[0.5px] border-black/[0.13] dark:border-white/[0.13] h-px border-b-0" />
      <div className="flex items-center justify-between">
        <p className="text-sm text-black dark:text-white">
          © {new Date().getFullYear()}
        </p>
        <div className="flex items-center gap-2">
          <p className="text-sm text-black dark:text-white">
            Crafted with love in Montreal
          </p>
          <div className="relative isolate aspect-square w-9 rotate-6">
            <div className="absolute inset-0 rounded-lg bg-gray-100 dark:bg-gray-800"></div>
            <Image
              alt="San Francisco map"
              className="absolute inset-0 rounded-lg dark:hidden"
              src="https://attic.sh/_static/emojis/san-francisco-map-light.webp"
              width={36}
              height={36}
            />
            <Image
              alt="San Francisco map"
              className="absolute inset-0 rounded-lg hidden dark:block"
              src="https://attic.sh/_static/emojis/san-francisco-map-dark.webp"
              width={36}
              height={36}
            />
            <div className="pointer-events-none absolute inset-0 rounded-lg ring-1 ring-inset ring-gray-900/10 dark:ring-white/10"></div>
            <div className="absolute left-1/2 top-1/2 aspect-square w-2.5 -translate-x-1/2 -translate-y-1/2">
              <div className="absolute inset-0 animate-ping rounded-full bg-blue-500 dark:bg-blue-600"></div>
              <div className="absolute inset-0 rounded-full border border-white bg-blue-500 dark:bg-blue-600"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </footer>
);
