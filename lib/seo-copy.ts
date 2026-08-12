import { items, recipePageTitle, recipes, text, visibleRecipes } from "./content";
import type { Item, Locale, Recipe } from "./types";
import { pageMetadata } from "./metadata";

const length = (value: string) => [...value].length;

function firstWithinLimit(candidates: string[], limit: number) {
  return candidates.find((candidate) => length(candidate) <= limit) ?? candidates.at(-1)!;
}

function trimAtWord(value: string, limit = 160) {
  if (length(value) <= limit) return value;
  const slice = [...value].slice(0, limit).join("");
  const boundary = slice.search(/\s+\S*$/u);
  return `${(boundary > 0 ? slice.slice(0, boundary) : slice).replace(/[,:;\s]+$/u, "")}.`;
}

function trimWithoutBreakingWords(value: string, limit: number) {
  if (length(value) <= limit) return value.trimEnd();
  const slice = [...value].slice(0, limit).join("");
  const boundary = slice.search(/\s+\S*$/u);
  return (boundary > 0 ? slice.slice(0, boundary) : slice).replace(/[,:;.!?\s]+$/u, "");
}

function fillDescription(base: string, locale: Locale) {
  const additions = locale === "de"
    ? [
        "Daten direkt aus den Spieldateien von Chop Chop Inc. extrahiert.",
        "Teil einer Datenbank mit 132 Rezepten und 236 Gegenständen.",
        "Auf Englisch und Deutsch verfügbar.",
      ]
    : [
        "Data extracted directly from the Chop Chop Inc. game files.",
        "Part of a database covering 132 recipes and 236 items.",
        "Available in English and German.",
      ];
  let result = base.trim();
  for (const addition of additions) {
    if (length(result) >= 140) break;
    if (length(`${result} ${addition}`) <= 160) result = `${result} ${addition}`;
  }
  if (length(result) < 140) {
    const shortestAddition = [...additions].sort((a, b) => length(a) - length(b))[0];
    const shortenedBase = trimWithoutBreakingWords(result, 159 - length(shortestAddition));
    result = `${shortenedBase} ${shortestAddition}`;
  }
  return trimAtWord(result, 160);
}

export function seoPageMetadata(title: string, description: string, locale: Locale, path: string) {
  const fittedDescription = fillDescription(description, locale);
  return { ...pageMetadata(title, fittedDescription, locale, path), title: { absolute: title } };
}

export function recipeSeo(recipe: Recipe, locale: Locale) {
  const name = recipePageTitle(recipe, locale) ?? text(recipe.displayName, locale);
  const title = locale === "de"
    ? firstWithinLimit([
        `${name} Rezept – Zutaten & Herstellungszeit | Chop Chop Inc.`,
        `${name} Rezept – Zutaten & Herstellungszeit`,
        `${name} Rezept`,
        `${name} | Chop Chop Inc.`,
      ], 60)
    : firstWithinLimit([
        `${name} Recipe - Materials & Craft Time | Chop Chop Inc.`,
        `${name} Recipe - Materials & Craft Time`,
        `${name} Recipe`,
        `${name} | Chop Chop Inc.`,
      ], 60);
  const inputs = recipe.inputs
    .filter((input) => input.name && input.amount !== null)
    .map((input) => `${input.amount}x ${text(input.name, locale)}`)
    .join(", ");
  const output = recipe.outputs[0]?.name ? text(recipe.outputs[0].name, locale) : null;
  const base = locale === "de"
    ? inputs
      ? `So stellst du ${name} in Chop Chop Inc. her: benötigt ${inputs}, dauert ${recipe.craftTime}s. Materialien und Herstellungsdetails.`
      : output
        ? `${name} in Chop Chop Inc.: erhältlich als ${output}, Herstellungszeit ${recipe.craftTime}s. Alle Rezept- und Herstellungsdetails.`
        : `${name} in Chop Chop Inc.: Herstellungszeit ${recipe.craftTime}s. Alle verfügbaren Rezept- und Herstellungsdetails.`
    : inputs
        ? `How to craft ${name} in Chop Chop Inc.: needs ${inputs}, takes ${recipe.craftTime}s. Material breakdown and where to make it.`
      : output
        ? `${name} in Chop Chop Inc.: obtained as ${output}, takes ${recipe.craftTime}s. Full recipe and crafting details.`
        : `${name} in Chop Chop Inc.: takes ${recipe.craftTime}s. Full available recipe and crafting details.`;
  return { title, description: fillDescription(base, locale) };
}

export function itemSeo(item: Item, locale: Locale) {
  const name = text(item.name, locale);
  const title = locale === "de"
    ? firstWithinLimit([
        `${name} – Nutzung, Wert & Rezepte | Chop Chop Inc. Wiki`,
        `${name} – Nutzung, Wert & Rezepte`,
        `${name} – Rezepte`,
        `${name} | Chop Chop Inc.`,
      ], 60)
    : firstWithinLimit([
        `${name} - Uses, Value & Recipes | Chop Chop Inc. Wiki`,
        `${name} - Uses, Value & Recipes`,
        `${name} - Recipes`,
        `${name} | Chop Chop Inc.`,
      ], 60);
  const used = recipes.filter((recipe) => recipe.inputs.some((input) => input.itemId === item.id)).length;
  const obtained = recipes.filter((recipe) => recipe.outputs.some((output) => output.itemId === item.id)).length;
  const sell = item.sellValue === null || item.sellValue === undefined
    ? ""
    : locale === "de" ? `Verkaufswert ${item.sellValue}, ` : `sells for ${item.sellValue}, `;
  const base = locale === "de"
    ? `${name} in Chop Chop Inc.: ${sell}in ${used} Rezepten verwendet, aus ${obtained} Quellen erhältlich. Gegenstandsdaten mit beidseitiger Rezeptsuche.`
    : `${name} in Chop Chop Inc.: ${sell}used in ${used} recipes, obtained from ${obtained} sources. Item data with two-way recipe lookup.`;
  return { title, description: fillDescription(base, locale) };
}

export function categorySeo(kind: "recipes" | "items", category: string, name: string, locale: Locale) {
  const count = kind === "recipes"
    ? visibleRecipes.filter((recipe) => recipe.category === category).length
    : items.filter((item) => item.category === category).length;
  const title = kind === "recipes"
    ? locale === "de"
      ? firstWithinLimit([`Alle ${name}-Rezepte (${count}) – Chop Chop Inc. Wiki`, `Alle ${name}-Rezepte (${count})`, `${name}-Rezepte (${count}) | Chop Chop Inc.`], 60)
      : firstWithinLimit([`All ${name} Recipes (${count}) - Chop Chop Inc. Wiki`, `All ${name} Recipes (${count})`, `${name} Recipes (${count}) | Chop Chop Inc.`], 60)
    : locale === "de"
      ? firstWithinLimit([`${name}-Gegenstände (${count}) – Chop Chop Inc. Wiki`, `${name}-Gegenstände (${count})`, `${name} (${count}) | Chop Chop Inc.`], 60)
      : firstWithinLimit([`${name} Items (${count}) - Chop Chop Inc. Wiki`, `${name} Items (${count})`, `${name} Items (${count}) | Chop Chop Inc.`], 60);
  const base = locale === "de"
    ? kind === "recipes"
      ? `Liste mit ${count} ${name}-Rezepten in Chop Chop Inc., inklusive Materialien, Mengen und Herstellungszeiten aus den Spieldateien.`
      : `Liste mit ${count} ${name}-Gegenständen in Chop Chop Inc., inklusive Werten, Verwendungen und Rezeptverknüpfungen aus den Spieldateien.`
    : kind === "recipes"
      ? `List of ${count} ${name.toLowerCase()} recipes in Chop Chop Inc. with exact materials, quantities and craft times, extracted from the game files.`
      : `List of ${count} ${name.toLowerCase()} items in Chop Chop Inc. with values, uses and recipe links, extracted from the game files.`;
  return { title, description: fillDescription(base, locale) };
}
