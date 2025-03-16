"use client";

import Breadcrumbs from "@/components/app/breadcrumbs";
import {ReactNode} from "react";

export default function GroupsLayout({children}: { children: ReactNode }) {
    return (
        <div className="container mx-auto p-6">
            <Breadcrumbs/>

            {children}
        </div>
    );
}
