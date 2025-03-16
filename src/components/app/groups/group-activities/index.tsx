"use client";

import {useMemo, useState} from "react";
import {RuneMetricsActivity, RuneMetricsProfile} from "@/types/runescape";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {ScrollArea} from "@/components/ui/scroll-area";
import {getProfilePicture, getActivityIcon, getActivityCategory} from '@/lib/utilities/icons';
import ActivityCategoryFilter from '@/components/app/groups/group-activities/activity-category-filter';
import {Separator} from '@/components/ui/separator';

export default function GroupActivities({
                                            members,
                                            activities,
                                        }: {
    members: string[];
    activities: Record<string, RuneMetricsProfile | null>;
}) {
    const [selectedMember, setSelectedMember] = useState<string>("all");
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

    // Extract and sort activities by date (newest first)
    const sortedActivities = useMemo(() => {
        const allActivities: (RuneMetricsActivity & { player: string })[] = [];

        members.forEach((member) => {
            const profile = activities[member];

            // Ignore private profiles (which have an "error" field)
            if (!profile || profile.error) return;

            if (profile.activities) {
                profile.activities.forEach((activity) => {
                    allActivities.push({...activity, player: member});
                });
            }
        });

        return allActivities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [members, activities]);

    // Filter activities by selected player & selected categories
    const filteredActivities = useMemo(() => {
        return sortedActivities.filter((activity) => {
            const category = getActivityCategory(activity.text);

            // Player filter
            const playerMatch = selectedMember === "all" || activity.player === selectedMember;

            // Category filter (if any categories are selected, match only those)
            const categoryMatch = selectedCategories.length === 0 || (category && selectedCategories.includes(category));

            return playerMatch && categoryMatch;
        });
    }, [sortedActivities, selectedMember, selectedCategories]);

    return (
        <div className="mx-auto flex flex-col min-h-screen">
            <Card className="shadow-lg rounded-lg flex flex-col flex-grow">
                <CardHeader className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
                    <CardTitle className="text-xl font-semibold">Recent Group Activities</CardTitle>
                    <div className="flex gap-4">
                        {/* Player Filter */}
                        <Select onValueChange={setSelectedMember} defaultValue="all">
                            <SelectTrigger className="w-64 cursor-pointer">
                                <SelectValue placeholder="Filter by member"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all" className="cursor-pointer">All Members</SelectItem>
                                <Separator className="my-2"/>
                                <>
                                    {members.map((member) => (
                                        <SelectItem key={member} value={member} className="cursor-pointer">
                                            {member}
                                        </SelectItem>
                                    ))}
                                </>
                            </SelectContent>
                        </Select>

                        {/* Category Filter */}
                        <ActivityCategoryFilter selectedCategories={selectedCategories}
                                                onSelect={setSelectedCategories}/>
                    </div>
                </CardHeader>
                <CardContent className="flex-grow overflow-hidden">
                    <>
                        {filteredActivities.length === 0 ? (
                            <p className="text-center text-gray-500">No recent activities found.</p>
                        ) : (
                            <ScrollArea className="h-full overflow-auto">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {filteredActivities.map((activity, index) => {
                                        const activityIcon = getActivityIcon(activity.text);

                                        return (
                                            <div
                                                key={index}
                                                className="flex flex-col space-y-2 border p-4 rounded-lg shadow-md bg-background"
                                            >
                                                <p className="text-gray-500 text-xs">{activity.date}</p>

                                                {/* Player Info with Profile Picture */}
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={getProfilePicture(activity.player)}
                                                        alt={`${activity.player}'s Avatar`}
                                                        className="w-10 h-10 rounded-full border border-gray-300"
                                                        onError={(e) => {
                                                            e.currentTarget.src = "/default-avatar.png"; // Fallback avatar
                                                        }}
                                                    />
                                                    <h3 className="text-lg font-semibold text-primary">{activity.player}</h3>
                                                </div>

                                                {/* Activity Details with Icon */}
                                                <div className="bg-muted p-3 rounded-md flex items-center gap-3">
                                                    {activityIcon &&
                                                        <img src={activityIcon} alt="Activity Icon"
                                                             className="w-6 h-6"/>
                                                    }
                                                    <p className="text-lg font-semibold text-foreground">{activity.text}</p>
                                                </div>
                                                <p className="text-gray-600 text-sm">{activity.details}</p>
                                            </div>
                                        );
                                    })}
                                </div>
                            </ScrollArea>
                        )}
                    </>
                </CardContent>
            </Card>
        </div>
    );
}