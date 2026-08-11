import type {MetadataRoute} from "next";import {items,pathFor,slugifyId,visibleRecipes} from "@/lib/content";
export const dynamic="force-static";
const origin=process.env.NEXT_PUBLIC_SITE_URL??"https://chop-chop-inc-wiki.pages.dev";
export default function sitemap():MetadataRoute.Sitemap{const common=["","/recipes","/items","/ducks","/trees","/audiences","/npcs"];const paths=[...common,...visibleRecipes.map(r=>`/recipes/${slugifyId(r.id)}`),...items.map(i=>`/items/${slugifyId(i.id)}`)];return paths.flatMap(path=>(["en","de"] as const).map(locale=>({url:`${origin}${pathFor(locale,path)}`,changeFrequency:"weekly" as const,priority:path===""?1:path.split("/").length>2?.7:.8,alternates:{languages:{en:`${origin}${pathFor("en",path)}`,de:`${origin}${pathFor("de",path)}`}}})))}
