"use client";

import {useState} from "react";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {GroupIronmanEntry} from "@/types/runescape";
import {PaginationControls} from "@/components/app/pagination-controls";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Badge} from "@/components/ui/badge";
import {Loader2} from "lucide-react";

export default function GroupsLeaderboard({
                                              groups,
                                              currentPage,
                                              totalPages,
                                              totalGroups,
                                              currentSize = 5,
                                          }: {
    groups: GroupIronmanEntry[];
    currentPage: number;
    totalPages: number;
    totalGroups: number;
    currentSize: number;
}) {
    const [isLoading, setIsLoading] = useState(false);
    const [loadingGroup, setLoadingGroup] = useState<string | null>(null);
    const router = useRouter();

    const hasRegular = groups.some(entry => !entry.isCompetitive && !entry.isCustom);
    const hasCompetitive = groups.some(entry => entry.isCompetitive);
    const hasCustom = groups.some(entry => entry.isCustom);

    // Handle badge clicks to switch modes while keeping the same size
    const handleModeRedirect = (mode: "competitive" | "regular" | "custom") => {
        router.push(`/groups/${mode}/${currentSize}`);
    };

    // Handle group click with loading state
    const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, group: GroupIronmanEntry) => {
        e.preventDefault();
        if (isLoading) return; // Prevent spam clicking

        setIsLoading(true);
        setLoadingGroup(group.name);
        router.push(`/groups/${group.isCompetitive ? "competitive" : "regular"}/${group.size}/${group.name.replace(/ /g, "-")}`);
    };

    return (
        <div className="container mx-auto p-6">
            <Card>
                <CardHeader>
                    <CardTitle>Group Ironman Hiscores</CardTitle>
                    <p>Total Groups: {totalGroups}</p>
                    <div className="flex gap-2 mt-2">
                        {/* Mode Switching Badges */}
                        <Badge
                            variant={hasCompetitive ? "default" : "secondary"}
                            className="cursor-pointer"
                            onClick={() => handleModeRedirect("competitive")}
                        >
                            Competitive
                        </Badge>
                        <Badge
                            variant={hasRegular ? "default" : "secondary"}
                            className="cursor-pointer"
                            onClick={() => handleModeRedirect("regular")}
                        >
                            Regular
                        </Badge>
                        <Badge
                            variant={hasCustom ? "default" : "secondary"}
                            className="cursor-pointer"
                            onClick={() => handleModeRedirect("custom")}
                        >
                            Custom
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Rank</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Mode</TableHead>
                                <TableHead>Size</TableHead>
                                <TableHead>Level</TableHead>
                                <TableHead>XP</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <>
                                {groups.length ? (
                                    groups.map((group, index) => (
                                        <TableRow key={group.id}>
                                            {/* Rank Calculation */}
                                            <TableCell className="font-bold">
                                                {(currentPage * 20) + index + 1}
                                            </TableCell>

                                            {/* Group Name with Link */}
                                            <TableCell className="font-bold">
                                                <Link
                                                    href={`/groups/${group.isCompetitive ? "competitive" : "regular"}/${group.size}/${group.name.replace(/ /g, "-")}`}
                                                    onClick={(e) => handleClick(e, group)}
                                                    className={`text-blue-500 hover:underline flex items-center gap-2 ${
                                                        isLoading && loadingGroup === group.name ? "opacity-50 pointer-events-none" : ""
                                                    }`}
                                                >
                                                    <>
                                                        {group.name}
                                                        {isLoading && loadingGroup === group.name && (
                                                            <Loader2 className="w-4 h-4 animate-spin text-blue-500"/>
                                                        )}
                                                    </>
                                                </Link>
                                            </TableCell>

                                            {/* Competitive vs Regular Mode */}
                                            <TableCell>
                                                <Badge variant={group.isCompetitive ? "destructive" : "secondary"}>
                                                    {group.isCompetitive ? "Competitive" : "Regular"}
                                                </Badge>
                                            </TableCell>

                                            {/* Group Size */}
                                            <TableCell>{group.size}</TableCell>

                                            {/* Total Level */}
                                            <TableCell>{group.groupTotalLevel.toLocaleString()}</TableCell>

                                            {/* Total XP */}
                                            <TableCell>{group.groupTotalXp.toLocaleString()}</TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center">
                                            No data available
                                        </TableCell>
                                    </TableRow>
                                )}
                            </>
                        </TableBody>
                    </Table>

                    {/* Pagination */}
                    <PaginationControls currentPage={currentPage} totalPages={totalPages}/>
                </CardContent>
            </Card>
        </div>
    );
}