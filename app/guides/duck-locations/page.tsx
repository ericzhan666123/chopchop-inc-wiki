import { DuckLocationsGuide } from "@/components/GuidePages";
import { pageMetadata } from "@/lib/metadata";
export const metadata=pageMetadata("Chop Chop Inc Duck Locations - All 13 Rubber Ducks","All 13 rubber ducks in Chop Chop Inc with official names and descriptions, plus exact coordinates for 7 confirmed locations, extracted directly from the game files.","en","/guides/duck-locations");
export default function Page(){return <DuckLocationsGuide locale="en"/>}
