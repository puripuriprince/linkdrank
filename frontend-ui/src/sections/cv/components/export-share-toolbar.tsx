"use client";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Check, ChevronDown, Download, FileText, Link, Loader2, Share2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface ExportShareToolbarProps {
	onExportLatex?: () => void;
	onExportLatexPDF?: () => void;
	onExportDocx?: () => void;
	onExportLatexSource?: () => void;
	onShareLink?: () => void;
	onCopyLink?: () => void;
	shareUrl?: string;
	isExporting?: boolean;
	isExportingLatex?: boolean;
	latexExportMethod?: "source" | "server" | "client" | null;
	isGeneratingLink?: boolean;
	className?: string;
	position?: "bottom" | "top";
}

export function ExportShareToolbar({
	onExportLatex,
	onExportLatexPDF,
	onExportDocx,
	onExportLatexSource,
	onShareLink,
	onCopyLink,
	shareUrl,
	isExporting = false,
	isExportingLatex = false,
	latexExportMethod = null,
	isGeneratingLink = false,
	className,
	position = "bottom",
}: ExportShareToolbarProps) {
	const [copied, setCopied] = useState(false);

	const handleCopyLink = async () => {
		if (!shareUrl) {
			if (onCopyLink) {
				onCopyLink();
			}
			return;
		}

		try {
			await navigator.clipboard.writeText(shareUrl);
			setCopied(true);
			toast.success("Link copied to clipboard");
			setTimeout(() => setCopied(false), 2000);
		} catch (error) {
			toast.error("Failed to copy link");
		}
	};

	const handleShare = async () => {
		if (!shareUrl) {
			if (onShareLink) {
				onShareLink();
			}
			return;
		}

		if (navigator.share) {
			try {
				await navigator.share({
					title: "My CV",
					text: "Check out my CV",
					url: shareUrl,
				});
			} catch (error) {
				// User cancelled or error occurred
				handleCopyLink();
			}
		} else {
			handleCopyLink();
		}
	};

	const positionClasses = {
		bottom: "bottom-4",
		top: "top-4",
	};

	const getExportButtonText = () => {
		if (isExporting) return "Exporting...";
		if (isExportingLatex) {
			if (latexExportMethod === "source") return "Generating...";
			if (latexExportMethod === "server") return "Compiling...";
			if (latexExportMethod === "client") return "Processing...";
			return "Processing...";
		}
		return "Export";
	};

	const getExportButtonIcon = () => {
		if (isExporting || isExportingLatex) {
			return <Loader2 className="size-4 animate-spin" />;
		}
		return <Download className="size-4" />;
	};

	return (
		<TooltipProvider delayDuration={200}>
			<div
				className={cn(
					"-translate-x-1/2 fixed left-1/2 z-50 transform",
					positionClasses[position],
					className,
				)}
			>
				<div className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 shadow-lg backdrop-blur-sm">
					{/* Export Dropdown */}
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant="ghost"
								size="sm"
								className="hidden h-8 rounded-full px-3 transition-all duration-200 hover:bg-blue-50 hover:text-blue-600 sm:flex dark:hover:bg-blue-950/20"
								disabled={isExporting || isExportingLatex}
							>
								{getExportButtonIcon()}
								<span className="font-medium text-sm">
									{getExportButtonText()}
								</span>
								<ChevronDown className="ml-1 size-3" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="center">
							<DropdownMenuItem onClick={onExportLatexPDF} disabled={isExporting || isExportingLatex}>
								<FileText className="mr-2 size-4" />
								Export as PDF
							</DropdownMenuItem>
							<DropdownMenuItem onClick={onExportDocx} disabled={isExporting || isExportingLatex}>
								<FileText className="mr-2 size-4" />
								Export as DOCX
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem onClick={onExportLatexSource} disabled={isExporting || isExportingLatex}>
								<Download className="mr-2 size-4" />
								Download LaTeX Source
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>

					{/* Mobile Export Dropdown */}
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant="ghost"
								size="sm"
								className="h-8 w-8 rounded-full p-0 transition-all duration-200 hover:bg-blue-50 hover:text-blue-600 sm:hidden dark:hover:bg-blue-950/20"
								disabled={isExporting || isExportingLatex}
							>
								{getExportButtonIcon()}
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="center">
							<DropdownMenuItem onClick={onExportLatexPDF} disabled={isExporting || isExportingLatex}>
								<FileText className="mr-2 size-4" />
								Export as PDF
							</DropdownMenuItem>
							{/*<DropdownMenuItem onClick={onExportDocx} disabled={isExporting || isExportingLatex}>
								<FileText className="mr-2 size-4" />
								Export as DOCX
							</DropdownMenuItem>*/}
							<DropdownMenuSeparator />
							<DropdownMenuItem onClick={onExportLatexSource} disabled={isExporting || isExportingLatex}>
								<Download className="mr-2 size-4" />
								Download LaTeX Source
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>

					{/* Share Button */}
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								variant="ghost"
								size="sm"
								className="hidden h-8 rounded-full px-3 transition-all duration-200 hover:bg-green-50 hover:text-green-600 sm:flex dark:hover:bg-green-950/20"
								onClick={handleShare}
								disabled={isGeneratingLink}
							>
								{isGeneratingLink ? (
									<Loader2 className="size-4 animate-spin" />
								) : (
									<Share2 className="size-4" />
								)}
								<span className="font-medium text-sm">
									{isGeneratingLink ? "Generating..." : "Share"}
								</span>
							</Button>
						</TooltipTrigger>
						<TooltipContent side={position === "bottom" ? "top" : "bottom"}>
							<p>Share your CV</p>
						</TooltipContent>
					</Tooltip>

					{/* Mobile Share */}
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								variant="ghost"
								size="sm"
								className="h-8 w-8 rounded-full p-0 transition-all duration-200 hover:bg-green-50 hover:text-green-600 sm:hidden dark:hover:bg-green-950/20"
								onClick={handleShare}
								disabled={isGeneratingLink}
							>
								{isGeneratingLink ? (
									<Loader2 className="size-4 animate-spin" />
								) : (
									<Share2 className="size-4" />
								)}
							</Button>
						</TooltipTrigger>
						<TooltipContent side={position === "bottom" ? "top" : "bottom"}>
							<p>Share CV</p>
						</TooltipContent>
					</Tooltip>

					{/* Quick Actions */}
					<div className="flex items-center space-x-1 border-border border-l pl-2">
						{/* Quick Copy Link */}
						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									variant="ghost"
									size="sm"
									className="h-8 w-8 rounded-full p-0 transition-all duration-200 hover:bg-muted"
									onClick={handleCopyLink}
									disabled={isGeneratingLink}
								>
									{copied ? (
										<Check className="size-4 text-green-600" />
									) : (
										<Link className="size-4" />
									)}
								</Button>
							</TooltipTrigger>
							<TooltipContent side={position === "bottom" ? "top" : "bottom"}>
								<p>{copied ? "Copied!" : "Quick copy link"}</p>
							</TooltipContent>
						</Tooltip>

						{/* Primary Action - View CV */}
						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									className="h-8 rounded-full bg-primary px-4 text-primary-foreground shadow-lg transition-all duration-200 hover:bg-primary/90 hover:shadow-xl"
									onClick={() => shareUrl && window.open(shareUrl, "_blank")}
									disabled={!shareUrl || isGeneratingLink}
								>
									<FileText className="size-4" />
									<span className="hidden font-medium sm:inline">View CV</span>
								</Button>
							</TooltipTrigger>
							<TooltipContent side={position === "bottom" ? "top" : "bottom"}>
								<p>View your CV in a new tab</p>
							</TooltipContent>
						</Tooltip>
					</div>
				</div>
			</div>
		</TooltipProvider>
	);
}


