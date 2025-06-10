"use client";

import { cn } from "@/lib/utils";

import { Footer } from "./footer";
import { DesktopHeader } from "./nav/desktop";
import { MainSection, LayoutSection } from "../core";
import { MobileNav, MobileHeader } from "./nav/mobile";
import { navData as mainNavData } from "../nav-config-main";
import { CompareFloatingPanel } from "@/sections/compare/components/compare-floating-panel";

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

export function MainLayout({
  className,
  children,
  slotProps,
}: MainLayoutProps) {
  const navData = slotProps?.nav?.data ?? mainNavData;

  const renderHeader = () => (
    <>
      <DesktopHeader data={navData} className="hidden md:flex mr-4" />
      <MobileHeader />
      <MobileNav data={navData} />
    </>
  );

  const renderFooter = () => <Footer {...slotProps?.footer} />;
  const renderMain = () => (
    <MainSection {...slotProps?.main}>{children}</MainSection>
  );

  return (
    <LayoutSection className={cn("relative", className)}>
      {renderHeader()}
      {renderMain()}
      {renderFooter()}
      {/* Compare Floating Panel */}
      <CompareFloatingPanel />
    </LayoutSection>
  );
}
