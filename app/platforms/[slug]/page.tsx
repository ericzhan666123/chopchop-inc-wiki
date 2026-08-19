import { notFound } from "next/navigation";
import { PlatformDetailPage } from "@/components/PlatformPages";
import { pageMetadata } from "@/lib/metadata";
import { platformCopy, platformSlugs, type PlatformSlug } from "@/lib/platforms";
export const dynamicParams=false;
export function generateStaticParams(){return platformSlugs.map(slug=>({slug}))}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}){const {slug}=await params;if(!platformSlugs.includes(slug as PlatformSlug))return{};const copy=platformCopy[slug as PlatformSlug].en;const title=slug==="ps5"?"Is Chop Chop Inc on PS5? Console Status Explained":copy.title;return pageMetadata(title,copy.description,"en",`/platforms/${slug}`)}
export default async function Page({params}:{params:Promise<{slug:string}>}){const {slug}=await params;if(!platformSlugs.includes(slug as PlatformSlug))notFound();return <PlatformDetailPage locale="en" slug={slug as PlatformSlug}/>}
