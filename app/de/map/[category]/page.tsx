import { notFound } from "next/navigation";
import { MapPage } from "@/components/MapPage";
import { seoPageMetadata } from "@/lib/seo-copy";
import { categoryCount, categoryLabel, isMapCategory, mapCategorySlugs } from "@/lib/world-map";
export const dynamicParams = false;
export function generateStaticParams() { return mapCategorySlugs.map((category) => ({ category })); }
export async function generateMetadata({ params }: { params: Promise<{ category: string }> }) { const { category } = await params; if (!isMapCategory(category)) return {}; const count = categoryCount(category), name = categoryLabel(category, "de", false); return seoPageMetadata(`Alle ${count} ${name}-Standorte – Chop Chop Inc. Karte`, `Alle Standorte für ${name} in Chop Chop Inc. mit exakten Koordinaten und Höhenangaben, direkt aus den Spieldateien.`, "de", `/map/${category}`); }
export default async function Page({ params }: { params: Promise<{ category: string }> }) { const { category } = await params; if (!isMapCategory(category)) notFound(); return <MapPage locale="de" category={category}/>; }
