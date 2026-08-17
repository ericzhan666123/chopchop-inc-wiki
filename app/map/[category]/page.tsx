import { notFound } from "next/navigation";
import { MapPage } from "@/components/MapPage";
import { seoPageMetadata } from "@/lib/seo-copy";
import { categoryCount, categoryLabel, isMapCategory, mapCategorySlugs } from "@/lib/world-map";
export const dynamicParams = false;
export function generateStaticParams() { return mapCategorySlugs.map((category) => ({ category })); }
export async function generateMetadata({ params }: { params: Promise<{ category: string }> }) { const { category } = await params; if (!isMapCategory(category)) return {}; const count = categoryCount(category), name = categoryLabel(category, "en", false); return seoPageMetadata(`All ${count} ${name} Locations - Chop Chop Inc. Map`, `Every ${name.toLowerCase()} location in Chop Chop Inc. with exact coordinates and elevation, extracted from the game files.`, "en", `/map/${category}`); }
export default async function Page({ params }: { params: Promise<{ category: string }> }) { const { category } = await params; if (!isMapCategory(category)) notFound(); return <MapPage locale="en" category={category}/>; }
