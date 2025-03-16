"use client";

import {useState} from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import GroupActivities from "@/components/app/groups/group-activities";
import { PlayerHiscores, RuneMetricsProfile } from "@/types/runescape";
import GroupHiscores from '@/components/app/groups/group-hiscores';

export default function GroupTabs({
                                      members,
                                      hiscores,
                                      activities
                                  }: {
    groupName: string;
    members: string[];
    hiscores: Record<string, PlayerHiscores | null>;
    activities: Record<string, RuneMetricsProfile | null>;
}) {
    const [activeTab, setActiveTab] = useState("hiscores");

    return (
        <div className="mx-auto">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList>
                    <TabsTrigger value="hiscores" className="cursor-pointer">
                        Hiscores
                    </TabsTrigger>
                    <TabsTrigger value="activities" className="cursor-pointer">
                        Recent Activities
                    </TabsTrigger>
                </TabsList>

                <div className="mt-4">
                    <TabsContent value="hiscores" className="p-0">
                        <GroupHiscores members={members} hiscores={hiscores} />
                    </TabsContent>

                    <TabsContent value="activities" className="p-0">
                        <GroupActivities members={members} activities={activities} />
                    </TabsContent>
                </div>
            </Tabs>
        </div>
    );
}
