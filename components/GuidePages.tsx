import Link from "next/link";
import { Breadcrumbs } from "./Breadcrumbs";
import { InteractiveMap } from "./InteractiveMap";
import { Shell } from "./Shell";
import { ducks, pathFor, recipes, recipeDisplayName, slugifyId, trees, visibleRecipes } from "@/lib/content";
import { achievementData } from "@/lib/steam";
import { categoryMarkers, mapMarkers, mappedPlaceNames, markerName, type MapMarker } from "@/lib/world-map";
import type { Locale } from "@/lib/types";

type Faq = [string, string];
const stoneMarkers = categoryMarkers("trees-stone");
const duckMarkers = categoryMarkers("rubber-ducks");
const landmarks = mapMarkers.filter((marker) => marker.type === "landmark" && marker.layer === "overworld");

function faqLd(faq: Faq[]) {
  return { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faq.map(([name, text]) => ({ "@type": "Question", name, acceptedAnswer: { "@type": "Answer", text } })) };
}

function nearestLandmark(marker: MapMarker, locale: Locale) {
  const nearest = landmarks.map((landmark) => ({ landmark, distance: Math.hypot(marker.x - landmark.x, marker.z - landmark.z) })).sort((a, b) => a.distance - b.distance)[0];
  if (!nearest) return null;
  const official = mappedPlaceNames.find((place) => place.x !== null && place.z !== null && Math.hypot(nearest.landmark.x - place.x, nearest.landmark.z - place.z) < 15);
  return { name: official?.name[locale] ?? nearest.landmark.name ?? nearest.landmark.id, distance: nearest.distance };
}

function CoordinateTable({ markers, locale, groups = false }: { markers: MapMarker[]; locale: Locale; groups?: boolean }) {
  const de = locale === "de";
  const sorted = [...markers].sort((a, b) => b.y - a.y);
  const sections = groups ? [
    { label: de ? "Oberhalb des Camps" : "Above camp", rows: sorted.filter((m) => m.elevationRelativeToCamp > 0) },
    { label: de ? "Auf oder unter Camp-Höhe" : "At or below camp elevation", rows: sorted.filter((m) => m.elevationRelativeToCamp <= 0) },
  ] : [{ label: "", rows: sorted }];
  return <div className="coordinate-table-wrap"><table className="coordinate-table"><thead><tr><th>#</th><th>X</th><th>Y</th><th>Z</th><th>{de ? "Höhe zum Camp" : "Elevation from camp"}</th><th>{de ? "Nächster Orientierungspunkt" : "Nearest landmark"}</th></tr></thead><tbody>{sections.flatMap((section) => [
    ...(section.label ? [<tr key={`group-${section.label}`}><th colSpan={6}>{section.label}</th></tr>] : []),
    ...section.rows.map((marker) => { const nearest = nearestLandmark(marker, locale); return <tr key={marker.id}><td>{Number(marker.id.split("-").at(-1))}</td><td>{marker.x.toFixed(2)}</td><td>{marker.y.toFixed(2)}</td><td>{marker.z.toFixed(2)}</td><td>{marker.elevationRelativeToCamp >= 0 ? "+" : ""}{marker.elevationRelativeToCamp.toFixed(2)} m</td><td>{nearest ? `${nearest.name} · ${nearest.distance.toFixed(1)} m` : "—"}</td></tr>; }),
  ])}</tbody></table></div>;
}

export function StoneTreeGuide({ locale }: { locale: Locale }) {
  const de = locale === "de";
  const prefabCounts = Object.entries(stoneMarkers.reduce<Record<string, number>>((counts, marker) => { const key = marker.prefabName ?? "—"; counts[key] = (counts[key] ?? 0) + 1; return counts; }, {}));
  const stoneRecipes = recipes.flatMap((recipe) => { const input = recipe.inputs.find((entry) => entry.itemId === "Item_RawMaterial_Wood_Stone"); return input ? [{ recipe, input }] : []; });
  const treeCounts = trees.map((tree) => ({ tree, count: mapMarkers.filter((marker) => marker.type === "tree" && marker.subtype === tree.id.toLowerCase()).length }));
  const stoneTree = trees.find((tree) => tree.id === "Stone");
  const faq: Faq[] = de ? [
    ["Wie viele Steinbäume gibt es in Chop Chop Inc.?", `Die extrahierten Szenendaten enthalten ${stoneMarkers.length} Steinbaum-Instanzen.`],
    ["Wo befinden sich die Steinbäume?", "Die Karte und die Koordinatentabelle auf dieser Seite zeigen alle bestätigten Positionen aus den Unity-Szenendateien."],
    ["Ist der Steinbaum eine einmalige Ressource?", `Die Szenendateien enthalten ${stoneMarkers.length} Instanzen. Ob diese Ressourcen nur einmal genutzt werden können, lässt sich aus den Szenendaten nicht bestimmen.`],
    ["Was erhält man beim Fällen eines Steinbaums?", stoneTree?.description?.de ?? "Die Baumdaten enthalten für den Steinbaum keine Beschreibung des Ertrags."],
    ["Wachsen Steinbäume nach?", "Die Szenendaten enthalten keine verlässliche Information zur Respawn-Mechanik."],
  ] : [
    ["How many stone trees are in Chop Chop Inc?", `The extracted scene data contains ${stoneMarkers.length} stone tree instances.`],
    ["Where are the stone trees located?", "The map and coordinate table on this page show every confirmed position extracted from the Unity scene files."],
    ["Is the stone tree a one-time resource?", `The scene files contain ${stoneMarkers.length} instances. The scene data does not establish whether each resource can be used only once.`],
    ["What do you get from chopping a stone tree?", stoneTree?.description?.en ?? "The tree data does not contain a description of the stone tree's yield."],
    ["Do stone trees respawn?", "The scene data cannot determine the respawn mechanic."],
  ];
  return <Shell locale={locale}><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd(faq)) }}/><Breadcrumbs locale={locale} items={[{ name: "Guides" }, { name: de ? "Steinbaum-Standorte" : "Stone Tree Location" }]}/><article><header className="hero"><h1>{de ? `Chop Chop Inc. Steinbaum-Standorte – alle ${stoneMarkers.length} Bäume und Koordinaten` : `Chop Chop Inc Stone Tree Location - All ${stoneMarkers.length} Trees & Coordinates`}</h1><p className="lead">{de ? `In Chop Chop Inc. gibt es ${stoneMarkers.length} Steinbäume, nicht nur einen. Diese Seite listet jeden bestätigten Standort mit exakten Koordinaten auf, die direkt aus den Szenendateien des Spiels extrahiert wurden.` : `There are ${stoneMarkers.length} stone trees in Chop Chop Inc., not one. This page lists every confirmed location with exact coordinates, extracted directly from the game's scene files.`}</p></header>
  <section className="section-group"><h2>{de ? "Wie viele Steinbäume gibt es?" : "How Many Stone Trees Are There?"}</h2><p>{de ? `Die Unity-Szenendateien enthalten ${stoneMarkers.length} echte Steinbaum-Instanzen.` : `The Unity scene files contain ${stoneMarkers.length} actual stone tree instances.`}</p><ul>{prefabCounts.map(([name, count]) => <li key={name}>{count} × <code>{name}</code></li>)}</ul></section>
  <section className="section-group"><h2>{de ? `Alle ${stoneMarkers.length} Steinbaum-Standorte` : `All ${stoneMarkers.length} Stone Tree Locations`}</h2><InteractiveMap markers={[...stoneMarkers, ...landmarks]} locale={locale} guideCategories={["trees-stone", "landmarks"]}/><p className="map-note">{de ? "Die Entfernungen sind gerade Linien in der X/Z-Ebene der Szenenkoordinaten." : "Distances are straight lines in the X/Z plane of the scene coordinates."}</p><CoordinateTable markers={stoneMarkers} locale={locale} groups/></section>
  <section className="section-group"><h2>{de ? "Wofür Steinholz verwendet wird" : "What Stone Wood Is Used For"}</h2><div className="coordinate-table-wrap"><table className="coordinate-table"><thead><tr><th>{de ? "Rezept" : "Recipe"}</th><th>{de ? "Menge" : "Required"}</th><th>{de ? "Dauer" : "Craft time"}</th></tr></thead><tbody>{stoneRecipes.map(({ recipe, input }) => { const name = recipeDisplayName(recipe, locale); const hasPage = visibleRecipes.some((entry) => entry.id === recipe.id); return <tr key={recipe.id}><td>{name ? (hasPage ? <Link href={pathFor(locale, `/recipes/${slugifyId(recipe.id)}`)}>{name}</Link> : name) : recipe.id}</td><td>{input.amount ?? "—"}</td><td>{recipe.craftTime}s</td></tr>; })}</tbody></table></div></section>
  <section className="section-group"><h2>{de ? "Steinbaum im Vergleich zu anderen Baumarten" : "Stone Tree vs Other Tree Types"}</h2><div className="coordinate-table-wrap"><table className="coordinate-table"><thead><tr><th>{de ? "Baumart" : "Tree type"}</th><th>{de ? "Instanzen" : "Instances"}</th></tr></thead><tbody>{treeCounts.map(({ tree, count }) => <tr key={tree.id}><td><Link href={pathFor(locale, `/map/trees-${tree.id.toLowerCase()}`)}>{tree.name[locale]}</Link></td><td>{count}</td></tr>)}</tbody></table></div></section>
  <section className="section-group"><h2>{de ? "Häufig gestellte Fragen" : "Frequently Asked Questions"}</h2>{faq.map(([question, answer]) => <div className="card" key={question}><h3>{question}</h3><p>{answer}</p></div>)}</section>
  <p className="map-note">{de ? "Koordinaten aus den Unity-Szenendateien des Spiels extrahiert. Routen- und Zugangshinweise sind nicht enthalten – diese Seite zeigt, wo die Bäume stehen, nicht wie man sie erreicht." : "Coordinates extracted from the game's Unity scene files. Route and access instructions are not included — this page covers where the trees are, not how to reach them."}</p></article></Shell>;
}

export function DuckLocationsGuide({ locale }: { locale: Locale }) {
  const de = locale === "de";
  const duckAchievements = achievementData.achievements.filter((achievement) => /duck|rubber/i.test(`${achievement.displayName} ${achievement.description ?? ""}`));
  const faq: Faq[] = de ? [
    ["Wie viele Gummienten gibt es in Chop Chop Inc.?", `Die Lokalisierungsdaten enthalten ${ducks.length} Gummienten.`],
    ["Wie heißen alle Gummienten?", ducks.map((duck) => duck.name.de).join(", ") + "."],
    ["Schalten Gummienten Errungenschaften frei?", duckAchievements.length ? duckAchievements.map((a) => `${a.displayName} (${a.globalPercent} %)`).join(", ") : `Alle ${achievementData.totalAchievements} Steam-Errungenschaften wurden geprüft; keine davon verweist auf Gummienten.`],
    ["Kann man eine Gummiente dauerhaft verpassen?", "Die Szenendaten können nicht bestimmen, ob eine Gummiente dauerhaft verpasst werden kann."],
  ] : [
    ["How many rubber ducks are in Chop Chop Inc?", `The localization data contains ${ducks.length} rubber ducks.`],
    ["What are all the rubber duck names?", ducks.map((duck) => duck.name.en).join(", ") + "."],
    ["Do rubber ducks unlock achievements?", duckAchievements.length ? duckAchievements.map((a) => `${a.displayName} (${a.globalPercent}%)`).join(", ") : `All ${achievementData.totalAchievements} Steam achievements were checked; none refers to rubber ducks.`],
    ["Can you permanently miss a rubber duck?", "The scene data cannot determine whether a rubber duck can be permanently missed."],
  ];
  return <Shell locale={locale}><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd(faq)) }}/><Breadcrumbs locale={locale} items={[{ name: "Guides" }, { name: de ? "Gummienten-Standorte" : "Duck Locations" }]}/><article><header className="hero"><h1>{de ? `Chop Chop Inc. Gummienten-Standorte – alle ${ducks.length} Gummienten` : `Chop Chop Inc Duck Locations - All ${ducks.length} Rubber Ducks`}</h1><p className="lead">{de ? `Chop Chop Inc. enthält ${ducks.length} Gummienten. Diese Seite listet alle ${ducks.length} mit ihren offiziellen Namen und Beschreibungen aus dem Spiel sowie exakte Koordinaten für die ${duckMarkers.length} Enten auf, deren Positionen in den Spieldateien bestätigt sind.` : `Chop Chop Inc. contains ${ducks.length} rubber ducks. This page lists all ${ducks.length} with their official in-game names and descriptions, plus exact coordinates for the ${duckMarkers.length} that have confirmed world placements in the game files.`}</p></header>
  <section className="section-group"><h2>{de ? "Wie viele Gummienten gibt es?" : "How Many Rubber Ducks Are There?"}</h2><p>{de ? `Die Lokalisierungsdateien enthalten ${ducks.length} Gummienten. Für ${duckMarkers.length} davon sind Koordinaten bestätigt; für ${ducks.length - duckMarkers.length} enthält der aktuelle Datensatz keine Platzierungsposition.` : `The localization files contain ${ducks.length} rubber ducks. ${duckMarkers.length} have confirmed coordinates; the current data set contains no placement position for the remaining ${ducks.length - duckMarkers.length}.`}</p></section>
  <section className="section-group"><h2>{de ? `Alle ${ducks.length} Gummienten` : `All ${ducks.length} Rubber Ducks`}</h2><div className="coordinate-table-wrap"><table className="coordinate-table"><thead><tr><th>#</th><th>{de ? "Offizieller Name" : "Official name"}</th><th>{de ? "Offizielle Beschreibung" : "Official description"}</th></tr></thead><tbody>{ducks.map((duck, index) => <tr key={duck.id}><td>{index + 1}</td><td>{duck.name[locale]}</td><td>{duck.description?.[locale] ?? "—"}</td></tr>)}</tbody></table></div></section>
  <section className="section-group"><h2>{de ? "Bestätigte Gummienten-Standorte" : "Confirmed Duck Locations"}</h2><InteractiveMap markers={[...duckMarkers, ...landmarks]} locale={locale} guideCategories={["rubber-ducks", "landmarks"]}/><CoordinateTable markers={duckMarkers} locale={locale}/><p>{de ? `Für die übrigen ${ducks.length - duckMarkers.length} Gummienten enthält der aktuelle Datensatz keine Standortinformationen.` : `The current data set contains no location information for the remaining ${ducks.length - duckMarkers.length} rubber ducks.`}</p></section>
  <section className="section-group"><h2>{de ? "Schalten Gummienten Errungenschaften frei?" : "Do Rubber Ducks Unlock Achievements?"}</h2>{duckAchievements.length ? <ul>{duckAchievements.map((achievement) => <li key={achievement.slug}><strong>{achievement.displayName}</strong> — {achievement.description ?? (de ? "Versteckte Errungenschaft" : "Hidden achievement")} · {achievement.globalPercent}%</li>)}</ul> : <p>{de ? `Alle ${achievementData.totalAchievements} Steam-Errungenschaften wurden geprüft; keine davon verweist auf Gummienten.` : `All ${achievementData.totalAchievements} Steam achievements were checked; no rubber-duck-related achievement was found.`}</p>}</section>
  <section className="section-group"><h2>{de ? "Häufig gestellte Fragen" : "Frequently Asked Questions"}</h2>{faq.map(([question, answer]) => <div className="card" key={question}><h3>{question}</h3><p>{answer}</p></div>)}</section>
  <p className="map-note">{de ? "Namen und Beschreibungen der Enten aus den Lokalisierungsdateien des Spiels extrahiert. Koordinaten aus den Unity-Szenendateien extrahiert. Routen- und Zugangshinweise sind nicht enthalten." : "Duck names and descriptions extracted from the game's localization files. Coordinates extracted from the Unity scene files. Route and access instructions are not included."}</p></article></Shell>;
}
