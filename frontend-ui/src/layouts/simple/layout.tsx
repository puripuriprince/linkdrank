"use client";

import Link from "next/link";
import { paths } from "@/routes/paths";

import { MainSection, LayoutSection } from "../core";
import { MobileNav } from "@/layouts/main/nav/mobile";
import { Footer } from "@/layouts/main/footer";
import { cn } from "@/lib/utils";
import { navData as mainNavData } from "../nav-config-main";
import Image from "next/image";
import { CONFIG } from "@/global-config";

export type SimpleLayoutProps = {
  className?: string;
  children?: React.ReactNode;
  slotProps?: {
    header?: any;
    nav?: { data?: any };
    main?: any;
    footer?: any;
  };
};

export function SimpleLayout({
  className,
  children,
  slotProps,
}: SimpleLayoutProps) {
  const navData = slotProps?.nav?.data ?? mainNavData;

  const renderHeader = () => (
    <>
      <MobileNav data={navData} />
      <div className="flex justify-between items-center p-4 border-b bg-white dark:bg-black dark:border-gray-800 border-black/[0.13] dark:border-white/[0.13]">
        <Link href="/">
          <Image
            src={`${CONFIG.assetsDir}/logo/logo.svg`}
            alt="Logo"
            width={50}
            height={50}
          />
        </Link>
        <div className="flex gap-4 mr-2">
          <Link
            href={paths.feedback}
            className="text-sm font-semibold hover:underline"
          >
            Need help?
          </Link>
        </div>
      </div>
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
    </LayoutSection>
  );
}
