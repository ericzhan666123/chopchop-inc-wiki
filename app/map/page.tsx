import { MapPage } from "@/components/MapPage";
import { seoPageMetadata } from "@/lib/seo-copy";
export const metadata = seoPageMetadata("Chop Chop Inc. Map - Tree, Duck & Landmark Locations", "Interactive Chop Chop Inc. map with 307 tree locations across 8 species, 7 rubber ducks and all landmarks, extracted from the game files. The game has no in-game map.", "en", "/map");
export default function Page() { return <MapPage locale="en"/>; }
