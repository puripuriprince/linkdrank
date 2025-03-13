import type { Metadata } from 'next';

import { CONFIG } from 'src/global-config';
import {SearchView} from "src/sections/search/view";


// ----------------------------------------------------------------------

export const metadata: Metadata = { title: `Search - ${CONFIG.appName}` };

export default function Search() {
  return <SearchView />;
}
