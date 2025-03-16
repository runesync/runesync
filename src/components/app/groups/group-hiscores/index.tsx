"use client";

import {useState, useMemo} from "react";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {useMediaQuery} from "@/hooks/use-media-query";
import {PlayerHiscores} from "@/types/runescape";
import SkillFilter from '@/components/app/skill-filter';
import XpToggle from '@/components/app/xp-toggle';
import HiscoreCards from '@/components/app/groups/group-hiscores/hiscore-cards';
import HiscoreTable from '@/components/app/groups/group-hiscores/hiscore-table';
import {useXpToggleStore} from '@/stores/use-xp-toggle-store';

export default function GroupHiscores({
                                               members,
                                               hiscores,
                                           }: {
    members: string[];
    hiscores: Record<string, PlayerHiscores | null>;
}) {
    const toggleName = 'group-xp-toggle';
    const showXp = useXpToggleStore((state) => state.toggles[toggleName] ?? false);
    const isMobile = useMediaQuery("(max-width: 768px)");
    const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

    const sortedMembers = [...members].sort((a, b) => {
        const aData = (hiscores[a]?.skills ?? []).find((s) => s.name === "Overall");
        const bData = (hiscores[b]?.skills ?? []).find((s) => s.name === "Overall");

        if (!aData || !bData) return 0; // Handle missing data gracefully

        return bData.level - aData.level || bData.xp - aData.xp;
    });

    const firstMemberData = hiscores[sortedMembers[0]] ?? null;
    if (!firstMemberData) return <p>Failed to load hiscore data.</p>;

    const skillNames = firstMemberData.skills.map((skill) => skill.name);
    const filteredSkills = selectedSkills.length > 0 ? selectedSkills : skillNames;

    return (
        <div className="mx-auto">
            <Card className="shadow-lg">
                <CardHeader className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                    <CardTitle className="text-xl font-semibold">Group Members&apos; Hiscores</CardTitle>
                    <div className="flex flex-col sm:flex-row gap-4 items-center">
                        <SkillFilter skillNames={skillNames} selectedSkills={selectedSkills} onSelect={setSelectedSkills} />
                        <XpToggle enablePersist storageKey={toggleName} />
                    </div>
                </CardHeader>
                <CardContent>
                    <>
                        {isMobile ? (
                            <HiscoreCards members={sortedMembers}
                                          hiscores={hiscores}
                                          skillNames={filteredSkills}
                                          showXp={showXp}/>
                        ) : (
                            <HiscoreTable members={sortedMembers}
                                          hiscores={hiscores}
                                          skillNames={filteredSkills}
                                          showXp={showXp}/>
                        )}
                    </>
                </CardContent>
            </Card>
        </div>
    );
}
