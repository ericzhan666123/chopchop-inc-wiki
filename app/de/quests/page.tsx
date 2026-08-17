import { QuestsIndexPage } from "@/components/QuestPages";
import { pageMetadata } from "@/lib/metadata";
export const metadata=pageMetadata("Chop Chop Inc. Aufgaben & Komplettlösungen","Aufgaben mit allen Zielen und den direkt aus den Spieldateien extrahierten Originaldialogen.","de","/quests");
export default function Page(){return <QuestsIndexPage locale="de"/>}
