"use client";

import { m } from "framer-motion";
import { SimpleLayout } from "@/layouts/simple";
import { RouterLink } from "@/routes/components";
import { Button } from "@/components/ui/button";
import { varBounce } from "@/lib/animation-variants";

// ----------------------------------------------------------------------

export function View500() {
  return (
    <SimpleLayout>
      <div className="flex flex-col items-center text-center">
        <m.div variants={varBounce("in")}>
          <h3 className="text-2xl font-bold mb-2">500 Internal server error</h3>
        </m.div>
        <m.div variants={varBounce("in")} className="mb-8">
          <p className="text-gray-500">
            There was an error, please try again later.
          </p>
        </m.div>
        <Button asChild>
          <RouterLink href="/">Go to home</RouterLink>
        </Button>
      </div>
    </SimpleLayout>
  );
}
