"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import {titleCase} from '@/lib/utils';

export default function Breadcrumbs() {
    const pathname = usePathname();
    const segments = pathname.split("/").filter(Boolean); // Split path and remove empty segments

    if (segments.length < 1) return null; // Don't show breadcrumbs on the main page

    return (
        <nav className="mb-4 text-sm text-gray-600 dark:text-gray-300">
            <ul className="flex items-center gap-2">
                <li>
                    <Link href="/" className="hover:underline text-primary">
                        Home
                    </Link>
                </li>
                {segments.map((segment, index) => {
                    const path = `/${segments.slice(0, index + 1).join("/")}`;
                    const isLast = index === segments.length - 1;

                    return (
                        <li key={path} className="flex items-center gap-2">
                            <ChevronRight className="w-4 h-4 text-gray-400" />
                            {!isLast ? (
                                <Link href={path} className="hover:underline text-primary">
                                    {titleCase(decodeURIComponent(segment.replace(/-/g, " ")))}
                                </Link>
                            ) : (
                                <span className="text-gray-500">{titleCase(decodeURIComponent(segment.replace(/-/g, " ")))}</span>
                            )}
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}
