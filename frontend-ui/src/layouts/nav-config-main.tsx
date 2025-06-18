import { paths } from "@/routes/paths";

import type { NavMainProps } from "./main/nav/types";

// ----------------------------------------------------------------------

export const navData: NavMainProps["data"] = [
  {
    title: "AI Search",
    href: paths.search.root,
    icon: "ix:ai",
  },
  {
    title: "Comapre",
    href: paths.compare.root,
    icon: "ic:baseline-balance",
  },
  {
    title: "Browse",
    href: paths.browse.root,
    icon: "mdi:magnify",
  },
  {
    title: "CV Editor",
    href: paths.cv.edit,
    icon: "mdi:file-edit",
  },
  {
    title: "Add Profile",
    icon: "material-symbols:account-circle",
    href: paths.people.root,
  },
];
