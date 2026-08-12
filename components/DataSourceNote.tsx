import Link from "next/link";
import { pathFor } from "@/lib/content";
import type { Locale } from "@/lib/types";
export function DataSourceNote({locale}:{locale:Locale}){return <p className="source-note">{locale==="de"?<>Rezeptdaten aus den Spieldateien (Demo-Build) extrahiert. Einzelne Werte können sich in späteren Patches geändert haben — siehe <Link href={pathFor(locale,"/updates")}>Updates</Link> für die aktuellen Patchnotes.</>:<>Recipe data extracted from the game files (demo build). Some values may have changed in later patches — see <Link href={pathFor(locale,"/updates")}>Updates</Link> for the latest patch notes.</>}</p>}
