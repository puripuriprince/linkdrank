'use client';
import {ReactNode, useEffect, useRef} from "react";
import { Icon } from "@iconify/react";
interface InfiniteScrollProps {
    /** The content to render inside the infinite scroll container */
    children: ReactNode;
    /** Function to call when more items should be loaded */
    loadMore: () => void;
    /** Whether there are more items to load */
    hasMore?: boolean;
    /** Whether items are currently loading */
    isLoading?: boolean;
    /** Message to display when there are no more items */
    endMessage?: ReactNode;
    /** Message to display when items are loading */
    loadingMessage?: string;
    /** Threshold for when to trigger the loadMore function (0-1) */
    threshold?: number;
    /** Additional className to apply to the container */
    className?: string;
}

export function InfiniteScroll({
                                   children,
                                   loadMore,
                                   hasMore = true,
                                   isLoading = false,
                                   endMessage,
                                   loadingMessage = "Loading...",
                                   threshold = 0.5,
                                   className = "",
                               }: InfiniteScrollProps) {
    const observerRef = useRef(null);

    useEffect(() => {
        const currentElement = observerRef.current;
        if (!currentElement || isLoading || !hasMore) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && hasMore && !isLoading) {
                    loadMore();
                }
            },
            { threshold, rootMargin: "200px" }
        );

        observer.observe(currentElement);
        return () => {
            if (currentElement) observer.unobserve(currentElement);
        };
    }, [hasMore, isLoading, loadMore, threshold]);

    return (
        <div className={className}>
            {children}

            <div ref={observerRef} className="w-full py-4">
                {isLoading && (
                    <div className="flex w-full flex-col items-center justify-center gap-2 py-4">
                        <Icon
                            icon="line-md:loading-twotone-loop"
                            className="h-8 w-8 text-primary"
                        />
                        <span className="text-sm text-muted-foreground">{loadingMessage}</span>
                    </div>
                )}

                {!hasMore && !isLoading && endMessage && (
                    <div className="flex w-full justify-center py-4">
                        <div className="rounded-lg border border-muted bg-muted/20 px-4 py-2 text-sm text-muted-foreground">
                            {endMessage}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}