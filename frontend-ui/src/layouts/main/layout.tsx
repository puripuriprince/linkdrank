'use client';

import { cn } from 'src/lib/utils';
import { Footer } from './footer';
import { MainSection, LayoutSection } from '../core';
import { navData as mainNavData } from '../nav-config-main';
import {MobileHeader, MobileNav} from "./nav/mobile";
import {DesktopHeader} from "./nav/desktop";

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
    const navData = slotProps?.nav?.data ?? mainNavData;

    const renderHeader = () => (
        <>
            <DesktopHeader data={navData} className="hidden md:flex mr-4" />
            <MobileHeader/>
            <MobileNav data={navData}/>
        </>
    );

    const renderFooter = () => <Footer {...slotProps?.footer} />;
    const renderMain = () => <MainSection {...slotProps?.main}>{children}</MainSection>;

    return (
        <LayoutSection className={cn('relative', className)}>
            {renderHeader()}
            {renderMain()}
            {renderFooter()}
        </LayoutSection>
    );
}