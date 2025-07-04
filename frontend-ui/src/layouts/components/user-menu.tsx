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
import { signOut } from "@/auth/context";
import { AuthDialog } from "@/components/auth/auth-dialog";

const UserMenuTrigger = React.forwardRef<HTMLButtonElement>((props, ref) => {
  const { authenticated, user } = useAuthContext();

  // Function to get user's profile picture
  const getUserProfilePicture = () => {
    if (!user || !authenticated) return null;

    const userMetadata = (user as any)?.user_metadata;
    
    // Check for LinkedIn profile picture in various possible fields
    if (userMetadata?.avatar_url) {
      return userMetadata.avatar_url;
    }
    
    if (userMetadata?.picture) {
      return userMetadata.picture;
    }
    
    if (userMetadata?.profile_picture_url) {
      return userMetadata.profile_picture_url;
    }

    // Check in user identities for LinkedIn data
    const identities = (user as any)?.identities;
    if (identities && Array.isArray(identities)) {
      const linkedinIdentity = identities.find((identity: any) => 
        identity.provider === 'linkedin_oidc' || identity.provider === 'linkedin'
      );
      
      if (linkedinIdentity?.identity_data?.picture) {
        return linkedinIdentity.identity_data.picture;
      }
      
      if (linkedinIdentity?.identity_data?.avatar_url) {
        return linkedinIdentity.identity_data.avatar_url;
      }
    }

    // Fallback to user avatar field
    if ((user as any)?.avatar) {
      return (user as any).avatar;
    }

    return null;
  };

  const profilePicture = getUserProfilePicture();

  return (
    <Button
      ref={ref}
      variant="outline"
      className="relative rounded-full p-0 h-10 w-10"
      {...props}
    >
      <span className="sr-only">User menu</span>
      {authenticated && profilePicture ? (
        <Image
          src={profilePicture}
          alt="User profile picture"
          fill
          className="rounded-full object-cover"
          onError={(e) => {
            // Fallback to icon if image fails to load
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            target.nextElementSibling?.setAttribute('style', 'display: block');
          }}
        />
      ) : (
        <Icon icon="ph:user-circle" width={40} height={40} />
      )}
      {/* Hidden fallback icon for error cases */}
      {authenticated && profilePicture && (
        <Icon 
          icon="ph:user-circle" 
          width={40} 
          height={40} 
          style={{ display: 'none' }}
        />
      )}
    </Button>
  );
});
UserMenuTrigger.displayName = "UserMenuTrigger";

export function UserMenu() {
  const { authenticated, user } = useAuthContext();
  const { setTheme, theme } = useTheme();
  const isMobile = useMediaQuery("(max-width: 767px)");

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Logout failed");
    }
  };

  const profileHandle = 'claim-your-profile'
  const profileUrl = profileHandle ? paths.people.details(profileHandle) : paths.people.root;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <UserMenuTrigger />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="min-w-[200px]"
        align={isMobile ? "start" : "end"}
      >
        {authenticated ? (
          <DropdownMenuItem asChild>
            <Link href={profileUrl}>
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
        ) : (
          <DropdownMenuItem disabled>
            <div className="flex items-center opacity-50">
              <Icon
                icon="material-symbols:account-circle"
                width="18"
                height="18"
                className="mr-2"
              />
              Profile
            </div>
          </DropdownMenuItem>
        )}
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
          <AuthDialog
            trigger={
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
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
            }
            mode="signin"
          />
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
