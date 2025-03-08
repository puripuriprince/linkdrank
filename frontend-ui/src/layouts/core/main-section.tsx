'use client';

import { cn } from 'src/lib/utils';

export type MainSectionProps = React.ComponentProps<'main'>;

export function MainSection({ children, className, ...other }: MainSectionProps) {
  return (
      <MainRoot className={className} {...other}>
        {children}
      </MainRoot>
  );
}

const MainRoot = ({ children, className, ...props }: React.ComponentProps<'main'>) => (
    <main className={cn('flex flex-col @container/page box-border bg-system-marketing-primary outline-0 min-h-screen py-5 px-safe-offset-4 md:pt-[calc(1.25rem+var(--desktop-header-top)+var(--desktop-header-height))] max-md:pt-[calc(1.25rem+var(--mobile-header-height))]', className)} {...props}>
      {children}
    </main>
);
