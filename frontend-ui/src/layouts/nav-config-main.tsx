import { paths } from "@/routes/paths";

import type { NavMainProps } from "./main/nav/types";

// ----------------------------------------------------------------------

export const navData: NavMainProps["data"] = [
  { title: "Home", href: "/", icon: "ic:baseline-home" },
  {
    title: "AI Search",
    href: paths.people.root,
    icon: "ix:ai",
  },
  {
    title: "Browse",
    href: paths.browse,
    icon: "mdi:magnify",
  },
  {
    title: "Vote",
    icon: "pepicons-pop:down-up",
    href: paths.vote,
  },
];
