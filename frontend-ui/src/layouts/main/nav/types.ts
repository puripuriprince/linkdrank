
/**
 * Item
 */
export type NavItemStateProps = {
  open?: boolean;
  active?: boolean;
};

export type NavItemOptionsProps = {
  subItem?: boolean;
  hasChild?: boolean;
  externalLink?: boolean;
};

export type NavItemDataProps = {
  href: string;
  title: string;
  icon?: string | React.ReactNode;
  children?: {
    subheader: string;
    items: { title: string; path: string }[];
  }[];
};

export type NavItemProps = NavItemDataProps &
  NavItemStateProps &
  NavItemOptionsProps;

/**
 * List
 */
export type NavListProps = React.ComponentProps<'li'> & {
  data: NavItemDataProps;
};

export type NavSubListProps = React.ComponentProps<'li'> & {
  subheader: string;
  data: NavItemDataProps[];
};

/**
 * Main
 */
export type NavMainProps = {
  data: NavItemDataProps[];
};
