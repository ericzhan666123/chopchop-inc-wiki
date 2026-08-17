import worldMapJson from "@/content/en/world-map.json";
import { trees } from "./content";
import type { Locale } from "./types";

export type MapLayer = "overworld" | "dungeon" | "interior";
export type MapMarker = {
  id: string;
  type: string;
  subtype?: string;
  name?: string;
  prefabName?: string;
  layer: MapLayer;
  x: number;
  y: number;
  z: number;
  elevationRelativeToCamp: number;
};

export const mapMarkers = worldMapJson.markers as MapMarker[];
export const mapBounds = worldMapJson.meta.bounds;

export const mapCategorySlugs = [
  "trees-birch", "trees-apple", "trees-stone", "trees-walnut",
  "trees-metal", "trees-electronic", "trees-palm", "trees-crystal",
  "rubber-ducks", "blueprints", "teleporters", "landmarks",
] as const;
export type MapCategorySlug = (typeof mapCategorySlugs)[number];

export const isMapCategory = (value: string): value is MapCategorySlug =>
  mapCategorySlugs.includes(value as MapCategorySlug);

export function markerCategory(marker: MapMarker): MapCategorySlug | null {
  if (marker.type === "tree" && marker.subtype && mapCategorySlugs.includes(`trees-${marker.subtype}` as MapCategorySlug)) return `trees-${marker.subtype}` as MapCategorySlug;
  if (marker.type === "rubberDuck") return "rubber-ducks";
  if (marker.type === "blueprint") return "blueprints";
  if (marker.type === "teleporter") return "teleporters";
  if (marker.type === "landmark") return "landmarks";
  return null;
}

export const categoryMarkers = (category: MapCategorySlug) => mapMarkers.filter((marker) => markerCategory(marker) === category);
export const categoryCount = (category: MapCategorySlug) => categoryMarkers(category).length;

const fixedLabels: Record<Exclude<MapCategorySlug, `trees-${string}`>, Record<Locale, { singular: string; plural: string }>> = {
  "rubber-ducks": { en: { singular: "Rubber Duck", plural: "Rubber Ducks" }, de: { singular: "Gummiente", plural: "Gummienten" } },
  blueprints: { en: { singular: "Blueprint", plural: "Blueprints" }, de: { singular: "Bauplan", plural: "Baupläne" } },
  teleporters: { en: { singular: "Teleporter", plural: "Teleporters" }, de: { singular: "Teleporter", plural: "Teleporter" } },
  landmarks: { en: { singular: "Landmark", plural: "Landmarks" }, de: { singular: "Orientierungspunkt", plural: "Orientierungspunkte" } },
};

export function categoryLabel(category: MapCategorySlug, locale: Locale, plural = true) {
  if (category.startsWith("trees-")) {
    const subtype = category.slice(6);
    const tree = trees.find((entry) => entry.id.toLowerCase() === subtype);
    const englishTreeNames: Record<string, string> = { birch: "Birch Tree", apple: "Apple Tree", stone: "Stone Tree", walnut: "Walnut Tree", metal: "Metal Tree", electronic: "Electronic Tree", palm: "Palm Tree", crystal: "Crystal Tree" };
    const name = locale === "de" ? (tree?.name.de ?? subtype) : (englishTreeNames[subtype] ?? tree?.name.en ?? subtype);
    if (!plural) return name;
    return locale === "de" ? `${name}-Standorte` : `${name} Locations`;
  }
  const fixedCategory = category as keyof typeof fixedLabels;
  return fixedLabels[fixedCategory][locale][plural ? "plural" : "singular"];
}

export function markerName(marker: MapMarker, locale: Locale) {
  const category = markerCategory(marker);
  if (marker.type === "tree" && category) return `${categoryLabel(category, locale, false)} ${Number(marker.id.split("-").at(-1))}`;
  if (marker.type === "rubberDuck") return `${locale === "de" ? "Gummiente" : "Rubber Duck"} #${Number(marker.id.split("-").at(-1))}`;
  if (marker.type === "blueprint") return marker.name?.replace("Trigger_collectBlueprint_", "") || categoryLabel("blueprints", locale, false);
  if (marker.type === "teleporter") return marker.name?.replace(/^p_teleporter_?/i, "") || `${categoryLabel("teleporters", locale, false)} ${Number(marker.id.split("-").at(-1))}`;
  return marker.name || marker.prefabName || marker.id;
}
