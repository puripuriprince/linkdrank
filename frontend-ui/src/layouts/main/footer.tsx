'use client';

import { cn } from 'src/lib/utils';
import { Box, Container, Flex, Separator, Text, Link } from '@radix-ui/themes';
import { DiscordIcon, LinkedinIcon, InstagramIcon } from 'src/assets/icons';
import { paths } from 'src/routes/paths';

const LINKS = [
  {
    headline: 'Linkdrank',
    children: [{ name: 'Contact us', href: paths.feedback }],
  },
  {
    headline: 'Legal',
    children: [
      { name: 'Terms and condition', href: '#' },
      { name: 'Privacy policy', href: '#' },
    ],
  },
  { headline: 'Contact', children: [{ name: 'a@b.c', href: '#' }] },
];

export function Footer({ className, ...other }: { className?: string }) {
  return (
      <footer
          className={cn('relative bg-gray-50 dark:bg-gray-900 py-10', className)}
          {...other}
      >
        <Separator className="border-gray-200 dark:border-gray-700" />

        <Container className="text-center md:text-left py-5">
          Logo

          <Flex className="mt-5 flex-col md:flex-row md:justify-between">
            <Flex direction="column" className="items-center md:items-start">
              <Text className="max-w-sm text-sm text-gray-600 dark:text-gray-400">
                Find the Best Time to Fly at the Lowest Fare
              </Text>
              <Flex className="mt-3 gap-4">
                <DiscordIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <InstagramIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                <LinkedinIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </Flex>
            </Flex>

            <Flex className="mt-6 md:mt-0 flex-col md:flex-row gap-8">
              {LINKS.map((list) => (
                  <Flex key={list.headline} direction="column" className="text-center md:text-left">
                    <Text className="text-xs font-semibold uppercase text-gray-800 dark:text-gray-200">
                      {list.headline}
                    </Text>
                    {list.children.map((link) => (
                        <Link key={link.name} href={link.href} className="text-sm text-gray-600 dark:text-gray-400">
                          {link.name}
                        </Link>
                    ))}
                  </Flex>
              ))}
            </Flex>
          </Flex>

          <Text className="mt-10 text-xs text-gray-500">© All rights reserved.</Text>
        </Container>
      </footer>
  );
}

export function HomeFooter({ className, ...other }: { className?: string }) {
  return (
      <footer className={cn('py-5 text-center bg-gray-50 dark:bg-gray-900', className)} {...other}>
        <Container>
          Logo
          <Text className="mt-1 text-xs text-gray-500">© All rights reserved.</Text>
        </Container>
      </footer>
  );
}