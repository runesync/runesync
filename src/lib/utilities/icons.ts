// Skill icons utility
const SKILL_ICON_BASE_URL = "/assets/skills/"; // Base URL for skill icons

export const icons: Record<string, string> = {
    "overall": `${SKILL_ICON_BASE_URL}overall.png`,
    "attack": `${SKILL_ICON_BASE_URL}attack.png`,
    "defence": `${SKILL_ICON_BASE_URL}defence.png`,
    "strength": `${SKILL_ICON_BASE_URL}strength.png`,
    "hitpoints": `${SKILL_ICON_BASE_URL}constitution.png`,
    "constitution": `${SKILL_ICON_BASE_URL}constitution.png`,
    "ranged": `${SKILL_ICON_BASE_URL}ranged.png`,
    "prayer": `${SKILL_ICON_BASE_URL}prayer.png`,
    "magic": `${SKILL_ICON_BASE_URL}magic.png`,
    "cooking": `${SKILL_ICON_BASE_URL}cooking.png`,
    "woodcutting": `${SKILL_ICON_BASE_URL}woodcutting.png`,
    "fletching": `${SKILL_ICON_BASE_URL}fletching.png`,
    "fishing": `${SKILL_ICON_BASE_URL}fishing.png`,
    "firemaking": `${SKILL_ICON_BASE_URL}firemaking.png`,
    "crafting": `${SKILL_ICON_BASE_URL}crafting.png`,
    "smithing": `${SKILL_ICON_BASE_URL}smithing.png`,
    "mining": `${SKILL_ICON_BASE_URL}mining.png`,
    "herblore": `${SKILL_ICON_BASE_URL}herblore.png`,
    "agility": `${SKILL_ICON_BASE_URL}agility.png`,
    "thieving": `${SKILL_ICON_BASE_URL}thieving.png`,
    "slayer": `${SKILL_ICON_BASE_URL}slayer.png`,
    "farming": `${SKILL_ICON_BASE_URL}farming.png`,
    "runecrafting": `${SKILL_ICON_BASE_URL}runecrafting.png`,
    "runecraft": `${SKILL_ICON_BASE_URL}runecrafting.png`,
    "hunter": `${SKILL_ICON_BASE_URL}hunter.png`,
    "construction": `${SKILL_ICON_BASE_URL}construction.png`,
    "summoning": `${SKILL_ICON_BASE_URL}summoning.png`,
    "dungeoneering": `${SKILL_ICON_BASE_URL}dungeoneering.png`,
    "divination": `${SKILL_ICON_BASE_URL}divination.png`,
    "invention": `${SKILL_ICON_BASE_URL}invention.png`,
    "archaeology": `${SKILL_ICON_BASE_URL}archaeology.png`,
    "necromancy": `${SKILL_ICON_BASE_URL}necromancy.png`,
};

export const getSkillIcon = (skillName: string) => icons[skillName.toLowerCase()] ?? "/assets/skills/default.png";

export const getProfilePicture = (player: string) =>
    `https://secure.runescape.com/m=avatar-rs/${encodeURIComponent(player)}/chat.png`;

const questIcon = "/assets/activity/quest_points.png"; // Path to a local quest icon
const xpIcon = "/assets/skills/overall.png"; // Generic XP icon
const combatIcon = "/assets/activity/combat.png"; // Generic combat icon
const lootIcon = "/assets/activity/loot_beam.png"; // Generic combat icon

const activityPatterns: { regex: RegExp; icon: (match?: string) => string }[] = [
    { regex: /^Levelled up (.+)\.$/i, icon: getSkillIcon, category: 'Skills' }, // Matches "Levelled up Slayer."
    { regex: /^Gained (\d+) XP in (.+)\.$/i, icon: getSkillIcon, category: 'Skills' }, // Matches "Gained 10000 XP in Fishing."
    { regex: /XP in ([A-Za-z\s]+)$/i, icon: getSkillIcon, category: 'Skills' }, // Matches any XP event like "34000000XP in Necromancy"
    { regex: /^I killed (.+)\.$/i, icon: () => combatIcon, category: 'Kills' }, // Matches "Defeated King Black Dragon."
    { regex: /^Quest complete: (.+)$/i, icon: () => questIcon, category: 'Quests' }, // Matches "Quest complete: Roving Elves"
    { regex: /^(\d+) Quest Points obtained$/i, icon: () => questIcon, category: 'Quests' }, // Matches "210 Quest Points obtained"
    { regex: /^Dungeon floor \d+ reached\.$/i, icon: () => getSkillIcon("Dungeoneering"), category: 'Skills' }, // Matches "Dungeon floor 40 reached."
    { regex: /^Levelled all skills over \d+$/i, icon: () => xpIcon, category: 'Skills' }, // Matches "Levelled all skills over 84" (number ignored)
    { regex: /^Daemonheim's history uncovered, \d+ volumes found\.$/i, icon: () => getSkillIcon("Dungeoneering"), category: 'Skills' }, // Matches "Daemonheim's history uncovered, 16 volumes found."
    { regex: /the (.+) pet\.$/i,  icon: getSkillIcon, category: 'Pets' }, // "I found Omen, the Necromancy pet."
    { regex: /^I found (.+)\.$/i, icon: () => lootIcon, category: 'Drops' }, // "I found some treasure."
];

// Function to determine icon based on activity text
export const getActivityIcon = (text: string): string | null => {
    for (const { regex, icon } of activityPatterns) {
        const match = text.match(regex);
        if (match) {
            return icon(match[1]); // Extracts skill name or activity type
        }
    }
    return null; // No matching icon
};

export const getActivityCategory = (text: string): string | null => {
    for (const { regex, category } of activityPatterns) {
        const match = text.match(regex);
        if (match) {
            return category; // Extracts skill name or activity type
        }
    }
    return null; // No matching icon
};