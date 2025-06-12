"use client";

import { cn } from "@/lib/utils";

export type MainSectionProps = React.ComponentProps<"main">;

export function MainSection({
  children,
  className,
  ...other
}: MainSectionProps) {
  return (
    <MainRoot className={className} {...other}>
      {children}
    </MainRoot>
  );
}

const MainRoot = ({
  children,
  className,
  ...props
}: React.ComponentProps<"main">) => (
  <main
    className={cn(
      "bg-white dark:bg-black text-gray-500 dark:text-gray-300 flex flex-col box-border outline-0 min-h-screen py-5 px-safe-offset-4 md:pt-[calc(1.25rem+var(--desktop-header-top)+var(--desktop-header-height))] max-md:pt-[calc(1.25rem+6.75rem)]",
      className,
    )}
    {...props}
  >
    {children}
  </main>
);
