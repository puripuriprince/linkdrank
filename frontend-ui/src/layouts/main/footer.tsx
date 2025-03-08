import { Flex, Box, Text, Link, Button, Separator, Heading } from "@radix-ui/themes";
import { Icon } from "@iconify/react";
import { FC } from "react";
import {paths} from "src/routes/paths";

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
    { label: "Terms of Service", href: paths.terms }
  ],
  social: [
    { icon: "mdi:tiktok", href: "https://www.tiktok.com/@emojis.sh" },
    { icon: "mdi:instagram", href: "https://www.instagram.com/emojis.sh" },
    { icon: "mdi:twitter", href: "https://x.com/emojis_sh" },
    { icon: "mdi:github", href: "https://github.com/851-labs" }
  ]
};

interface FooterProps {
  className?: string;
}

export const Footer: FC<FooterProps> = ({ className }) => {
  return (
      <footer className={`w-full border-t bg-white dark:bg-black py-14 px-4 ${className || ""}`}>
        <Flex className="max-w-6xl mx-auto space-y-16" direction="column">
          <Flex wrap="wrap" gap="8" justify="between">
            <Flex direction="column" className="col-span-2 gap-4 md:col-span-2">
              <Link href="/" className="w-fit font-semibold">
                <img
                    aria-hidden="true"
                    alt="AI Emojis"
                    width={96}
                    height={96}
                    className="w-12 md:w-10"
                    src="https://attic.sh/_static/emojis-opengraph/favicon-96x96.png"
                />
              </Link>
              <Flex gap="3">
                <Button asChild variant="solid">
                  <Link href="https://apps.apple.com/us/app/ai-emojis-generator/id6468916301">
                    <Icon icon="mdi:apple" className="w-6 h-6" /> iOS App
                  </Link>
                </Button>
                <Button asChild variant="solid">
                  <Link href="https://play.google.com/store/apps/details?id=sh.emojis.app">
                    <Icon icon="mdi:google-play" className="w-6 h-6" /> Android App
                  </Link>
                </Button>
              </Flex>
              <Flex gap="4">
                {LINKS.social.map(({ icon, href }, idx) => (
                    <a key={idx} href={href} className="text-black dark:text-white hover:text-gray-700 dark:hover:text-gray-300">
                      <Icon icon={icon!} className="w-6 h-6" />
                    </a>
                ))}
              </Flex>
            </Flex>
            {["features", "company"].map((category) => (
                <Box key={category}>
                  <Heading size="3" className="text-black dark:text-white" mb='4'>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </Heading>
                  <Flex direction="column" gap="3">
                    {LINKS[category as keyof LinksStructure].map(({ label, href }) => (
                        <a key={href} href={href} className="text-gray-500 dark:text-gray-400 hover:text-gray-950 dark:hover:text-gray-100 transition-colors ease-out">
                          {label}
                        </a>
                    ))}
                  </Flex>
                </Box>
            ))}
          </Flex>
          <Separator />
          <Flex justify="between" align="center">
            <Text className="text-sm text-black dark:text-white">© {new Date().getFullYear()}</Text>
            <Flex align="center" gap="2">
              <Text className="text-sm text-black dark:text-white">Crafted with love in Montreal</Text>
              <Box className="relative w-9 h-9 rotate-6">
                <img
                    alt="San Francisco map"
                    className="absolute inset-0 rounded-lg dark:hidden"
                    src="https://attic.sh/_static/emojis/san-francisco-map-light.webp"
                />
                <img
                    alt="San Francisco map"
                    className="absolute inset-0 rounded-lg hidden dark:block"
                    src="https://attic.sh/_static/emojis/san-francisco-map-dark.webp"
                />
              </Box>
            </Flex>
          </Flex>
        </Flex>
      </footer>
  );
};