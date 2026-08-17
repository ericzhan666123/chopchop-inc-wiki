import { QuestsIndexPage } from "@/components/QuestPages";
import { pageMetadata } from "@/lib/metadata";
export const metadata=pageMetadata("Chop Chop Inc. Quests & Walkthroughs","Quest walkthroughs with every objective and the original dialogue extracted from the game files.","en","/quests");
export default function Page(){return <QuestsIndexPage locale="en"/>}
