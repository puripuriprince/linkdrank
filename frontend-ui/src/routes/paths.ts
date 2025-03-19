// ----------------------------------------------------------------------

import { getHandeFromLinkedInURL } from "@/lib/utils";

const ROOTS = {
  AUTH: "/auth",
  PROFILE: "/profile",
};

// ----------------------------------------------------------------------

export const paths = {
  vote: "/elo",
  leaderboard: "/leaderboard",
  feedback: "/",
  browse: "/browse",
  privacy: "/",
  terms: "/",
  people: {
    root: "/p",
    details: (handle: string | undefined) =>
      `/p/:handle:${getHandeFromLinkedInURL(handle ?? "")}`,
    AISearch: (query: string | undefined) =>
      `/p/:ai-search:${encodeURIComponent(query ?? "")}`,
  },
  // AUTH
  auth: {
    amplify: {
      signIn: `${ROOTS.AUTH}/amplify/sign-in`,
      verify: `${ROOTS.AUTH}/amplify/verify`,
      signUp: `${ROOTS.AUTH}/amplify/sign-up`,
      updatePassword: `${ROOTS.AUTH}/amplify/update-password`,
      resetPassword: `${ROOTS.AUTH}/amplify/reset-password`,
    },
    jwt: {
      signIn: `${ROOTS.AUTH}/jwt/sign-in`,
      signUp: `${ROOTS.AUTH}/jwt/sign-up`,
    },
    firebase: {
      signIn: `${ROOTS.AUTH}/firebase/sign-in`,
      verify: `${ROOTS.AUTH}/firebase/verify`,
      signUp: `${ROOTS.AUTH}/firebase/sign-up`,
      resetPassword: `${ROOTS.AUTH}/firebase/reset-password`,
    },
    auth0: { signIn: `${ROOTS.AUTH}/auth0/sign-in` },
    supabase: {
      signIn: `${ROOTS.AUTH}/supabase/sign-in`,
      verify: `${ROOTS.AUTH}/supabase/verify`,
      signUp: `${ROOTS.AUTH}/supabase/sign-up`,
      updatePassword: `${ROOTS.AUTH}/supabase/update-password`,
      resetPassword: `${ROOTS.AUTH}/supabase/reset-password`,
    },
  },
  // DASHBOARD
  profile: ROOTS.PROFILE,
};
