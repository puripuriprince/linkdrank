import "src/globals.css";
import "@radix-ui/themes/styles.css";

import type { Metadata, Viewport } from 'next';

import { CONFIG } from 'src/global-config';
import { Theme as ThemeProvider } from "@radix-ui/themes";

import { Snackbar } from 'src/components/snackbar';

import { AuthProvider as JwtAuthProvider } from 'src/auth/context/jwt';
import { AuthProvider as SupabaseAuthProvider } from 'src/auth/context/supabase';

import { PosthogProvider } from '../analytics/posthog-provider';

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
                    <ThemeProvider>
                        <Snackbar />
                        {children}
                    </ThemeProvider>
                </PosthogProvider>
            </AuthProvider>
        </body>
        </html>
    );
}
