import type { Metadata } from "next";
import { QuestPage } from "@/components/QuestPages";
import { pageMetadata } from "@/lib/metadata";
import { pageQuests } from "@/lib/quests";
export const dynamicParams=false;
export function generateStaticParams(){return pageQuests.map(({slug})=>({slug}))}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{const {slug}=await params;const quest=pageQuests.find(item=>item.slug===slug);const name=quest?.name?.en??slug;return pageMetadata(`${name} - Full Walkthrough | Chop Chop Inc.`,`Complete ${name} quest in Chop Chop Inc.: all objectives and dialogue, extracted directly from the game files.`,"en",`/quests/${slug}`)}
export default async function Page({params}:{params:Promise<{slug:string}>}){return <QuestPage locale="en" slug={(await params).slug}/>}
