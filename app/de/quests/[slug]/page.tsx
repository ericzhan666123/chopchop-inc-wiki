import type { Metadata } from "next";
import { QuestPage } from "@/components/QuestPages";
import { pageMetadata } from "@/lib/metadata";
import { pageQuests } from "@/lib/quests";
export const dynamicParams=false;
export function generateStaticParams(){return pageQuests.map(({slug})=>({slug}))}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{const {slug}=await params;const quest=pageQuests.find(item=>item.slug===slug);const name=quest?.name?.de??quest?.name?.en??slug;return pageMetadata(`${name} – Komplettlösung | Chop Chop Inc.`,`Schließe ${name} in Chop Chop Inc. ab: alle Ziele und Dialoge, direkt aus den Spieldateien extrahiert.`,"de",`/quests/${slug}`)}
export default async function Page({params}:{params:Promise<{slug:string}>}){return <QuestPage locale="de" slug={(await params).slug}/>}
