"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";
import { toast } from "sonner";

import { signInWithOAuth } from "@/auth/context";
import { CustomDialog } from "@/components/custom-dialog";
import { Button } from "@/components/ui/button";

// ----------------------------------------------------------------------

interface AuthDialogProps {
  trigger: React.ReactNode;
  mode: "signin" | "signup";
}

export function AuthDialog({ trigger, mode }: AuthDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleLinkedInAuth = async () => {
    setIsLoading(true);
    try {
      await signInWithOAuth("linkedin_oidc");
      toast.success(mode === "signin" ? "Sign in successful!" : "Account created successfully!");
    } catch (error) {
      console.error("LinkedIn auth error:", error);
      toast.error(mode === "signin" ? "Sign in failed" : "Sign up failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CustomDialog
      trigger={trigger}
      title={mode === "signin" ? "Sign In" : "Sign Up"}
      description={mode === "signin" ? "Sign in to your account with LinkedIn" : "Create your account with LinkedIn"}
    >
      <div className="space-y-4">
        <Button
          variant="outline"
          className="w-full"
          onClick={handleLinkedInAuth}
          disabled={isLoading}
        >
          <Icon icon="mdi:linkedin" className="mr-2 h-4 w-4" />
          {isLoading 
            ? (mode === "signin" ? "Signing in..." : "Creating account...") 
            : "Continue with LinkedIn"
          }
        </Button>
      </div>
    </CustomDialog>
  );
} 