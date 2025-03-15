"use client";

import posthog from "posthog-js";
import { Suspense, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { usePostHog, PostHogProvider } from "posthog-js/react";

import { SplashScreen } from "@/components/loading-screen";

import { CONFIG } from "../global-config";
import { useAuthContext } from "../auth/hooks";

type PosthogProviderProps = {
  children: React.ReactNode;
};

if (typeof window !== "undefined") {
  posthog.init(CONFIG.posthog.apiKey, {
    api_host: CONFIG.posthog.apiHost,
    person_profiles: "identified_only",
    capture_pageview: false,
    capture_pageleave: true,
  });
}

export function PosthogProvider({ children }: PosthogProviderProps) {
  return (
    <Suspense fallback={<SplashScreen />}>
      <PosthogContainer>{children}</PosthogContainer>
    </Suspense>
  );
}

function PosthogContainer({ children }: PosthogProviderProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const pg = usePostHog();
  const { user } = useAuthContext();

  useEffect(() => {
    if (user?.email && pg) {
      pg.identify(user.email, {
        email: user.email,
        full_name: user.user_metadata?.full_name,
      });
    }

    // Track pageviews
    if (pathname && pg) {
      let url = window.origin + pathname;

      if (searchParams?.toString()) {
        url = url + `?${searchParams.toString()}`;
      }
      pg.capture("$pageview", {
        $current_url: url,
      });
    }
  }, [pathname, searchParams, pg]);

  return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
}
