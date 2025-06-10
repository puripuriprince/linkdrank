import { paths } from "@/routes/paths";

import type { NavMainProps } from "./main/nav/types";

// ----------------------------------------------------------------------

export const navData: NavMainProps["data"] = [
  {
    title: "Comapre",
    href: paths.compare.root,
    icon: "ic:baseline-home",
  },
  {
    title: "AI Search",
    href: paths.search.root,
    icon: "ix:ai",
  },
  {
    title: "Browse",
    href: paths.browse.root,
    icon: "mdi:magnify",
  },
  {
    title: "Profile",
    icon: "material-symbols:account-circle",
    href: paths.people.root,
  },
];
