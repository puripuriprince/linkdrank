/**
 * Item
 */
export type NavItemDataProps = {
  href: string;
  title: string;
  icon?: string | React.ReactNode;
};

/**
 * Main
 */
export type NavMainProps = {
  data: NavItemDataProps[];
};
