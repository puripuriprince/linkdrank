import { paths } from "src/routes/paths";

import type { NavMainProps } from "./main/nav/types";

// ----------------------------------------------------------------------

export const navData: NavMainProps["data"] = [
  { title: "Home", href: "/", icon: "solar:home-2-bold-duotone" },
  {
    title: "Search",
    href: paths.search,
    icon: "solar:file-bold-duotone",
  },
  {
    title: "Profile",
    icon: "solar:notebook-bold-duotone",
    href: paths.profile.root,
    children: [
      {
        subheader: "Profile",
        items: [{ title: "Profile", path: paths.profile.root }],
      },
      {
        subheader: "Contact us",
        items: [{ title: "Contact us", path: paths.feedback }],
      },
    ],
  },
];
