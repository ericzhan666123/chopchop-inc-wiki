import type { Metadata } from "next";
import type { Locale } from "./types";
import { pathFor } from "./content";
const origin = process.env.NEXT_PUBLIC_SITE_URL ?? "https://chop-chop-inc-wiki.pages.dev";
export function pageMetadata(title: string, description: string, locale: Locale, path: string): Metadata {
  const en = pathFor("en", path); const de = pathFor("de", path);
  return { title, description, alternates: { canonical: `${origin}${pathFor(locale,path)}`, languages: { en:`${origin}${en}`, de:`${origin}${de}`, "x-default":`${origin}${en}` } }, openGraph:{title,description,type:"website",locale:locale === "de" ? "de_DE":"en_US",url:`${origin}${pathFor(locale,path)}`} };
}
