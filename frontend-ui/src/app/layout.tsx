import "@/globals.css";

import type { Viewport } from "next";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { NuqsAdapter } from "nuqs/adapters/next/app";

import { Snackbar } from "@/components/snackbar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowseProvider } from "@/sections/browse/context";

import { CONFIG } from "@/global-config";

import { AuthProvider as JwtAuthProvider } from "@/auth/context/jwt";
import { AuthProvider as SupabaseAuthProvider } from "@/auth/context/supabase";

import { PosthogProvider } from "@/analytics/posthog-provider";

// ----------------------------------------------------------------------

const AuthProvider =
  (CONFIG.auth.method === "supabase" && SupabaseAuthProvider) ||
  JwtAuthProvider;

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

// ----------------------------------------------------------------------

type RootLayoutProps = {
  children: React.ReactNode;
};

export default async function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="apple-mobile-web-app-title" content="Linky" />
        <title>Linky</title>
      </head>
      <body>
        <AuthProvider>
          <PosthogProvider>
            <NextThemesProvider
              attribute="class"
              defaultTheme="light"
              enableSystem
              disableTransitionOnChange
            >
              <BrowseProvider>
                <NuqsAdapter>
                  <Snackbar />
                  <TooltipProvider>{children}</TooltipProvider>
                </NuqsAdapter>
              </BrowseProvider>
            </NextThemesProvider>
          </PosthogProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
