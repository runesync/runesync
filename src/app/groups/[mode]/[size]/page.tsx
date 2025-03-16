import {getGroupIronmanHiscores} from "@/lib/api/runescape";
import {GroupIronmanEntry, GroupIronmanHiscores} from "@/types/runescape";
import GroupsLeaderboard from '@/components/app/groups/groups-leaderboard';

export default async function GroupsModeSizeHome({params, searchParams}: {
    params: Promise<{ mode: string; size: string }>;
    searchParams: Promise<{ page?: string }>
}) {
    const {size, mode} = await params;
    const {page} = await searchParams;
    const currentPage = Number(page) || 0;
    const pageSize = 20;

    if (mode === "custom") {
        return <>Custom groups are not currently supported</>
    }

    const hiscores: GroupIronmanHiscores | null = await getGroupIronmanHiscores(
        Number(size),
        pageSize,
        currentPage,
        mode === "competitive"
    );

    const groupEntries: GroupIronmanEntry[] = hiscores?.content ?? [];

    if (!hiscores) {
        return <p>Failed to load hiscores. Please try again later.</p>;
    }

    return (
        <GroupsLeaderboard groups={groupEntries}
                           currentPage={currentPage}
                           totalGroups={hiscores.totalElements}
                           totalPages={hiscores.totalPages}
                           currentSize={Number(size)} />
    );
}