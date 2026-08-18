import { LegalPage } from "@/components/InfoPages";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(
  "Datenschutz - Chop Chop Inc. Wiki",
  "Informationen zur Verarbeitung von Verkehrsdaten und Cookies durch Google Tag Manager und Google Analytics.",
  "de",
  "/privacy",
);

export default function Page() {
  return <LegalPage locale="de" type="privacy" />;
}