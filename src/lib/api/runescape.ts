import {GroupIronmanEntry, GroupIronmanHiscores, RuneMetricsProfile} from '@/types/runescape';
import { PlayerHiscores } from "@/types/runescape";
import * as cheerio from "cheerio";
export async function getGroupIronmanHiscores(
    groupSize: number = 5,
    size: number = 20,
    page: number = 0,
    isCompetitive: boolean = true
): Promise<GroupIronmanHiscores | null> {
    console.log('get gimhs');
    const baseUrl = "https://secure.runescape.com/m=runescape_gim_hiscores/v1/groupScores";

    // Use URLSearchParams to construct query params cleanly
    const params = new URLSearchParams({
        groupSize: groupSize.toString(),
        size: size.toString(),
        page: page.toString(),
        isCompetitive: isCompetitive.toString(),
    });

    console.log('get gimhs params', params);

    const url = `${baseUrl}?${params.toString()}`;

    try {
        const res = await fetch(url, { cache: "no-store" });

        if (!res.ok) {
            throw new Error(`Failed to fetch data: ${res.statusText}`);
        }

        const data = (await res.json()) as GroupIronmanHiscores;

        // Ensure content is always an array to prevent runtime issues
        return { ...data, content: data.content || [] };
    } catch (error) {
        console.error("Error fetching Group Ironman Hiscores:", error);
        return null;
    }
}

/* Commenting out as may need later
const PAGE_SIZE = 20;  // UI page size
const FETCH_SIZE = 100; // Fetch larger samples for sorting
const GROUP_SIZES = [2, 3, 4, 5]; // Group sizes we need to fetch
const MODES = [true, false]; // Competitive (true) & Regular (false)

async function fetchAndCombineGroupHiscores(page: number) {
    let allEntries: GroupIronmanEntry[] = [];
    let totalGroups = 0;
    let totalPages = 0;

    // Fetch hiscores for each size and mode
    const fetchPromises = GROUP_SIZES.flatMap(size =>
        MODES.map(async (isCompetitive) => {
            const hiscores: GroupIronmanHiscores | null = await getGroupIronmanHiscores(
                size,
                FETCH_SIZE, // Get larger sample size for sorting
                Math.floor(page / 2), // Adjust page count to fetch less often
                isCompetitive
            );

            if (hiscores) {
                totalGroups += hiscores.totalElements;
                totalPages = Math.max(totalPages, hiscores.totalPages);
                allEntries.push(...hiscores.content);
            }
        })
    );

    // Wait for all fetches to complete
    await Promise.all(fetchPromises);

    // Sort by Total Level, then XP (Descending)
    allEntries.sort((a, b) =>
        b.groupTotalLevel - a.groupTotalLevel || b.groupTotalXp - a.groupTotalXp
    );

    // Apply Pagination: Only return 20 for the current page
    const paginatedEntries = allEntries.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

    // Construct the response
    return {
        totalElements: totalGroups,
        totalPages,
        size: PAGE_SIZE, // Limit to 20 per page
        content: paginatedEntries,
        first: page === 0,
        last: (page + 1) * PAGE_SIZE >= totalGroups,
        numberOfElements: paginatedEntries.length,
        pageNumber: page,
        empty: paginatedEntries.length === 0,
    } as GroupIronmanHiscores;
}
*/

export async function getGroupMembers(groupName: string, groupSize: number, isCompetitive: boolean): Promise<string[]> {
    console.log('getting group members');
    const mode = isCompetitive ? "competitive" : "regular";
    const url = `https://rs.runescape.com/hiscores/group-ironman/${mode}/${groupSize}-player/${encodeURIComponent(groupName)}`;

    try {
        const res = await fetch(url, {
            cache: "force-cache", // Use cache when available
            next: { revalidate: 60 * 60 * 24 }, // Revalidate once per day (86,400 seconds)
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            },
        });
        if (!res.ok) throw new Error(`Failed to fetch group page: ${res.statusText}`);

        const html = await res.text();
        const page = cheerio.load(html); // Explicitly define type

        // Grab the first div directly under the section
        // @ts-ignore
        const firstDiv = page('section[data-testid="GroupDetails"] > div').first();
        const members: string[] = [];

        // Find all anchor tags inside the first div and extract the text
        firstDiv.find("a").each((_i, elem) => {
            const memberName = page(elem).text().trim().replace(/\u00A0/g, " ");
            members.push(memberName);
        });

        return members;
    } catch (error) {
        console.error("Error fetching group members:", error);
        return [];
    }
}

export async function getPlayerHiscores(playerNames: string | string[]): Promise<Record<string, PlayerHiscores | null>> {
    const BASE_URL = "https://secure.runescape.com/m=hiscore/index_lite.json";
    const players = Array.isArray(playerNames) ? playerNames : [playerNames];

    const fetchHiscores = async (name: string): Promise<PlayerHiscores | null> => {
        const url = `${BASE_URL}?player=${encodeURIComponent(name)}`;

        try {
            const res = await fetch(url, { cache: "no-store" });
            if (!res.ok) throw new Error(`Failed to fetch data for ${name}`);

            return (await res.json()) as PlayerHiscores;
        } catch (error) {
            console.error(`Error fetching hiscores for ${name}:`, error);
            return null;
        }
    };

    const results = await Promise.all(players.map(fetchHiscores));

    return players.reduce((acc, player, index) => {
        acc[player] = results[index];
        return acc;
    }, {} as Record<string, PlayerHiscores | null>);
}

export async function getRuneMetricsProfiles(playerNames: string | string[]): Promise<Record<string, RuneMetricsProfile | null>> {
    const BASE_URL = "https://apps.runescape.com/runemetrics/profile/profile";
    const players = Array.isArray(playerNames) ? playerNames : [playerNames];

    const fetchProfile = async (name: string): Promise<RuneMetricsProfile | null> => {
        const url = `${BASE_URL}?user=${encodeURIComponent(name)}&activities=20`;

        try {
            const res = await fetch(url, { cache: "no-store" });
            const data = await res.json();

            // If the response contains an error, return null
            if (data.error) {
                console.error(`Error fetching profile for ${name}: ${data.error}`);
                return null;
            }

            return data as RuneMetricsProfile;
        } catch (error) {
            console.error(`Failed to fetch profile for ${name}:`, error);
            return null;
        }
    };

    // Fetch all profiles in parallel
    const results = await Promise.all(players.map(fetchProfile));

    // Map player names to their results
    return players.reduce((acc, player, index) => {
        acc[player] = results[index];
        return acc;
    }, {} as Record<string, RuneMetricsProfile | null>);
}
