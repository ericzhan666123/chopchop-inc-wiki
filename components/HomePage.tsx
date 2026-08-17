import Link from "next/link";
import { Shell } from "./Shell";
import { OptionalImage } from "./OptionalImage";
import { audiences, ducks, items, npcs, pathFor, text, trees, visibleRecipes } from "@/lib/content";
import { mapMarkers, mappedPlaceNames } from "@/lib/world-map";
import type { Locale } from "@/lib/types";

const steam="https://store.steampowered.com/app/4369130/Chop_Chop_Inc/";
const discord="https://discord.com/invite/4wpwnxqTWg";
const youtube="https://www.youtube.com/@nullrefentertainment";

export function HomePage({locale}:{locale:Locale}) {
  const de=locale==="de";
  const verified=new Intl.DateTimeFormat(de?"de-DE":"en-US",{dateStyle:"long",timeZone:"UTC"}).format(new Date());
  const mapCounts={
    trees:mapMarkers.filter(marker=>marker.type==="tree").length,
    ducks:mapMarkers.filter(marker=>marker.type==="rubberDuck").length,
    places:mappedPlaceNames.length,
    landmarks:mapMarkers.filter(marker=>marker.type==="landmark").length,
  };
  const browse=[
    [de?"Karte":"Map",mapMarkers.length,"/map"],[de?"Rezepte":"Recipes",visibleRecipes.length,"/recipes"],[de?"Gegenstände":"Items",items.length,"/items"],
    [de?"Bäume":"Trees",trees.length,"/trees"],[de?"Gummienten":"Rubber Ducks",ducks.length,"/ducks"],[de?"Zielgruppen":"Audiences",audiences.length,"/audiences"],
  ] as const;
  const treeNames=trees.map(entry=>text(entry.name,locale));
  const faq=de?[
    ["Was ist der zentrale Spielablauf in Chop Chop Inc.?","Fälle Bäume, verarbeite Holz zu Brettern und Balken, baue Möbel, liefere sie per Drohne in die Stadt und automatisiere anschließend die Produktion."],
    ["Wie viele Herstellungsrezepte gibt es?",`${visibleRecipes.length} Rezepte erscheinen im Rezeptbuch des Spiels. Die Spieldateien enthalten insgesamt 209 Rezepteinträge, darunter interne Quest- und Bauschritte.`],
    ["Wie viele Baumarten gibt es im Spiel?",`${trees.length}: ${treeNames.join(", ")}.`],["Wie viele Gummienten kann man sammeln?",`${ducks.length}.`],
    ["Wer ist Chester?","Chester Hoardington ist die sprechende Truhe, die durch das Tutorial führt."],["Wo finde ich den offiziellen Discord?",discord],
    ["Ist dies ein offizielles Wiki?","Nein. Dies ist ein inoffizielles Fan-Wiki ohne Verbindung zu NullRef Entertainment oder rokaplay select."],
  ]: [
    ["What is the core loop in Chop Chop Inc.?","Cut trees, process wood into planks and beams, craft furniture, ship to the city by drone, then automate."],
    ["How many crafting recipes are there?",`${visibleRecipes.length} recipes appear in the in-game recipe book. The game files contain 209 recipe entries in total, including internal quest and construction steps.`],
    ["How many tree types are in the game?",`${trees.length}: ${treeNames.join(", ")}.`],["How many rubber ducks can you collect?",`${ducks.length}.`],
    ["Who is Chester?","Chester Hoardington, the talking chest who guides the tutorial."],["Where is the official Discord?",discord],
    ["Is this an official wiki?","No. Unofficial fan wiki, not affiliated with NullRef Entertainment or rokaplay select."],
  ];
  const faqLd={"@context":"https://schema.org","@type":"FAQPage",mainEntity:faq.map(([question,answer])=>({"@type":"Question",name:question,acceptedAnswer:{"@type":"Answer",text:answer}}))};
  const steps=de?[["01","Fällen","Bäume fällen und Stämme gewinnen","refinedmaterials","/images/step-cut.jpg"],["02","Verarbeiten","Holz zu Brettern und Balken verarbeiten","items","/images/step-process.jpg"],["03","Bauen","Möbel zusammensetzen","furniture","/images/step-craft.jpg"],["04","Verteilen","Waren per Drohne in die Stadt liefern","audiences","/images/step-distribute.jpg"]]:[["01","Cut","Cut trees to obtain logs","refinedmaterials","/images/step-cut.jpg"],["02","Process","Process wood into planks and beams","items","/images/step-process.jpg"],["03","Craft","Assemble furniture","furniture","/images/step-craft.jpg"],["04","Distribute","Ship goods to the city by drone","audiences","/images/step-distribute.jpg"]];
  return <Shell locale={locale}><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(faqLd)}}/><section className="home-hero"><div><div className="eyebrow">{de?"Aus Spieldateien extrahierte Daten":"Data extracted from game files"}</div><h1>Chop Chop Inc. Wiki</h1><p className="lead">{de?"Die vollständige Datenbank für Rezepte, Gegenstände, Figuren und die Spielwelt – direkt aus den Spieldateien extrahiert.":"A complete database of recipes, items, characters and world data, extracted directly from the game files."}</p><p className="verified">{de?"Zuletzt geprüft":"Last verified"}: {verified}</p><div className="cta-row"><Link className="button primary" href={pathFor(locale,"/recipes")}>{de?"Rezepte ansehen":"Browse Recipes"}</Link><Link className="button" href={pathFor(locale,"/items")}>{de?"Gegenstände ansehen":"Browse Items"}</Link><a className="button ghost" href={steam}>{de?"Auf Steam ansehen":"Get it on Steam"} ↗</a></div></div><OptionalImage src="/images/hero.jpg" alt={de?"Chop Chop Inc. Spielszene":"Chop Chop Inc. gameplay"} className="hero-image"/></section>
  <section className="home-map-preview card"><Link className="home-map-image" href={pathFor(locale,"/map")} aria-label={de?"Interaktive Karte öffnen":"Open the Interactive Map"}><img src="/images/terrain-overworld.webp" alt={de?"Geländevorschau der interaktiven Weltkarte":"Terrain preview of the interactive world map"} width="1024" height="727" loading="lazy"/></Link><div className="home-map-copy"><div className="eyebrow">{de?"Interaktive Weltkarte":"Interactive world map"}</div><h2>{de?"Das Spiel hat keine Karte. Wir haben eine gebaut.":"The Game Has No Map. We Built One."}</h2><p>{de?"Chop Chop Inc. hat weder Minikarte noch Kompass oder Koordinaten. Diese Karte wurde aus den Geländedaten des Spiels gerendert.":"Chop Chop Inc. ships without a minimap, compass or coordinates. This map is rendered from the game's own terrain data."}</p><p className="home-map-stats">{de?`${mapCounts.trees} Baumstandorte · ${mapCounts.ducks} Gummienten · ${mapCounts.places} benannte Gebiete · ${mapCounts.landmarks} Landmarken`:`${mapCounts.trees} tree locations · ${mapCounts.ducks} rubber ducks · ${mapCounts.places} named areas · ${mapCounts.landmarks} landmarks`}</p><Link className="button primary" href={pathFor(locale,"/map")}>{de?"Interaktive Karte öffnen":"Open the Interactive Map"}</Link></div></section>
  <section className="home-section"><h2>{de?"Spielüberblick":"Game snapshot"}</h2><div className="snapshot card">{[[de?"Entwickler":"Developer","NullRef Entertainment"],[de?"Publisher":"Publisher","rokaplay select"],[de?"Plattform":"Platform","Steam PC (App ID 4369130)"],["Genre",de?"First-Person-Crafting / gemütliche Comedy-Simulation":"First-person crafting / cozy comedy sim"],[de?"Veröffentlicht":"Released",de?"7. August 2026":"August 7, 2026"],[de?"Modus":"Mode",de?"Einzelspieler":"Singleplayer"],[de?"Errungenschaften":"Achievements","21"],[de?"Sprachen":"Languages",de?"7 (darunter Englisch, Deutsch und vereinfachtes Chinesisch)":"7 (incl. English, German, Simplified Chinese)"]].map(([key,value])=><div className="snapshot-row" key={key}><strong>{key}</strong><span>{value}</span></div>)}</div></section>
  <section className="home-section"><h2>{de?"Datenbank durchsuchen":"Browse the database"}</h2><div className="grid">{browse.map(([name,count,href])=><Link className="card browse-card" href={pathFor(locale,href)} key={href}><strong>{count}</strong><h3>{name}</h3></Link>)}</div></section>
  <section className="home-section"><h2>{de?"Spielablauf":"Core loop"}</h2><div className="steps">{steps.map(([number,title,description,target,image])=>{const href=target==="items"?"/items":target==="audiences"?"/audiences":`/recipes/category/${target}`;return <Link className="step-card card" href={pathFor(locale,href)} key={number}><OptionalImage src={image} alt={`${title}: ${description}`} className="step-image"/><span className="step-number">{number}</span><h3>{title}</h3><p className="muted">{description}</p></Link>})}</div></section>
  <section className="home-section"><h2>{de?"Ausgewählte Daten":"Featured data"}</h2><div className="featured-grid"><div className="card"><h3>{trees.length} {de?"Baumarten":"Tree types"}</h3><p>{treeNames.join(" · ")}</p></div><div className="card"><h3>{ducks.length} {de?"Gummienten":"Rubber ducks"}</h3><p>{ducks.map(entry=>text(entry.name,locale)).join(" · ")}</p></div><div className="card"><h3>{de?"NPCs":"NPCs"}</h3><p>{npcs.slice(0,6).map(entry=>text(entry.name,locale)).join(" · ")}</p></div></div></section>
  <section className="home-section faq"><h2>FAQ</h2>{faq.map(([question,answer])=><details className="card" key={question}><summary>{question}</summary><p>{answer.startsWith("https://")?<a href={answer}>{answer}</a>:answer}</p></details>)}</section>
  <section className="home-section video-card card"><div><div className="eyebrow">YouTube</div><h2>{de?"Offizielle Videos von NullRef Entertainment":"Official videos from NullRef Entertainment"}</h2><p className="muted">{de?"Gameplay, Entwicklungsneuigkeiten und Trailer auf dem offiziellen Kanal.":"Gameplay, development updates and trailers on the official channel."}</p></div><a className="button primary" href={youtube}>{de?"YouTube-Kanal öffnen":"Visit the YouTube channel"} ↗</a></section>
  </Shell>;
}
