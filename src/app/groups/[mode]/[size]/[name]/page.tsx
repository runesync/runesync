export const runtime = "nodejs";

import {getGroupMembers, getPlayerHiscores, getRuneMetricsProfiles} from "@/lib/api/runescape";
import GroupTabs from '@/components/app/groups/group-tabs';
import {titleCase} from '@/lib/utils';
import GroupSummary from '@/components/app/groups/group-summary';
import {Badge} from '@/components/ui/badge';


export default async function GroupHome({params}: { params: Promise<{ mode: string; size: string; name: string }> }) {
    const {name, size, mode} = await params;

    const groupName = decodeURIComponent(name.replace(/-/g, " "));

    // Fetch group members
    const members = await getGroupMembers(groupName, Number(size), mode === "competitive");
    if (members.length === 0) return <p>No members found for {groupName}.</p>;

    // Fetch all members' hiscores
    const hiscores = await getPlayerHiscores(members);

    // Fetch recent activities
    const activities = await getRuneMetricsProfiles(members);

    return (
        <div>
            <div className="flex flex-col items-start mb-6">
                <h1 className="text-2xl font-bold text-primary">{titleCase(groupName)}</h1>

                <div className="flex flex-wrap gap-2 mt-2">
                    <Badge
                        variant="secondary"
                    >
                        {titleCase(mode)}
                    </Badge>
                    <Badge
                        variant="secondary"
                    >
                        {size}-Player
                    </Badge>
                </div>
            </div>
            <div className="mb-4">
                <GroupSummary members={members} hiscores={hiscores} activities={activities}/>
            </div>
            <GroupTabs groupName={groupName} members={members} hiscores={hiscores} activities={activities}/>
        </div>
    );

}