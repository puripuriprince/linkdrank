import "@/globals.css";

import type { Viewport } from "next";

import { ThemeProvider as NextThemesProvider } from "next-themes";

import { Snackbar } from "@/components/snackbar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SearchProvider } from "@/sections/search/context";

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
              <SearchProvider>
                <Snackbar />
                <TooltipProvider>{children}</TooltipProvider>
              </SearchProvider>
            </NextThemesProvider>
          </PosthogProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
