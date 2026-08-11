import Link from "next/link";
import type { ReactNode } from "react";
import type { Locale } from "@/lib/types";
import { labels } from "@/lib/i18n";
import { categoryLabel, itemCategories, items, pathFor, visibleRecipes } from "@/lib/content";

const official = {
  steam: "https://store.steampowered.com/app/4369130/Chop_Chop_Inc/",
  discord: "https://discord.com/invite/4wpwnxqTWg",
  youtube: "https://www.youtube.com/@nullrefentertainment",
};

function countRecipes(category: string) { return visibleRecipes.filter((recipe) => recipe.category === category).length; }
function countItems(category: string) { return items.filter((item) => item.category === category).length; }

function MenuGroup({ title, children }: { title: string; children: ReactNode }) {
  return <details className="menu-group"><summary>{title} <span aria-hidden>▾</span></summary><div className="dropdown">{children}</div></details>;
}
function MenuLink({ href, title, subtitle }: { href: string; title: string; subtitle: string }) {
  return <Link className="menu-link" href={href}><strong>{title}</strong><small>{subtitle}</small></Link>;
}

function NavigationGroups({ locale }: { locale: Locale }) {
  const l = labels[locale];
  const recipeMenu = ["furniture", "refinedmaterials", "tools", "toys", "weights", "carving"];
  return <div className="nav-groups">
    <MenuGroup title={l.recipes}>
      <MenuLink href={pathFor(locale, "/recipes")} title={locale === "de" ? "Alle Rezepte" : "All Recipes"} subtitle={`${visibleRecipes.length} ${locale === "de" ? "herstellbare Rezepte" : "craftable recipes"}`} />
      {recipeMenu.map((category) => <MenuLink key={category} href={pathFor(locale, `/recipes/category/${category}`)} title={categoryLabel(category, locale)} subtitle={`${countRecipes(category)} · ${locale === "de" ? ({ furniture: "Möbelrezepte", refinedmaterials: "Holzverarbeitung", tools: "Äxte und Werkzeuge", toys: "Spielzeug", weights: "Gewichte", carving: "Schnitzarbeiten" } as Record<string,string>)[category] : ({ furniture: "furniture recipes", refinedmaterials: "wood processing", tools: "axes and tools", toys: "toys", weights: "weights", carving: "carved objects" } as Record<string,string>)[category]}`} />)}
    </MenuGroup>
    <MenuGroup title={l.items}>
      <MenuLink href={pathFor(locale, "/items")} title={locale === "de" ? "Alle Gegenstände" : "All Items"} subtitle={`${items.length} ${locale === "de" ? "Gegenstände" : "items"}`} />
      {itemCategories.map((category) => <MenuLink key={category} href={pathFor(locale, `/items/category/${category}`)} title={categoryLabel(category, locale)} subtitle={`${countItems(category)} ${locale === "de" ? "Gegenstände" : "items"}`} />)}
    </MenuGroup>
    <MenuGroup title={locale === "de" ? "Welt" : "World"}>
      <MenuLink href={pathFor(locale, "/trees")} title={l.trees} subtitle={`8 ${locale === "de" ? "Baumarten" : "tree types"}`} />
      <MenuLink href={pathFor(locale, "/ducks")} title={l.ducks} subtitle={`13 ${locale === "de" ? "Sammelobjekte" : "collectibles"}`} />
      <MenuLink href={pathFor(locale, "/npcs")} title={l.npcs} subtitle={`16 ${locale === "de" ? "Charaktere" : "characters"}`} />
      <MenuLink href={pathFor(locale, "/audiences")} title={l.audiences} subtitle={`10 ${locale === "de" ? "Zielgruppen" : "target audiences"}`} />
    </MenuGroup>
  </div>;
}

export function Shell({ locale, children }: { locale: Locale; children: ReactNode }) {
  const l = labels[locale]; const other = locale === "en" ? "de" : "en";
  return <><header className="header"><nav className="shell nav"><Link className="brand" href={pathFor(locale)}>CHOP CHOP INC. WIKI</Link><div className="desktop-navigation"><NavigationGroups locale={locale} /></div><details className="mobile-navigation"><summary aria-label={locale === "de" ? "Menü öffnen" : "Open menu"}>☰</summary><NavigationGroups locale={locale} /></details><Link className="lang" href={pathFor(other)}>{other.toUpperCase()}</Link></nav></header><main className="shell main">{children}</main><footer className="footer"><div className="shell footer-grid"><div><h3>{l.recipes}</h3><Link href={pathFor(locale,"/recipes")}>{locale === "de" ? "Alle Rezepte" : "All Recipes"}</Link><Link href={pathFor(locale,"/recipes/category/furniture")}>{categoryLabel("furniture",locale)}</Link><Link href={pathFor(locale,"/recipes/category/refinedmaterials")}>{categoryLabel("refinedmaterials",locale)}</Link><Link href={pathFor(locale,"/recipes/category/tools")}>{categoryLabel("tools",locale)}</Link></div><div><h3>{l.items}</h3><Link href={pathFor(locale,"/items")}>{locale === "de" ? "Alle Gegenstände" : "All Items"}</Link>{itemCategories.map(category=><Link key={category} href={pathFor(locale,`/items/category/${category}`)}>{categoryLabel(category,locale)}</Link>)}</div><div><h3>{locale === "de" ? "Welt" : "World"}</h3><Link href={pathFor(locale,"/trees")}>{l.trees}</Link><Link href={pathFor(locale,"/ducks")}>{l.ducks}</Link><Link href={pathFor(locale,"/npcs")}>{l.npcs}</Link><Link href={pathFor(locale,"/audiences")}>{l.audiences}</Link></div><div><h3>{locale === "de" ? "Offiziell" : "Official"}</h3><a href={official.steam}>Steam</a><a href={official.discord}>Discord</a><a href={official.youtube}>YouTube</a></div></div><div className="shell disclaimer">Unofficial fan wiki. Not affiliated with NullRef Entertainment or rokaplay select. All game content belongs to its respective owners.</div></footer></>;
}
