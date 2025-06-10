"use client";

import React from "react";
import Image from "next/image";
import { Icon } from "@iconify/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useAuthContext } from "@/auth/hooks";
import { toast } from "sonner";
import { paths } from "@/routes/paths";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { useMediaQuery } from "@/hooks/use-media-query";
import { AddProfileDialogOpener } from "@/sections/profile/components/add-profile-opener";
import { cn } from "@/lib/utils";
import { AddProfileForm } from "@/sections/profile/components/add-profile-form";
import { CustomDialog } from "@/components/custom-dialog";

const UserMenuTrigger = React.forwardRef<HTMLButtonElement>((props, ref) => {
  const { authenticated, user } = useAuthContext();

  return (
    <Button
      ref={ref}
      variant="outline"
      className="relative rounded-full p-0 h-10 w-10"
      {...props}
    >
      <span className="sr-only">User menu</span>
      {authenticated && user && user.avatar ? (
        <Image
          src={user.avatar}
          alt="User avatar"
          width={40}
          height={40}
          className="rounded-full object-cover"
        />
      ) : (
        <Icon icon="ph:user-circle" width={40} height={40} />
      )}
    </Button>
  );
});
UserMenuTrigger.displayName = "UserMenuTrigger";

export function UserMenu() {
  const { authenticated } = useAuthContext();
  const { setTheme, theme } = useTheme();
  const isMobile = useMediaQuery("(max-width: 767px)");

  const handleLogin = () => {
    toast.info("Login action");
  };

  const handleLogout = () => {
    toast.info("Logout action");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <UserMenuTrigger />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="min-w-[200px]"
        align={isMobile ? "start" : "end"}
      >
        <DropdownMenuItem asChild>
          <Link href={paths.people.root}>
            <div className="flex items-center">
              <Icon
                icon="material-symbols:account-circle"
                width="18"
                height="18"
                className="mr-2"
              />
              Profile
            </div>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={paths.feedback}>
            <div className="flex items-center">
              <Icon
                icon="material-symbols:contact-page"
                width="18"
                height="18"
                className="mr-2"
              />
              Contact us
            </div>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <div className="flex items-center">
              <Icon
                icon="carbon:screen"
                width="18"
                height="18"
                className="mr-2"
              />
              Theme
            </div>
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuRadioGroup value={theme}>
                <DropdownMenuRadioItem
                  onClick={() => setTheme("light")}
                  value={"light"}
                >
                  <div className="flex items-center">
                    <Icon
                      icon="ri:sun-line"
                      width="18"
                      height="18"
                      className="mr-2"
                    />
                    Light
                  </div>
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem
                  onClick={() => setTheme("dark")}
                  value={"dark"}
                >
                  <div className="flex items-center">
                    <Icon
                      icon="ri:moon-line"
                      width="18"
                      height="18"
                      className="mr-2"
                    />
                    Dark
                  </div>
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem
                  onClick={() => setTheme("system")}
                  value={"system"}
                >
                  <div className="flex items-center">
                    <Icon
                      icon="carbon:screen"
                      width="18"
                      height="18"
                      className="mr-2"
                    />
                    System
                  </div>
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        {authenticated ? (
          <DropdownMenuItem onSelect={handleLogout}>
            <div className="flex items-center">
              <Icon
                icon="material-symbols:logout"
                width="18"
                height="18"
                className="mr-2"
              />
              Logout
            </div>
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem onSelect={handleLogin}>
            <div className="flex items-center">
              <Icon
                icon="material-symbols:login"
                width="18"
                height="18"
                className="mr-2"
              />
              Login
            </div>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
