import recipesJson from "@/content/en/recipes.json";
import itemsJson from "@/content/en/items.json";
import treesJson from "@/content/en/trees.json";
import ducksJson from "@/content/en/ducks.json";
import audiencesJson from "@/content/en/audiences.json";
import npcsJson from "@/content/en/npcs.json";
import type { Entry, Item, Locale, Recipe } from "./types";

export const recipes = recipesJson as Recipe[];
export const items = itemsJson as Item[];
export const trees = treesJson as Entry[];
export const ducks = ducksJson as Entry[];
export const audiences = audiencesJson as Entry[];
export const npcs = npcsJson as Entry[];
export const excludedRecipePageIds = new Set(["Furniture_Beehouse", "WeightBench"]);
export const visibleRecipes = recipes.filter((r) => r.displayName !== null && r.displayInRecipeBook !== false && !excludedRecipePageIds.has(r.id));
export const recipeHasPage = (recipe: Recipe) => recipe.displayName !== null && recipe.displayInRecipeBook !== false;
export const recipeDisplayName = (recipe: Recipe, locale: Locale) => recipe.displayName?.[locale] ?? recipe.outputs[0]?.name?.[locale] ?? null;
export function recipePageTitle(recipe: Recipe, locale: Locale) {
  const name = recipeDisplayName(recipe, locale);
  if (!name) return null;
  const duplicates = visibleRecipes.filter((candidate) => candidate.displayName?.en === recipe.displayName?.en);
  if (duplicates.length < 2) return name;
  const categories = new Set(duplicates.map((candidate) => candidate.category));
  if (categories.size > 1) return `${name} (${recipe.category ?? "other"})`;
  const inputName = recipe.inputs[0]?.name?.[locale];
  return inputName ? `${name} ${locale === "de" ? "aus" : "from"} ${inputName}` : name;
}
export const slugifyId = (id: string) => id.replace(/([a-z0-9])([A-Z])/g, "$1-$2").replace(/[_\s]+/g, "-").replace(/-+/g, "-").toLowerCase();
export const bySlug = <T extends { id: string }>(rows: T[], slug: string) => rows.find((row) => slugifyId(row.id) === slug);
export const pathFor = (locale: Locale, path = "") => `${locale === "de" ? "/de" : ""}${path || "/"}`.replace(/\/+/g, "/");
export const text = (value: Record<Locale, string> | null, locale: Locale) => value?.[locale] ?? "—";
