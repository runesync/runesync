"use client";

import {useState} from "react";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {PlayerHiscores, RuneMetricsProfile} from "@/types/runescape";
import {getProfilePicture} from "@/lib/utilities/icons";
import {Popover, PopoverTrigger, PopoverContent} from "@/components/ui/popover";
import {AlertCircle, Trophy, ScrollText, Activity} from "lucide-react";

export default function GroupSummary({
                                         members,
                                         hiscores,
                                         activities,
                                     }: {
    members: string[];
    hiscores: Record<string, PlayerHiscores | null>;
    activities: Record<string, RuneMetricsProfile | null>;
}) {
    const [errorOpen, setErrorOpen] = useState(false);

    // Total XP & Levels
    const {totalGroupXP, totalGroupLevel} = members.reduce(
        (acc, member) => {
            const overall = (hiscores[member]?.skills ?? []).find((s) => s.name === "Overall");
            if (overall) {
                acc.totalGroupXP += overall.xp;
                acc.totalGroupLevel += overall.level;
            }
            return acc;
        },
        {totalGroupXP: 0, totalGroupLevel: 0}
    );

    // Top XP/Level Member
    const topMember = members
        .map((member) => {
            const overall = (hiscores[member]?.skills ?? []).find((s) => s.name === "Overall");
            return {member, level: overall?.level ?? 0, xp: overall?.xp ?? 0};
        })
        .sort((a, b) => b.level - a.level || b.xp - a.xp)[0];

    // Most Recent Activity
    const allActivities = members.flatMap((member) => {
        return (activities[member]?.activities ?? []).map((activity) => ({
            ...activity,
            player: member,
        }));
    });

    const recentActivity = allActivities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

    // Quest Completion & Errors
    let totalQuestsCompleted = 0;
    let totalPossibleQuests = 0;
    const erroredPlayers: string[] = [];

    members.forEach((member) => {
        const profile = activities[member];

        if (profile?.error) {
            erroredPlayers.push(member);
        } else {
            totalQuestsCompleted += profile?.questscomplete ?? 0;
            totalPossibleQuests += (profile?.questscomplete ?? 0) +
                (profile?.questsnotstarted ?? 0) +
                (profile?.questsstarted ?? 0);
        }
    });

    return (
        <Card className="shadow-md p-4">
            <CardHeader className="flex justify-between items-center">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    Group Summary
                </CardTitle>

                {/* Error Indicator */}
                <>
                    {erroredPlayers.length > 0 && (
                        <Popover open={errorOpen} onOpenChange={setErrorOpen}>
                            <PopoverTrigger className="relative cursor-pointer">
                            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
                                Data Incomplete
                                <AlertCircle className="ml-1 w-4 h-4"/>
                            </span>
                            </PopoverTrigger>
                            <PopoverContent className="p-2 text-sm">
                                <p className="text-red-600 font-semibold">Could not fetch data for:</p>
                                <ul className="mt-1 list-disc pl-4 text-gray-700">
                                    {erroredPlayers.map((player) => (
                                        <li key={player}>{player}</li>
                                    ))}
                                </ul>
                            </PopoverContent>
                        </Popover>
                    )}
                </>
            </CardHeader>

            <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                {/* Total XP & Levels */}
                <div className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-yellow-500"/>
                    <div>
                        <p className="text-gray-600">Total XP</p>
                        <p className="font-bold text-primary">{totalGroupXP.toLocaleString()} XP</p>
                        <p className="text-xs text-gray-500">{totalGroupLevel.toLocaleString()} levels</p>
                    </div>
                </div>

                {/* Top Member */}
                <>
                    {topMember && (
                        <div className="flex items-center gap-2">
                            <img
                                src={getProfilePicture(topMember.member)}
                                alt={`${topMember.member}'s Avatar`}
                                className="w-8 h-8 rounded-full border border-gray-300"
                            />
                            <div>
                                <p className="text-gray-600">Top Player</p>
                                <p className="font-semibold">{topMember.member}</p>
                                <p className="text-xs text-gray-500">
                                    Level {topMember.level} - {topMember.xp.toLocaleString()} XP
                                </p>
                            </div>
                        </div>
                    )}
                </>

                {/* Total Quests Completed */}
                <div className="flex items-center gap-2">
                    <ScrollText className="w-5 h-5 text-blue-500"/>
                    <div>
                        <p className="text-gray-600">Quests Completed</p>
                        <p className="font-bold text-primary">{totalQuestsCompleted}</p>
                        <p className="text-xs text-gray-500">{totalPossibleQuests} possible</p>
                    </div>
                </div>

                {/* Most Recent Activity */}
                <>
                    {recentActivity && (
                        <div className="flex items-center gap-2">
                            <Activity className="w-5 h-5 text-green-500"/>
                            <div>
                                <p className="text-gray-600">Recent Activity</p>
                                <p className="font-semibold">{recentActivity.text}</p>
                                <p className="text-xs text-gray-500">
                                    {recentActivity.player} - {new Date(recentActivity.date).toLocaleString()}
                                </p>
                            </div>
                        </div>
                    )}
                </>
            </CardContent>
        </Card>
    );
}
