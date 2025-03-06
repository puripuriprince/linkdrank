import { paths } from 'src/routes/paths';

import { Icon } from '@iconify/react';

import type { NavMainProps } from './main/nav/types';

// ----------------------------------------------------------------------

export const navData: NavMainProps['data'] = [
  { title: 'Home', path: '/', icon: <Icon width={22} icon="solar:home-2-bold-duotone" /> },
  {
    title: 'Search',
    path: paths.search,
    icon: <Icon width={22} icon="solar:file-bold-duotone" />,
  },
  {
    title: 'Profile',
    icon: <Icon width={22} icon="solar:notebook-bold-duotone" />,
    path: paths.profile.root,
    children: [
      {
        subheader: 'Profile',
        items: [{ title: 'Profile', path: paths.profile.root }],
      },
      {
        subheader: 'Contact us',
        items: [
          { title: 'Contact us', path: paths.feedback },
        ],
      }
    ],
  },
];
