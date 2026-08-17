import questsJson from "@/content/en/quests.json";
import cityMissionsJson from "@/content/en/city-missions.json";

export type LocalizedText = { en: string | null; de: string | null };
export type Quest = {
  id: string;
  slug: string;
  name: LocalizedText | null;
  tooThin?: boolean;
  segments: Array<{ id: string; isMetaText?: boolean }>;
  metaTextSectionTitle?: string;
  objectives: Array<{ key: string; text: LocalizedText | null }>;
  dialogue: Array<{ key: string; speaker: string; order: number; segment?: string; text: LocalizedText }>;
};
export type CityMission = {
  key: string;
  text: LocalizedText | null;
  name?: LocalizedText | null;
  description?: LocalizedText | null;
  timer?: LocalizedText | null;
};
export type CityMissionGroup = { targetAudience: string; missions: CityMission[] };

export const questData = questsJson.quests as Quest[];
export const cityMissionGroups = cityMissionsJson.groups as CityMissionGroup[];
export const sideQuestSlugs = ["old-windmill", "cave-bridge", "wood-elevator", "grindstone"];
export const pageQuests = questData.filter((quest) => !quest.tooThin && quest.name !== null && !sideQuestSlugs.includes(quest.slug));
export const sideQuests = sideQuestSlugs.map((slug) => questData.find((quest) => quest.slug === slug)).filter((quest): quest is Quest => Boolean(quest));
