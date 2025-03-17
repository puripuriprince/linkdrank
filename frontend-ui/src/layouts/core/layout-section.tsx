"use client";

import { cn } from "@/lib/utils";

export type LayoutSectionProps = {
  className?: string;
  cssVars?: React.CSSProperties;
  children?: React.ReactNode;
  footerSection?: React.ReactNode;
  headerSection?: React.ReactNode;
  sidebarSection?: React.ReactNode;
};

export function LayoutSection({
  cssVars,
  children,
  footerSection,
  headerSection,
  sidebarSection,
  className,
  ...other
}: LayoutSectionProps) {
  return (
    <div
      id="root__layout"
      style={cssVars}
      className={cn("relative flex flex-col min-h-screen", className)}
      {...other}
    >
      {sidebarSection ? (
        <div className="flex flex-row w-full">
          {sidebarSection}
          <LayoutSidebarContainer>
            {headerSection}
            {children}
            {footerSection}
          </LayoutSidebarContainer>
        </div>
      ) : (
        <>
          {headerSection}
          {children}
          {footerSection}
        </>
      )}
    </div>
  );
}

const LayoutSidebarContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => <div className="flex flex-1 flex-col container">{children}</div>;
