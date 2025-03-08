'use client';

import { cn } from 'src/lib/utils';
import { useScrollOffsetTop } from 'src/hooks/use-scroll-offset-top';
import { Flex, Container, Box } from '@radix-ui/themes';

export type HeaderSectionProps = {
  disableOffset?: boolean;
  disableElevation?: boolean;
  slots?: {
    leftArea?: React.ReactNode;
    rightArea?: React.ReactNode;
    topArea?: React.ReactNode;
    centerArea?: React.ReactNode;
    bottomArea?: React.ReactNode;
  };
  slotProps?: {
    container?: React.ComponentProps<typeof Container>;
    centerArea?: React.ComponentProps<'div'>;
  };
  className?: string;
};

export function HeaderSection({
                                slots,
                                slotProps,
                                className,
                                disableOffset,
                                disableElevation,
                                ...other
                              }: HeaderSectionProps) {
  const { offsetTop: isOffset } = useScrollOffsetTop();

  return (
      <header
          className={cn(
              'fixed inset-x-0 top-0 z-50 bg-white/80 shadow-md backdrop-blur-lg border-b border-gray-200 dark:border-gray-700',
              { 'shadow-lg': !disableElevation && isOffset },
              className
          )}
          {...other}
      >
        {slots?.topArea}

        <Container {...slotProps?.container} className="flex items-center justify-between py-2 px-4">
          {slots?.leftArea}
          <div {...slotProps?.centerArea} className="flex flex-1 justify-center">
            {slots?.centerArea}
          </div>
          {slots?.rightArea}
        </Container>

        {slots?.bottomArea}
      </header>
  );
}