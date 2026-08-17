import { LanguagesPage } from "@/components/FactPages";
import { pageMetadata } from "@/lib/metadata";
export const metadata=pageMetadata("Chop Chop Inc. – alle 7 unterstützten Sprachen","Alle sieben unterstützten Oberflächensprachen sowie Angaben zu Sprachausgabe und Untertiteln.","de","/languages");
export default function Page(){return <LanguagesPage locale="de"/>}
