"use client";

import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {ScrollArea} from "@/components/ui/scroll-area";
import {PlayerHiscores} from "@/types/runescape";
import {getProfilePicture, getSkillIcon} from "@/lib/utilities/icons";
import {calculateMvpRanks, getGroupRankIcon} from "@/lib/utilities/group-mvp";
import {Trophy, Crown} from "lucide-react";

export default function HiscoreTable({
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
    const mvpRanks = calculateMvpRanks(members, hiscores);

    return (
        <ScrollArea className="w-full">
            <div className="overflow-auto">
                <Table className="w-full border-collapse">
                    <TableHeader>
                        <TableRow className="bg-muted">
                            <TableHead className="p-3 text-left">Skill</TableHead>
                            <>
                                {members.map((member) => (
                                    <TableHead key={member} className="p-3 text-center">
                                        <div className="flex flex-col items-center gap-1">
                                            <img
                                                src={getProfilePicture(member)}
                                                alt={`${member}'s Avatar`}
                                                className="w-10 h-10 rounded-full border border-gray-300"
                                                onError={(e) => {
                                                    e.currentTarget.src = "/default-avatar.png"; // Fallback avatar
                                                }}
                                            />
                                            <span className="whitespace-nowrap text-sm font-medium">{member}</span>
                                        </div>
                                    </TableHead>
                                ))}
                            </>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <>
                            {skillNames.map((skillName) => (
                                <TableRow key={skillName} className="hover:bg-muted/50 transition-colors">
                                    <TableCell className="p-3 font-bold flex items-center space-x-2">
                                        <img
                                            src={getSkillIcon(skillName)}
                                            alt={skillName}
                                            className="w-6 h-6 rounded-md shadow-sm"
                                        />
                                        <span className="whitespace-nowrap">{skillName}</span>
                                    </TableCell>
                                    <>
                                        {members.map((member) => {
                                            const memberData = hiscores[member];
                                            const skill = (memberData?.skills ?? []).find((s) => s.name === skillName);
                                            const mvpRank = mvpRanks[skillName]?.[member];

                                            return (
                                                <TableCell key={member} className="p-3 text-center">
                                                    <>
                                                        {skill ? (
                                                            <div className="flex flex-col items-center">
                                                                <div className="flex items-center gap-1">
                                                                    {mvpRank !== undefined && mvpRank !== null && (
                                                                        <span className="text-lg">
                                                                            {getGroupRankIcon(mvpRank)}
                                                                        </span>
                                                                    )}

                                                                    {/* Level display with special denotations */}
                                                                    <span
                                                                        className={`font-medium ${
                                                                            skillName === "Overall"
                                                                                ? "" // No styling for Overall
                                                                                : skill.level >= 120
                                                                                    ? "text-red-500 font-bold" // Level 120 (Red & Bold)
                                                                                    : skill.level >= 99
                                                                                        ? "text-yellow-500 font-semibold" // Level 99 (Gold)
                                                                                        : "text-primary"
                                                                        } flex items-center gap-1`}
                                                                    >
                                                                        Level {skill.level}

                                                                        {/* Icons for Level 99+ (Except Overall) */}
                                                                        {skillName !== "Overall" && (
                                                                            skill.level >= 120 ? (
                                                                                <Crown
                                                                                    className="w-5 h-5 text-red-500 ml-1"/>
                                                                            ) : skill.level >= 99 ? (
                                                                                <Trophy
                                                                                    className="w-5 h-5 text-yellow-500 ml-1"/>
                                                                            ) : null
                                                                        )}
                                                                    </span>
                                                                </div>
                                                                {showXp && (
                                                                    <span className="text-sm text-gray-500">
                                                                        {skill.xp.toLocaleString()} XP
                                                                    </span>
                                                                )}
                                                            </div>
                                                        ) : (
                                                            <span className="text-gray-400">N/A</span>
                                                        )}
                                                    </>
                                                </TableCell>
                                            );
                                        })}
                                    </>
                                </TableRow>
                            ))}
                        </>
                    </TableBody>
                </Table>
            </div>
        </ScrollArea>
    );
}
