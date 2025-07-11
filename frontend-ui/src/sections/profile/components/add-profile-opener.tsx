"use client";

import React, { useState } from "react";
import { paths } from "src/routes/paths";
import { CustomDialog } from "@/components/custom-dialog";
import { cn } from "@/lib/utils";
import { Icon } from "@iconify/react";
import { usePathname } from "next/navigation";
import { AddProfileForm } from "@/sections/profile/components/add-profile-form";

export const AddProfileDialogOpener: React.FC = () => {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [previousPath, setPreviousPath] = useState("");

  const handleOpen = () => {
    setOpen(true);
    setPreviousPath(window.location.pathname);
    window.history.pushState({}, "", paths.people.root);
  };

  const handleClose = () => {
    window.history.pushState({}, "", previousPath || "/");
  };

  return (
    <CustomDialog
      trigger={
        <button
          className={cn(
            "hover:cursor-pointer rounded relative outline-none flex flex-1 flex-col items-center justify-center gap-[5px] [-webkit-touch-callout:_none] text-gray-500 dark:text-gray-400 transition-colors",
            pathname === paths.people.root && "text-black dark:text-white",
            "after:pointer-events-none after:absolute after:ring-inset after:ring-transparent after:-inset-1 after:rounded-[inherit]",
          )}
          onClick={handleOpen}
        >
          <Icon
            icon="material-symbols:account-circle"
            width={28}
            height={28}
            className="h-7 w-7 shrink-0"
          />
          <p className="pb-0.75 text-[10px] font-medium leading-none tracking-wide">
            Profile
          </p>
        </button>
      }
      title="Add Profile"
      description="Add a new profile"
      onClose={handleClose}
    >
      <AddProfileForm />
    </CustomDialog>
  );
};
