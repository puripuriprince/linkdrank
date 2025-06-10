"use client";

import { m } from "framer-motion";
import { SimpleLayout } from "@/layouts/simple";
import { RouterLink } from "@/routes/components";
import { Button } from "@/components/ui/button";
import { varBounce } from "@/lib/animation-variants";
import { GhostIcon } from "lucide-react";
import Link from "next/link";

// ----------------------------------------------------------------------

export function View500() {
  return (
    <SimpleLayout>
			<div className="flex flex-col items-center text-center">
				<div className="mb-5 rounded-full bg-muted p-6">
					<GhostIcon className="h-12 w-12 text-muted-foreground" />
				</div>
				<h1 className="mb-2 font-bold text-4xl">500 Internal server error</h1>
        <p className="mb-8 max-w-md text-muted-foreground">
        There was an error, please try again later.
				</p>
				<div className="flex gap-4">
					<Button asChild variant="default">
						<Link href="/">Go Home</Link>
					</Button>
					<Button asChild variant="outline">
						<Link href="/p/new">Add a LinkedIn Profile</Link>
					</Button>
				</div>
			</div>
    </SimpleLayout>
  );
}
