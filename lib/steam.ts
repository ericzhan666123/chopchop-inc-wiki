import achievementsJson from "@/content/en/achievements.json";
import updatesJson from "@/content/en/updates.json";
export type Rarity="common"|"uncommon"|"rare"|"very-rare";
export type Achievement={slug:string;displayName:string;description:string|null;icon:string;globalPercent:number;rarity:Rarity};
export type Update={gid:string;slug:string;title:string;date:string;excerpt:string;url:string;author:string};
export const achievementData=achievementsJson as {fetchedAt:string;totalAchievements:number;source:string;achievements:Achievement[]};
export const updateData=updatesJson as {fetchedAt:string;updates:Update[]};
