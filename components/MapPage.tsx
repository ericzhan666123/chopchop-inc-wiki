import Link from "next/link";
import { Breadcrumbs } from "./Breadcrumbs";
import { InteractiveMap } from "./InteractiveMap";
import { categoryCount, categoryLabel, categoryMarkers, mapCategorySlugs, mapMarkers, markerName, type MapCategorySlug } from "@/lib/world-map";
import { pathFor } from "@/lib/content";
import type { Locale } from "@/lib/types";

export function MapPage({ locale, category }: { locale: Locale; category?: MapCategorySlug }) {
  const de = locale === "de";
  const rows = category ? categoryMarkers(category) : mapMarkers;
  const title = category ? (de ? `Alle ${categoryCount(category)} ${categoryLabel(category, locale, false)}-Standorte` : `All ${categoryCount(category)} ${categoryLabel(category, locale, false)} Locations`) : (de ? "Interaktive Chop Chop Inc.-Karte" : "Interactive Chop Chop Inc. Map");
  return <>
    <Breadcrumbs locale={locale} items={[{ name: de ? "Karte" : "Map", path: category ? "/map" : undefined }, ...(category ? [{ name: categoryLabel(category, locale, false) }] : [])]}/>
    <header className="hero map-hero"><p className="eyebrow">{de ? "Direkt aus den Spieldateien" : "Extracted from the game files"}</p><h1>{title}</h1><p className="lead">{de ? "Chop Chop Inc. hat keine Karte und keinen Kompass im Spiel. Diese Karte basiert auf Koordinaten, die direkt aus den Spieldateien extrahiert wurden. Nutze die Orientierungspunkte, um dich zurechtzufinden." : "Chop Chop Inc. has no in-game map or compass. This map is built from coordinates extracted directly from the game files. Use the landmarks to orient yourself."}</p></header>
    <InteractiveMap markers={rows} locale={locale} lockedCategory={category}/>
    {category ? <CoordinateTable markers={rows} locale={locale}/> : <section className="section-group"><h2>{de ? "Kartenkategorien" : "Map categories"}</h2><div className="grid">{mapCategorySlugs.map((slug) => <Link className="card" key={slug} href={pathFor(locale, `/map/${slug}`)}><h3>{categoryLabel(slug, locale, false)}</h3><p>{categoryCount(slug)} {de ? "bestätigte Standorte" : "confirmed locations"}</p></Link>)}</div></section>}
    <p className="map-note">{de ? "Für 7 von 13 Gummienten sind in den aktuellen Daten Standorte bestätigt. Koordinaten für die Enten Nr. 8–13 sind nicht vorhanden." : "7 of 13 rubber ducks have confirmed world placements in the current data. Coordinates for ducks #8-13 are not present."}</p>
  </>;
}

function CoordinateTable({ markers, locale }: { markers: ReturnType<typeof categoryMarkers>; locale: Locale }) {
  const de = locale === "de";
  return <section className="section-group"><h2>{de ? "Koordinatenliste" : "Coordinate list"}</h2><div className="coordinate-table-wrap"><table className="coordinate-table"><thead><tr><th>{de ? "Name" : "Name"}</th><th>{de ? "Ebene" : "Layer"}</th><th>X</th><th>Y</th><th>Z</th><th>{de ? "Höhe zum Camp" : "Elevation from camp"}</th></tr></thead><tbody>{markers.map((marker) => <tr key={marker.id}><td>{markerName(marker, locale)}</td><td>{marker.layer === "overworld" ? (de ? "Oberwelt" : "Overworld") : "Dungeon"}</td><td>{marker.x.toFixed(2)}</td><td>{marker.y.toFixed(2)}</td><td>{marker.z.toFixed(2)}</td><td>{marker.elevationRelativeToCamp >= 0 ? "+" : ""}{marker.elevationRelativeToCamp.toFixed(2)} m</td></tr>)}</tbody></table></div></section>;
}
