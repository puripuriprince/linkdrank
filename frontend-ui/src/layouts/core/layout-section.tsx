'use client';

import { cn } from 'src/lib/utils';
import { Box, Container } from '@radix-ui/themes';

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
      <Box
          id="root__layout"
          style={cssVars}
          className={cn('relative flex flex-col min-h-screen', className)}
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
      </Box>
  );
}

const LayoutSidebarContainer = ({ children }: { children: React.ReactNode }) => (
    <Container className="flex flex-1 flex-col">{children}</Container>
);