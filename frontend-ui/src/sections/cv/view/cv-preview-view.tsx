import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { Download, Edit, Share } from "lucide-react";
import { CVPreview } from "../components/cv-preview";
import { CV_PRESETS } from "@/_mock";
import { cn } from "@/lib/utils";

export function CVPreviewView() {
    const demoCV = CV_PRESETS["anthony-cueva"];
    const cv = demoCV; // TODO: get cv from user

	return (
		<main className="flex flex-1 flex-col py-8">
				<div className="mx-auto w-full max-w-4xl px-4">
					{/* CV Preview - Clean Design */}
					<div className="mb-8 rounded-lg border border-border bg-background p-8 shadow-sm">
						<CVPreview cvData={cv || demoCV} showToolbar={true} />
					</div>

					{/* Minimal Call to Action */}
					<div className="border-border/50 border-t py-6 text-center">
						<div className="mx-auto max-w-lg space-y-3">
							<h2 className="font-medium text-lg">Ready to create your own?</h2>
							<p className="text-muted-foreground text-sm">
								Upload your CV or start from scratch with our intelligent editor
							</p>
							<div className="flex justify-center gap-3 pt-3">
								<Link
									href="/cv/edit"
									className={cn(
										buttonVariants({ variant: "default" }),
										"flex items-center gap-2",
									)}
								>
									<Edit className="h-4 w-4" />
									Create Your CV
								</Link>
							</div>
						</div>
					</div>
				</div>
			</main>
	);
}