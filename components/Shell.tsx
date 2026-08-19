import Link from "next/link";
import type { ReactNode } from "react";
import type { Locale } from "@/lib/types";
import { labels } from "@/lib/i18n";
import { items, pathFor, visibleRecipes } from "@/lib/content";
import { LanguageSwitcher } from "./LanguageSwitcher";

const official = { steam: "https://store.steampowered.com/app/4369130/Chop_Chop_Inc/", discord: "https://discord.com/invite/4wpwnxqTWg", youtube: "https://www.youtube.com/@nullrefentertainment" };
function MenuGroup({ title, children }: { title: string; children: ReactNode }) { return <details className="menu-group"><summary>{title} <span aria-hidden>▾</span></summary><div className="dropdown">{children}</div></details>; }
function MenuLink({ href, title, subtitle }: { href: string; title: string; subtitle: string }) { return <Link className="menu-link" href={href}><strong>{title}</strong><small>{subtitle}</small></Link>; }

function NavigationGroups({ locale, mobile = false }: { locale: Locale; mobile?: boolean }) {
  const de = locale === "de";
  return <div className="nav-groups">
    <MenuGroup title={de ? "Datenbank" : "Database"}>
      <MenuLink href={pathFor(locale, "/recipes")} title={de ? "Alle Rezepte" : "All Recipes"} subtitle={`${visibleRecipes.length} ${de ? "herstellbare Rezepte mit genauen Materialien" : "craftable recipes with exact materials"}`}/>
      <MenuLink href={`${pathFor(locale, "/database")}#recipe-categories`} title={de ? "Rezeptkategorien" : "Recipe Categories"} subtitle={de ? "Möbel, Werkzeuge, Materialien und mehr" : "furniture, tools, materials, and more"}/>
      <MenuLink href={pathFor(locale, "/items")} title={de ? "Alle Gegenstände" : "All Items"} subtitle={`${items.length} ${de ? "Gegenstände mit beidseitiger Rezeptsuche" : "items with two-way recipe lookup"}`}/>
      <MenuLink href={`${pathFor(locale, "/database")}#item-categories`} title={de ? "Gegenstandskategorien" : "Item Categories"} subtitle={de ? "Nach Typ durchsuchen" : "browse by type"}/>
    </MenuGroup>
    <MenuGroup title={de ? "Welt" : "World"}>
      <MenuLink href={pathFor(locale, "/map")} title={de ? "Karte" : "Map"} subtitle={de ? "Interaktive Karte mit exakten Koordinaten" : "interactive map with exact coordinates"}/>
      <MenuLink href={pathFor(locale, "/trees")} title={de ? "Bäume" : "Trees"} subtitle={`8 ${de ? "Baumarten" : "tree types"}`}/>
      <MenuLink href={pathFor(locale, "/ducks")} title={de ? "Gummienten" : "Rubber Ducks"} subtitle={`13 ${de ? "Sammelobjekte" : "collectibles"}`}/>
      <MenuLink href={pathFor(locale, "/npcs")} title="NPCs" subtitle={`16 ${de ? "Charaktere" : "characters"}`}/>
      <MenuLink href={pathFor(locale, "/audiences")} title={de ? "Zielgruppen" : "Audiences"} subtitle={`10 ${de ? "Kundengruppen" : "customer factions"}`}/>
    </MenuGroup>
    <MenuGroup title="Guides">
      <MenuLink href={pathFor(locale, "/quests")} title={de ? "Aufgaben" : "Quests"} subtitle={de ? "Ziele und Originaldialoge" : "objectives and original dialogue"}/>
      <MenuLink href={pathFor(locale, "/quests/side-quests")} title={de ? "Nebenaufgaben" : "Side Quests"} subtitle={de ? "vier Aufgabenketten auf einer Seite" : "four quest chains in one guide"}/>
      <MenuLink href={pathFor(locale, "/city-missions")} title={de ? "Stadtmissionen" : "City Missions"} subtitle={de ? "Aufträge nach Zielgruppe" : "Mission Board jobs by audience"}/>
      <MenuLink href={pathFor(locale, "/guides/stone-tree-location")} title={de ? "Steinbaum-Standorte" : "Stone Tree Location"} subtitle={de ? "19 bestätigte Bäume und Koordinaten" : "19 confirmed trees and coordinates"}/>
      <MenuLink href={pathFor(locale, "/guides/duck-locations")} title={de ? "Gummienten-Standorte" : "Duck Locations"} subtitle={de ? "13 offizielle Enten, 7 bestätigte Positionen" : "13 official ducks, 7 confirmed positions"}/>
      <MenuLink href={pathFor(locale, "/guides/battery")} title={de ? "Batterie" : "Battery"} subtitle={de ? "Herstellung an der Electric Press" : "crafting at the Electric Press"}/>
      <MenuLink href={pathFor(locale, "/guides/auto-harvester")} title="Auto Harvester" subtitle={de ? "Freischaltung und automatische Abholung" : "unlock and automated collection"}/>
      <MenuLink href={pathFor(locale, "/guides/snow-mountain")} title={de ? "Schneeberg" : "Snow Mountain"} subtitle={de ? "Fortschritt laut Community-Berichten" : "progress based on community reports"}/>
    </MenuGroup>
    <MenuGroup title={de ? "Spielinfo" : "Game Info"}>
      <MenuLink href={pathFor(locale, "/achievements")} title={de ? "Errungenschaften" : "Achievements"} subtitle={de ? "alle 21 mit globaler Seltenheit" : "all 21 with global rarity"}/>
      <MenuLink href={pathFor(locale, "/updates")} title="Updates" subtitle={de ? "aktuelle Patchnotes" : "latest patch notes"}/>
      <MenuLink href={pathFor(locale, "/system-requirements")} title={de ? "Systemanforderungen" : "System Requirements"} subtitle={de ? "PC-Anforderungen" : "PC specs"}/>
      <MenuLink href={pathFor(locale, "/platforms")} title={de ? "Plattformen" : "Platforms"} subtitle={de ? "PC- und Konsolenstatus" : "PC and console availability"}/>
      <MenuLink href={pathFor(locale, "/languages")} title={de ? "Sprachen" : "Languages"} subtitle={de ? "alle 7 unterstützten Sprachen" : "all 7 supported languages"}/>
      <MenuLink href={pathFor(locale, "/price-and-demo")} title={de ? "Preis & Demo" : "Price & Demo"} subtitle={de ? "Preis, Veröffentlichung und kostenlose Demo" : "price, release date and free demo"}/>
    </MenuGroup>
    <MenuGroup title={de ? "Über" : "About"}>
      <MenuLink href={pathFor(locale, "/about")} title={de ? "Über dieses Wiki" : "About this wiki"} subtitle={de ? "Quellen und Projektinformationen" : "sources and project information"}/>
      <MenuLink href={pathFor(locale, "/terms")} title={de ? "Nutzungsbedingungen" : "Terms of Service"} subtitle={de ? "Bedingungen für die Nutzung" : "terms for using the site"}/>
      <MenuLink href={pathFor(locale, "/privacy")} title={de ? "Datenschutz" : "Privacy Policy"} subtitle={de ? "Datenschutz und Analysedienste" : "privacy and analytics services"}/>
    </MenuGroup>
    {mobile && <LanguageSwitcher locale={locale} mobile/>}
  </div>;
}

export function Shell({ locale, children }: { locale: Locale; children: ReactNode }) {
  const l = labels[locale], de = locale === "de";
  return <><header className="header"><nav className="shell nav"><Link className="brand" href={pathFor(locale)}>CHOP CHOP INC. WIKI</Link><div className="desktop-navigation"><NavigationGroups locale={locale}/></div><details className="mobile-navigation"><summary aria-label={de ? "Menü öffnen" : "Open menu"}>☰</summary><NavigationGroups locale={locale} mobile/></details><div className="desktop-language"><LanguageSwitcher locale={locale}/></div></nav></header><main className="shell main">{children}</main><footer className="footer"><div className="shell footer-grid">
    <div><h3>{de ? "Datenbank" : "Database"}</h3><Link href={pathFor(locale, "/database")}>{de ? "Übersicht" : "Overview"}</Link><Link href={pathFor(locale, "/recipes")}>{l.recipes}</Link><Link href={pathFor(locale, "/items")}>{l.items}</Link></div>
    <div><h3>{de ? "Welt" : "World"}</h3><Link href={pathFor(locale, "/world")}>{de ? "Übersicht" : "Overview"}</Link><Link href={pathFor(locale, "/map")}>{de ? "Karte" : "Map"}</Link><Link href={pathFor(locale, "/trees")}>{l.trees}</Link><Link href={pathFor(locale, "/ducks")}>{l.ducks}</Link><Link href={pathFor(locale, "/npcs")}>{l.npcs}</Link><Link href={pathFor(locale, "/audiences")}>{l.audiences}</Link></div>
    <div><h3>Guides</h3><Link href={pathFor(locale, "/quests")}>{de ? "Aufgaben" : "Quests"}</Link><Link href={pathFor(locale, "/quests/side-quests")}>{de ? "Nebenaufgaben" : "Side Quests"}</Link><Link href={pathFor(locale, "/city-missions")}>{de ? "Stadtmissionen" : "City Missions"}</Link><Link href={pathFor(locale, "/guides/stone-tree-location")}>{de ? "Steinbaum-Standorte" : "Stone Tree Location"}</Link><Link href={pathFor(locale, "/guides/duck-locations")}>{de ? "Gummienten-Standorte" : "Duck Locations"}</Link><Link href={pathFor(locale, "/guides/battery")}>{de ? "Batterie" : "Battery"}</Link><Link href={pathFor(locale, "/guides/auto-harvester")}>Auto Harvester</Link><Link href={pathFor(locale, "/guides/snow-mountain")}>{de ? "Schneeberg" : "Snow Mountain"}</Link></div>
    <div><h3>{de ? "Spielinfo" : "Game Info"}</h3><Link href={pathFor(locale, "/achievements")}>{de ? "Errungenschaften" : "Achievements"}</Link><Link href={pathFor(locale, "/updates")}>Updates</Link><Link href={pathFor(locale, "/system-requirements")}>{de ? "Systemanforderungen" : "System Requirements"}</Link><Link href={pathFor(locale, "/platforms")}>{de ? "Plattformen" : "Platforms"}</Link><Link href={pathFor(locale, "/languages")}>{de ? "Sprachen" : "Languages"}</Link><Link href={pathFor(locale, "/price-and-demo")}>{de ? "Preis & Demo" : "Price & Demo"}</Link></div>
    <div><h3>{de ? "Über" : "About"}</h3><Link href={pathFor(locale, "/about")}>{de ? "Über dieses Wiki" : "About this wiki"}</Link><Link href={pathFor(locale, "/terms")}>{de ? "Nutzungsbedingungen" : "Terms"}</Link><Link href={pathFor(locale, "/privacy")}>{de ? "Datenschutz" : "Privacy"}</Link><a href={official.steam}>Steam</a><a href={official.discord}>Discord</a><a href={official.youtube}>YouTube</a></div>
  </div><div className="shell disclaimer">Unofficial fan wiki. Not affiliated with NullRef Entertainment or rokaplay select. All game content belongs to its respective owners.</div></footer></>;
}
