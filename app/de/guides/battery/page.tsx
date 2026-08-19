import { BatteryGuide } from "@/components/CommunityGuidePages";
import { pageMetadata } from "@/lib/metadata";
export const metadata=pageMetadata("Chop Chop Inc. Batterie – wo sie hergestellt wird","Batterien werden laut Community an der Electric Press hergestellt und nicht am PC gekauft. Hinweise zum Bauplan sowie Daten zu Rezept und Verwendungen.","de","/guides/battery");
export default function Page(){return <BatteryGuide locale="de"/>}
