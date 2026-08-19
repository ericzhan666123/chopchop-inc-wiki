import { notFound } from "next/navigation";
import { PlatformDetailPage } from "@/components/PlatformPages";
import { pageMetadata } from "@/lib/metadata";
import { platformCopy, platformSlugs, type PlatformSlug } from "@/lib/platforms";
export const dynamicParams=false;
export function generateStaticParams(){return platformSlugs.map(slug=>({slug}))}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}){const {slug}=await params;if(!platformSlugs.includes(slug as PlatformSlug))return{};const copy=platformCopy[slug as PlatformSlug].de;return pageMetadata(copy.title,copy.description,"de",`/platforms/${slug}`)}
export default async function Page({params}:{params:Promise<{slug:string}>}){const {slug}=await params;if(!platformSlugs.includes(slug as PlatformSlug))notFound();return <PlatformDetailPage locale="de" slug={slug as PlatformSlug}/>}
