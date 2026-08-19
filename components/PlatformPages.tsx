import Link from "next/link";
import { Breadcrumbs } from "./Breadcrumbs";
import { Shell } from "./Shell";
import { pathFor } from "@/lib/content";
import { achievementData } from "@/lib/steam";
import { platformCopy, platformSlugs, platformStatus, type PlatformSlug } from "@/lib/platforms";
import type { Locale } from "@/lib/types";

function faqLd(faq: Array<[string, string]>) { return { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faq.map(([name, text]) => ({ "@type": "Question", name, acceptedAnswer: { "@type": "Answer", text } })) }; }

export function PlatformsHub({ locale }: { locale: Locale }) {
  const de = locale === "de";
  return <Shell locale={locale}><Breadcrumbs locale={locale} items={[{ name: de ? "Spielinfo" : "Game Info", path: "/game-info" }, { name: de ? "Plattformen" : "Platforms" }]}/><header className="hero"><h1>{de ? "Chop Chop Inc.: Plattformen und Spielmodi" : "Chop Chop Inc. Platforms & Play Modes"}</h1><p className="lead">{de ? "Wähle eine Plattform oder einen Spielmodus, um den bestätigten Status zu sehen." : "Choose a platform or play mode to see its confirmed status."}</p></header><div className="grid">{platformSlugs.map((slug) => <Link className="card" key={slug} href={pathFor(locale, `/platforms/${slug}`)}><h2>{platformCopy[slug][locale].card}</h2><p>{platformCopy[slug][locale].answer}</p></Link>)}</div></Shell>;
}

export function PlatformDetailPage({ locale, slug }: { locale: Locale; slug: PlatformSlug }) {
  const de = locale === "de";
  const copy = platformCopy[slug][locale];
  const rarest = [...achievementData.achievements].sort((a, b) => a.globalPercent - b.globalPercent)[0];
  const generic: Array<[string, string]> = de ? [
    [copy.title, `${copy.answer} ${copy.second}`],
    ["Läuft Chop Chop Inc. auf dem Steam Deck?", "Das Spiel ist nicht von Valve für das Steam Deck verifiziert."],
    ["Hat Chop Chop Inc. Multiplayer?", "Nein. Das Spiel ist ausschließlich für Einzelspieler ausgelegt."],
  ] : [
    [copy.title, `${copy.answer} ${copy.second}`],
    ["Can I play Chop Chop Inc on Steam Deck?", "The game is not verified for Steam Deck by Valve."],
    ["Does Chop Chop Inc have multiplayer?", "No. It is single-player only."],
  ];
  if (["ps5", "xbox", "switch", "mobile"].includes(slug)) generic.splice(1, 0, de ? ["Wurde eine weitere Plattformversion angekündigt?", "Es wurde keine Konsolen- oder Mobilversion angekündigt."] : ["Has another platform version been announced?", "No console or mobile version has been announced."]);
  return <Shell locale={locale}><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd(generic)) }}/><Breadcrumbs locale={locale} items={[{ name: de ? "Spielinfo" : "Game Info", path: "/game-info" }, { name: de ? "Plattformen" : "Platforms", path: "/platforms" }, { name: copy.card }]}/><article><header className="hero"><h1>{copy.title}</h1><p className="lead"><strong>{copy.answer}</strong> {copy.second}</p></header>
  <section className="section-group"><h2>{de ? "Plattformstatus" : "Platform status"}</h2><div className="coordinate-table-wrap"><table className="coordinate-table"><thead><tr><th>{de ? "Plattform" : "Platform"}</th><th>Status</th></tr></thead><tbody>{platformStatus.map((row) => <tr key={row.platform}><td>{row.platform}</td><td>{row[locale]}</td></tr>)}</tbody></table></div></section>
  <section className="section-group"><h2>{de ? "Was die PC-Version bietet" : "What the PC version includes"}</h2><div className="snapshot card"><div className="snapshot-row"><strong>{de ? "Errungenschaften" : "Achievements"}</strong><span>{achievementData.totalAchievements}; {de ? "seltenste" : "rarest"}: {rarest.displayName} ({rarest.globalPercent}%)</span></div><div className="snapshot-row"><strong>{de ? "Sprachen" : "Languages"}</strong><span>7</span></div><div className="snapshot-row"><strong>{de ? "System" : "System"}</strong><span>Windows 10/11 64-bit · 8 GB RAM · DirectX 12 · 5 GB · <strong>SSD required</strong></span></div><div className="snapshot-row"><strong>{de ? "Preis und Demo" : "Price and demo"}</strong><span>$12.99 USD · {de ? "kostenlose Demo" : "free demo"} (App ID 4707740)</span></div><div className="snapshot-row"><strong>{de ? "Modus" : "Mode"}</strong><span>{de ? "Nur Einzelspieler; kein Multiplayer oder Koop" : "Single-player only; no multiplayer or co-op"}</span></div></div><p><Link href={pathFor(locale, "/system-requirements")}>{de ? "Systemanforderungen" : "System requirements"}</Link> · <Link href={pathFor(locale, "/languages")}>{de ? "Sprachen" : "Languages"}</Link> · <Link href={pathFor(locale, "/price-and-demo")}>{de ? "Preis & Demo" : "Price & Demo"}</Link> · <Link href={pathFor(locale, "/achievements")}>{de ? "Errungenschaften" : "Achievements"}</Link></p></section>
  <section className="section-group"><h2>{de ? "Häufig gestellte Fragen" : "Frequently Asked Questions"}</h2>{generic.map(([question, answer]) => <div className="card" key={question}><h3>{question}</h3><p>{answer}</p></div>)}</section>
  <p className="map-note">{de ? "Der Plattformstatus wird anhand der offiziellen Steam-Shopseite geprüft. Die Patchnotes auf dieser Website werden täglich mit Steam synchronisiert." : "Platform status is checked against the official Steam store page. Patch notes on this site sync from Steam daily."}</p></article></Shell>;
}
