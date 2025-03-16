"use client";

import Link from "next/link";
import { paths } from "@/src/routes/paths";

import { MainSection, LayoutSection } from "../core";
import { MobileNav } from "@/src/layouts/main/nav/mobile";
import { Footer } from "@/src/layouts/main/footer";
import { cn } from "@/lib/utils";
import { navData as mainNavData } from "../nav-config-main";
import Image from "next/image";
import { CONFIG } from "@/src/global-config";

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
      <div className="flex justify-between items-center p-4 border-b bg-white dark:bg-black dark:border-gray-800">
        <Image
          src={`${CONFIG.assetsDir}/logo/logo.svg`}
          alt="Logo"
          width={100}
          height={100}
        />
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
