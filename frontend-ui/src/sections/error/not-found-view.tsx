"use client";

import { m } from "framer-motion";
import { SimpleLayout } from "@/layouts/simple";
import { Button } from "@/components/ui/button";
import RouterLink from "next/link";
import { varBounce } from "@/lib/animation-variants";

// ----------------------------------------------------------------------

export function NotFoundView() {
  return (
    <SimpleLayout>
      <div className="flex flex-col items-center text-center">
        <m.div variants={varBounce("in")}>
          <h3 className="text-2xl font-bold mb-2">Sorry, page not found!</h3>
        </m.div>
        <m.div variants={varBounce("in")} className="mb-8">
          <p className="text-gray-500">
            Sorry, we couldn’t find the page you’re looking for. Perhaps you’ve
            mistyped the URL? Be sure to check your spelling.
          </p>
        </m.div>
        <Button asChild>
          <RouterLink href="/">Go to home</RouterLink>
        </Button>
      </div>
    </SimpleLayout>
  );
}
