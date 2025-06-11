"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import CompareMetricsPlayground from "../components/compare-metrics-playground";

export function CompareView() {
    const users = useSearchParams().get("u");

    return (
        <div className="mx-auto w-full px-4 py-8 lg:px-10">
            <div className="mx-auto w-full">

                <Suspense
                    fallback={
                        <div className="py-12 text-center">
                            Loading comparison tool...
                        </div>
                    }
                >
                    <CompareMetricsPlayground users={users} />
                </Suspense>
            </div>
        </div>
    );
}