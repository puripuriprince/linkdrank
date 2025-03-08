'use client';

import { cn } from 'src/lib/utils';
import { useBoolean } from 'src/hooks';
import { Box, Button, Container, Flex } from '@radix-ui/themes';
import { paths } from 'src/routes/paths';
import { usePathname } from 'src/routes/hooks';
import { useAuthContext } from 'src/auth/hooks';
import { NavMobile } from './nav/mobile';
import { NavDesktop } from './nav/desktop';
import { Footer, HomeFooter } from './footer';
import { MainSection, LayoutSection, HeaderSection } from '../core';
import { navData as mainNavData } from '../nav-config-main';

export type MainLayoutProps = {
    className?: string;
    children?: React.ReactNode;
    slotProps?: {
        header?: any;
        nav?: { data?: any };
        main?: any;
        footer?: any;
    };
};

export function MainLayout({ className, children, slotProps }: MainLayoutProps) {
    const pathname = usePathname();
    const { authenticated } = useAuthContext();
    const { value: open, onFalse: onClose, onTrue: onOpen } = useBoolean();
    const isHomePage = pathname === '/';
    const navData = slotProps?.nav?.data ?? mainNavData;

    const renderHeader = () => (
        <HeaderSection
            {...slotProps?.header}
            slots={{
                topArea: <div className="hidden">This is an info Alert.</div>,
                leftArea: (
                    <>
                        <Button onClick={onOpen} className="mr-2 md:hidden">
                            Menu
                        </Button>
                        <NavMobile data={navData} open={open} onClose={onClose} />
                        Logo
                    </>
                ),
                rightArea: (
                    <Flex className="items-center gap-4">
                        <NavDesktop data={navData} className="hidden md:flex mr-4" />
                        {!authenticated && <Button variant="solid" onClick={() => window.location.href = paths.auth.supabase.signIn}>Sign in</Button>}
                        <Button variant="solid" onClick={() => window.location.href = authenticated ? paths.profile.root : paths.auth.supabase.signUp}>
                            {authenticated ? 'Dashboard' : 'Sign up'}
                        </Button>
                    </Flex>
                ),
                ...slotProps?.header?.slots,
            }}
            slotProps={slotProps?.header?.slotProps}
            className={cn(slotProps?.header?.className)}
        />
    );

    const renderFooter = () => (isHomePage ? <HomeFooter /> : <Footer {...slotProps?.footer} />);
    const renderMain = () => <MainSection {...slotProps?.main}>{children}</MainSection>;

    return (
        <LayoutSection className={cn('relative', className)}>
            {renderHeader()}
            {renderMain()}
            {renderFooter()}
        </LayoutSection>
    );
}