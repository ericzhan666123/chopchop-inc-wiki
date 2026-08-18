import { LegalPage } from "@/components/InfoPages";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata(
  "Privacy Policy - Chop Chop Inc. Wiki",
  "How Google Tag Manager and Google Analytics process traffic data and cookies on this site.",
  "en",
  "/privacy",
);

export default function Page() {
  return <LegalPage locale="en" type="privacy" />;
}