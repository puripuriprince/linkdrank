"use client";

import React, { useState } from "react";
import { paths } from "src/routes/paths";
import { CustomDialog } from "@/components/custom-dialog";
import { AISearchForm } from "@/sections/profile/components/ai-search-form";
import { cn } from "@/lib/utils";
import { Icon } from "@iconify/react";
import { usePathname } from "next/navigation";

export const AIDialogOpener: React.FC = () => {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
    window.history.pushState({}, "", paths.people.aiSearch);
  };

  const handleClose = () => {
    window.history.pushState({}, "", "/");
  };

  return (
    <CustomDialog
      trigger={
        <button
          className={cn(
            "hover:cursor-pointer rounded relative outline-none flex flex-1 flex-col items-center justify-center gap-[5px] [-webkit-touch-callout:_none] text-gray-500 dark:text-gray-400 transition-colors",
            pathname === paths.people.aiSearch && "text-black dark:text-white",
            "after:pointer-events-none after:absolute after:ring-inset after:ring-transparent after:-inset-1 after:rounded-[inherit]",
          )}
          onClick={handleOpen}
        >
          <Icon
            icon="ix:ai"
            width={28}
            height={28}
            className="h-7 w-7 shrink-0"
          />
          <p className="pb-0.75 text-[10px] font-medium leading-none tracking-wide">
            AI Search
          </p>
        </button>
      }
      title="AI Search"
      description="Search with AI"
      onClose={handleClose}
    >
      <AISearchForm />
    </CustomDialog>
  );
};
