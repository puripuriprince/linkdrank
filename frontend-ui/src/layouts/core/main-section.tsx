'use client';

import { cn } from 'src/lib/utils';

export type MainSectionProps = React.ComponentProps<'main'>;

export function MainSection({ children, className, ...other }: MainSectionProps) {
  return (
      <MainRoot className={cn('flex flex-1 flex-col', className)} {...other}>
        {children}
      </MainRoot>
  );
}

const MainRoot = ({ children, className, ...props }: React.ComponentProps<'main'>) => (
    <main className={cn('flex flex-1 flex-col', className)} {...props}>
      {children}
    </main>
);
