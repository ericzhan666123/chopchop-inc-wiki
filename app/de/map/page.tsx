import { MapPage } from "@/components/MapPage";
import { seoPageMetadata } from "@/lib/seo-copy";
export const metadata = seoPageMetadata("Chop Chop Inc. Karte – Bäume, Enten & Orientierungspunkte", "Interaktive Chop Chop Inc.-Karte mit 307 Baumstandorten aus 8 Arten, 7 Gummienten und allen Orientierungspunkten, direkt aus den Spieldateien. Das Spiel hat keine eigene Karte.", "de", "/map");
export default function Page() { return <MapPage locale="de"/>; }
