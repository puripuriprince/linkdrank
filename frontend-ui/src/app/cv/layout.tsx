import { MainLayout } from "@/layouts/main";

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return <MainLayout className="relative">{children}</MainLayout>;
}
