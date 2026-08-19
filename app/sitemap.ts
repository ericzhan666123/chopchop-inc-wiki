import type { MetadataRoute } from "next";
import { itemCategories, items, pathFor, recipeCategories, slugifyId, visibleRecipes } from "@/lib/content";
import { mapCategorySlugs } from "@/lib/world-map";
import { achievementData } from "@/lib/steam";
import { pageQuests } from "@/lib/quests";
import { platformSlugs } from "@/lib/platforms";
export const dynamic = "force-static";
const origin = process.env.NEXT_PUBLIC_SITE_URL ?? "https://chop-chop-inc-wiki.pages.dev";
export default function sitemap(): MetadataRoute.Sitemap {
  const common = ["", "/database", "/world", "/map", "/game-info", "/recipes", "/items", "/ducks", "/trees", "/audiences", "/npcs", "/achievements", "/updates", "/system-requirements", "/quests", "/quests/side-quests", "/city-missions", "/guides/stone-tree-location", "/guides/duck-locations", "/guides/battery", "/guides/auto-harvester", "/guides/snow-mountain", "/platforms", "/languages", "/price-and-demo", "/about", "/terms", "/privacy"];
  const paths = [...common, ...platformSlugs.map((slug) => `/platforms/${slug}`), ...mapCategorySlugs.map((category) => `/map/${category}`), ...pageQuests.map((q) => `/quests/${q.slug}`), ...achievementData.achievements.map((a) => `/achievements/${a.slug}`), ...recipeCategories.map((category) => `/recipes/category/${category}`), ...itemCategories.map((category) => `/items/category/${category}`), ...visibleRecipes.map((r) => `/recipes/${slugifyId(r.id)}`), ...items.map((i) => `/items/${slugifyId(i.id)}`)];
  return paths.flatMap((path) => (["en", "de"] as const).map((locale) => ({ url: `${origin}${pathFor(locale, path)}`, changeFrequency: "weekly" as const, priority: path === "" ? 1 : path.split("/").length > 2 ? .7 : .8, alternates: { languages: { en: `${origin}${pathFor("en", path)}`, de: `${origin}${pathFor("de", path)}` } } })));
}
