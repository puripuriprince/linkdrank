import { paths } from "src/routes/paths";

import type { NavMainProps } from "./main/nav/types";

// ----------------------------------------------------------------------

export const navData: NavMainProps["data"] = [
  { title: "Home", href: "/", icon: "ic:baseline-home" },
  {
    title: "AI Search",
    href: paths.people.aiSearch,
    icon: "ix:ai",
  },
  {
    title: "Search",
    href: paths.search,
    icon: "mdi:magnify",
  },
  {
    title: "Vote",
    icon: "pepicons-pop:down-up",
    href: paths.vote,
  },
];
