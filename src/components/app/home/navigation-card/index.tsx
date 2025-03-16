"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function NavigationCard() {
    return (
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle className="text-lg">Explore Group Ironman Rankings</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
                <Link href="/groups">
                    <Button className="w-full cursor-pointer">View Groups</Button>
                </Link>
            </CardContent>
        </Card>
    );
}
