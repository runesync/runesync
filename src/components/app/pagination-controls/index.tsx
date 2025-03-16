"use client";

import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function PaginationControls({ currentPage, totalPages }: { currentPage: number; totalPages: number }) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const updatePage = (newPage: number) => {
        const params = new URLSearchParams(searchParams);
        params.set("page", newPage.toString());
        router.push(`${pathname}?${params.toString()}`);
    };

    return (
        <div className="flex justify-between items-center mt-4">
            <Button onClick={() => updatePage(currentPage - 1)} disabled={currentPage <= 0} className="cursor-pointer">
                Previous
            </Button>
            <span>Page {currentPage + 1} of {totalPages}</span>
            <Button onClick={() => updatePage(currentPage + 1)} disabled={currentPage >= totalPages - 1} className="cursor-pointer">
                Next
            </Button>
        </div>
    );
}
