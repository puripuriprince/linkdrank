import "src/globals.css";
import type { Metadata, Viewport } from 'next';

import { CONFIG } from 'src/global-config';
import { ThemeProvider as NextThemesProvider } from "next-themes"

import { AuthProvider as JwtAuthProvider } from 'src/auth/context/jwt';
import { AuthProvider as SupabaseAuthProvider } from 'src/auth/context/supabase';

import { PosthogProvider } from '../analytics/posthog-provider';
import {Snackbar} from "@/components/snackbar";

// ----------------------------------------------------------------------

const AuthProvider =
    (CONFIG.auth.method === 'supabase' && SupabaseAuthProvider) ||
    JwtAuthProvider;

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
};

export const metadata: Metadata = {
    icons: [
        {
            rel: 'icon',
            url: `${CONFIG.assetsDir}/favicon.ico`,
        },
    ],
};

// ----------------------------------------------------------------------

type RootLayoutProps = {
    children: React.ReactNode;
};

export default async function RootLayout({ children }: RootLayoutProps) {
    return (
        <html lang='en' suppressHydrationWarning>
        <body>
            <AuthProvider>
                <PosthogProvider>
                    <NextThemesProvider
                        attribute="class"
                        defaultTheme="system"
                        enableSystem
                        disableTransitionOnChange
                    >
                        <Snackbar />
                        {children}
                    </NextThemesProvider>
                </PosthogProvider>
            </AuthProvider>
        </body>
        </html>
    );
}
