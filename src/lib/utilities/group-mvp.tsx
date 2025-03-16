import { PlayerHiscores } from '@/types/runescape';

import { Medal } from "lucide-react";

const MVP_ICONS = [
    { color: "text-yellow-500", number: "1" },  // 🥇 1st - Gold
    { color: "text-gray-300", number: "2" },    // 🥈 2nd - Lighter Silver (More distinct from gray)
    { color: "text-orange-500", number: "3" },  // 🥉 3rd - Bronze
    { color: "text-indigo-500", number: "4" },  // 🔹 4th - Muted Indigo (Less bright than blue)
    { color: "text-indigo-700", number: "5" }      // 5️⃣ 5th - Neutral Dark Gray (Less attention)
];

export const getGroupRankIcon = (rank: number | null) => {
    if (rank === null || rank >= MVP_ICONS.length) return null;

    return (
        <div className="relative inline-block mr-1">
            <Medal className={`w-5 h-5 ${MVP_ICONS[rank].color}`} />
            <span className="absolute -top-1 -right-1 text-xs font-bold text-white bg-black rounded-full px-1">
                {MVP_ICONS[rank].number}
            </span>
        </div>
    );
};

// Function to calculate MVP rankings per skill
export const calculateMvpRanks = (
    members: string[],
    hiscores: Record<string, PlayerHiscores | null>
): Record<string, Record<string, number | null>> => {
    const rankings: Record<string, Record<string, number>> = {}; // skillName -> { player: rankValue }

    // Collect skill level and XP
    members.forEach((member) => {
        const memberData = hiscores[member];
        if (!memberData) return;

        memberData.skills.forEach((skill) => {
            if (!rankings[skill.name]) rankings[skill.name] = {};

            // Calculate a unique value to rank: prioritize level, then XP
            rankings[skill.name][member] = skill.level * 1e12 + skill.xp;
        });
    });

    // Sorting and assigning ranks
    const finalRanks: Record<string, Record<string, number | null>> = {}; // skillName -> { player: rank }

    Object.keys(rankings).forEach((skillName) => {
        const sortedEntries: [string, number | null][] = Object.entries(rankings[skillName])
            .sort((a, b) => b[1] - a[1]) // Sort descending by level & XP
            .map(([player, _], index): [string, number | null] => [player, index < 5 ? index : null]); // Explicit tuple type

        finalRanks[skillName] = Object.fromEntries(sortedEntries);
    });

    return finalRanks;
};
