'use client';

import { useEffect } from 'react';
import { usePathname } from 'src/routes/hooks';
import { useAuthContext } from '../../../../auth/hooks';
import { paths } from 'src/routes/paths';
import { cn } from 'src/lib/utils';
import { Button, Box, Flex } from '@radix-ui/themes';

export type NavMobileProps = {
    data: Array<{ title: string; href: string; icon: React.ReactNode }>;
    open: boolean;
    onClose: () => void;
};

export function NavMobile({ data, open, onClose }: NavMobileProps) {
    const pathname = usePathname();
    const { authenticated } = useAuthContext();

    useEffect(() => {
        if (open) {
            onClose();
        }
    }, [pathname]);

    return (
        <nav className="fixed inset-x-0 bottom-0 h-[calc(var(--mobile-tab-bar-height)-1px)] select-none flex min-w-full flex-row justify-evenly border-t bg-system-marketing-primary py-[5px] md:hidden">
            {data.map((item) => (
                <a
                    key={item.title}
                    href={item.href}
                    className={cn(
                        'rounded relative outline-none flex flex-1 flex-col items-center justify-center gap-[5px]',
                        pathname === item.href ? 'text-system-primary' : 'text-gray-400 dark:text-gray-500'
                    )}
                >
                    {item.icon}
                    <p className="pb-0.75 text-[10px] font-medium leading-none tracking-wide">
                        {item.title}
                    </p>
                </a>
            ))}
            <Box className="flex flex-1 flex-col items-center justify-center gap-[5px]">
                {authenticated ? (
                    <a href={paths.profile.root} className="text-[10px] font-medium">
                        Dashboard
                    </a>
                ) : (
                    <a href={paths.profile.root} className="text-[10px] font-medium">
                        Sign In
                    </a>
                )}
            </Box>
        </nav>
    );
}