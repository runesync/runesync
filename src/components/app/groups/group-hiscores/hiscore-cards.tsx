"use client";

import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {PlayerHiscores} from "@/types/runescape";
import {getSkillIcon} from '@/lib/utilities/icons';

export default function HiscoreCards({
                                         members,
                                         hiscores,
                                         skillNames,
                                         showXp,
                                     }: {
    members: string[];
    hiscores: Record<string, PlayerHiscores | null>;
    skillNames: string[];
    showXp: boolean;
}) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {skillNames.map((skillName) => (
                <Card key={skillName} className="shadow-md">
                    <CardHeader>
                        <CardTitle className="font-bold flex items-center space-x-2">
                            <img
                                src={getSkillIcon(skillName)}
                                alt={skillName}
                                className="w-6 h-6 mr-2"
                            />
                            <span className="whitespace-nowrap">{skillName}</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-2">
                            {members.map((member) => {
                                const memberData = hiscores[member];
                                const skill = (memberData?.skills ?? []).find((s) => s.name === skillName);

                                return (
                                    <li key={member} className="flex justify-between">
                                        <span className="font-medium">{member}</span>
                                        <div className="text-right">
                                            <span className="font-bold">Lvl {skill?.level ?? "N/A"}</span>
                                            {showXp && skill && (
                                                <span className="block text-sm text-gray-500">
                                                  {skill.xp.toLocaleString()} XP
                                                </span>
                                            )}
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
