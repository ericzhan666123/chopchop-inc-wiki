import Link from "next/link";
import { notFound } from "next/navigation";
import { Shell } from "./Shell";
import { SearchGrid } from "./SearchGrid";
import { EntryList } from "./EntryList";
import { RecipeRefList } from "./RecipeRefList";
import {
  audiences, bySlug, categoryLabel, ducks, items, npcs, pathFor, recipeDisplayName,
  recipeHasPage, recipePageTitle, recipes, slugifyId, text, trees, visibleRecipes,
} from "@/lib/content";
import { labels } from "@/lib/i18n";
import type { Entry, Locale, Recipe } from "@/lib/types";

export function IndexPage({ kind, locale }: { kind: "recipes" | "items"; locale: Locale }) {
  const l = labels[locale];
  const rows = kind === "recipes"
    ? visibleRecipes.map((recipe) => ({
        name: text(recipe.displayName, locale),
        href: pathFor(locale, `/recipes/${slugifyId(recipe.id)}`),
        category: recipe.category ?? "other",
        subtitle: `${recipe.inputs[0]?.name?.[locale] ?? l.none} · ${recipe.craftTime} ${l.seconds}`,
      }))
    : items.map((item) => ({
        name: text(item.name, locale),
        href: pathFor(locale, `/items/${slugifyId(item.id)}`),
        category: item.category ?? "other",
        subtitle: item.description ? text(item.description, locale) : undefined,
      }));
  return <Shell locale={locale}><div className="eyebrow">Chop Chop Inc.</div><h1>{l[kind]}</h1><p className="muted">{rows.length} {l.count}</p><SearchGrid rows={rows} searchLabel={l.search} filterLabel={l.filter} allLabel={l.all} /></Shell>;
}

export function CategoryPage({ kind, category, locale }: { kind: "recipes" | "items"; category: string; locale: Locale }) {
  const l = labels[locale];
  const recipeRows = visibleRecipes.filter((recipe) => recipe.category === category).map((recipe) => ({ name: text(recipe.displayName, locale), href: pathFor(locale, `/recipes/${slugifyId(recipe.id)}`), category: recipe.category ?? "other", subtitle: `${recipe.inputs[0]?.name?.[locale] ?? l.none} · ${recipe.craftTime} ${l.seconds}` }));
  const itemRows = items.filter((item) => item.category === category).map((item) => ({ name: text(item.name, locale), href: pathFor(locale, `/items/${slugifyId(item.id)}`), category: item.category ?? "other", subtitle: item.description ? text(item.description, locale) : undefined }));
  const rows = kind === "recipes" ? recipeRows : itemRows;
  if (!rows.length) notFound();
  return <Shell locale={locale}><Link className="eyebrow" href={pathFor(locale, `/${kind}`)}>← {l[kind]}</Link><h1>{categoryLabel(category, locale)}</h1><p className="muted">{rows.length} {l.count}</p><SearchGrid rows={rows} searchLabel={l.search} filterLabel={l.filter} allLabel={l.all} /></Shell>;
}

export function CollectionPage({ kind, locale }: { kind: "ducks" | "trees" | "audiences" | "npcs"; locale: Locale }) {
  const l = labels[locale];
  const data: Record<typeof kind, Entry[]> = { ducks, trees, audiences, npcs };
  return <Shell locale={locale}><div className="eyebrow">Chop Chop Inc.</div><h1>{l[kind]}</h1><p className="muted">{data[kind].length} {l.count}</p><EntryList entries={data[kind]} locale={locale} /></Shell>;
}

export function RecipePage({ slug, locale }: { slug: string; locale: Locale }) {
  const recipe = bySlug(visibleRecipes, slug);
  if (!recipe) notFound();
  const l = labels[locale];
  return <Shell locale={locale}><article className="detail"><Link className="eyebrow" href={pathFor(locale, "/recipes")}>← {l.recipes}</Link><h1>{recipePageTitle(recipe, locale)}</h1><span className="tag">{recipe.category ?? "other"}</span><div className="stats"><div className="stat"><strong>{l.craftTime}</strong><br />{recipe.craftTime} {l.seconds}</div><div className="stat"><strong>{l.unlocked}</strong><br />{recipe.unlockedAtStart ? l.yes : l.no}</div></div><h2>{l.inputs}</h2><RecipeRefList refs={recipe.inputs} locale={locale} /><h2>{l.outputs}</h2><RecipeRefList refs={recipe.outputs} locale={locale} /></article></Shell>;
}

function ReverseRecipeCards({ rows, locale }: { rows: Recipe[]; locale: Locale }) {
  const l = labels[locale];
  const renderBody = (recipe: Recipe) => <><h3>{recipeDisplayName(recipe, locale)}</h3><span className="tag">{recipe.category ?? "other"}</span><p className="muted">{recipe.inputs[0]?.name?.[locale] ?? l.none} · {recipe.craftTime} {l.seconds}</p></>;
  if (!rows.length) return <p className="empty">{l.none}</p>;
  return <div className="grid">{rows.map((recipe) => recipeHasPage(recipe)
    ? <Link className="card" href={pathFor(locale, `/recipes/${slugifyId(recipe.id)}`)} key={recipe.id}>{renderBody(recipe)}</Link>
    : <article className="card" key={recipe.id}>{renderBody(recipe)}</article>)}</div>;
}

export function ItemPage({ slug, locale }: { slug: string; locale: Locale }) {
  const item = bySlug(items, slug);
  if (!item) notFound();
  const l = labels[locale];
  const hasName = (recipe: Recipe) => recipeDisplayName(recipe, locale) !== null;
  const used = recipes.filter((recipe) => recipe.inputs.some((ref) => ref.itemId === item.id) && hasName(recipe));
  const obtained = recipes.filter((recipe) => recipe.outputs.some((ref) => ref.itemId === item.id) && hasName(recipe));
  return <Shell locale={locale}><article><Link className="eyebrow" href={pathFor(locale, "/items")}>← {l.items}</Link><h1>{text(item.name, locale)}</h1><span className="tag">{item.category ?? "other"}</span>{item.description && <section className="section-group"><h2>{l.description}</h2><p className="prose muted">{text(item.description, locale)}</p></section>}<div className="stats"><div className="stat"><strong>{l.sell}</strong><br />{item.sellValue}</div><div className="stat"><strong>{l.buy}</strong><br />{item.buyValue}</div></div><section className="section-group"><h2>{l.usedToCraft} · {used.length}</h2><ReverseRecipeCards rows={used} locale={locale} /></section><section className="section-group"><h2>{l.obtainedFrom} · {obtained.length}</h2><ReverseRecipeCards rows={obtained} locale={locale} /></section></article></Shell>;
}
