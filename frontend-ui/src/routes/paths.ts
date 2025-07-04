// ----------------------------------------------------------------------

import { getHandeFromLinkedInURL } from "@/lib/utils";

const ROOTS = {
  AUTH: "/auth",
};

// ----------------------------------------------------------------------

export const paths = {
  cv: {
    root: "/cv",
    edit: "/cv/edit",
  },
  compare: {
    root: "/compare",
    details: (usernames: string | undefined) =>
      `/compare?u=${encodeURIComponent(usernames ?? "")}`,
  },
  feedback: "/feedback",
  browse: {
    root: "/browse",
    details: (query: string | undefined) =>
      `/browse?q=${encodeURIComponent(query ?? "")}`,
  },
  privacy: "/privacy",
  terms: "/terms",
  people: {
    root: "/p/new",
    details: (handle: string | undefined) =>
      `/p/${getHandeFromLinkedInURL(handle ?? "")}`,
  },
  search: {
    root: "/search",
    details: (query: string | undefined) =>
      `/search?q=${encodeURIComponent(query ?? "")}`,
  },
  // AUTH
  auth: {
    signIn: `${ROOTS.AUTH}/sign-in`,
    signUp: `${ROOTS.AUTH}/sign-up`,
  },
};
