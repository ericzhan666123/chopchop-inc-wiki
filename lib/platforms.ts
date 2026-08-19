import type { Locale } from "./types";

export const platformSlugs = ["ps5", "xbox", "switch", "multiplayer", "steam-deck", "mobile"] as const;
export type PlatformSlug = (typeof platformSlugs)[number];

export const platformStatus = [
  { platform: "PC (Steam, App ID 4369130)", en: "Available since August 7, 2026", de: "Seit dem 7. August 2026 erhältlich" },
  { platform: "PlayStation 5", en: "Not announced", de: "Nicht angekündigt" },
  { platform: "Xbox Series X/S", en: "Not announced", de: "Nicht angekündigt" },
  { platform: "Nintendo Switch", en: "Not announced", de: "Nicht angekündigt" },
  { platform: "Steam Deck", en: "Not verified by Valve", de: "Nicht von Valve verifiziert" },
  { platform: "Mobile (iOS / Android)", en: "Not announced", de: "Nicht angekündigt" },
] as const;

type Copy = { title: string; answer: string; second: string; card: string; description: string };
export const platformCopy: Record<PlatformSlug, Record<Locale, Copy>> = {
  ps5: {
    en: { title: "Is Chop Chop Inc on PS5?", answer: "No. Chop Chop Inc. is only available on PC via Steam.", second: "No PlayStation 5 version has been announced.", card: "PlayStation 5 availability", description: "Chop Chop Inc is PC-only on Steam. No PlayStation 5 version has been announced. Full platform status, PC features and system requirements." },
    de: { title: "Gibt es Chop Chop Inc. für PS5?", answer: "Nein. Chop Chop Inc. ist ausschließlich für PC über Steam erhältlich.", second: "Eine Version für PlayStation 5 wurde nicht angekündigt.", card: "Verfügbarkeit für PlayStation 5", description: "Chop Chop Inc. ist nur für PC über Steam erhältlich. Eine PS5-Version wurde nicht angekündigt. Plattformstatus, PC-Funktionen und Systemanforderungen." },
  },
  xbox: {
    en: { title: "Is Chop Chop Inc on Xbox?", answer: "No. Chop Chop Inc. is only available on PC via Steam.", second: "No Xbox version has been announced.", card: "Xbox availability", description: "Chop Chop Inc is PC-only on Steam. No Xbox version has been announced. See the confirmed platform status, PC features and system requirements." },
    de: { title: "Gibt es Chop Chop Inc. für Xbox?", answer: "Nein. Chop Chop Inc. ist ausschließlich für PC über Steam erhältlich.", second: "Eine Xbox-Version wurde nicht angekündigt.", card: "Verfügbarkeit für Xbox", description: "Chop Chop Inc. ist nur für PC über Steam erhältlich. Eine Xbox-Version wurde nicht angekündigt. Plattformstatus, PC-Funktionen und Systemanforderungen." },
  },
  switch: {
    en: { title: "Is Chop Chop Inc on Nintendo Switch?", answer: "No. Chop Chop Inc. is only available on PC via Steam.", second: "No Nintendo Switch version has been announced.", card: "Nintendo Switch availability", description: "Chop Chop Inc is PC-only on Steam. No Nintendo Switch version has been announced. See confirmed platform status and PC requirements." },
    de: { title: "Gibt es Chop Chop Inc. für Nintendo Switch?", answer: "Nein. Chop Chop Inc. ist ausschließlich für PC über Steam erhältlich.", second: "Eine Version für Nintendo Switch wurde nicht angekündigt.", card: "Verfügbarkeit für Nintendo Switch", description: "Chop Chop Inc. ist nur für PC über Steam erhältlich. Eine Switch-Version wurde nicht angekündigt. Plattformstatus und PC-Anforderungen im Überblick." },
  },
  multiplayer: {
    en: { title: "Does Chop Chop Inc Have Multiplayer or Co-op?", answer: "No. Chop Chop Inc. is a single-player game.", second: "It has no multiplayer or co-op mode.", card: "Multiplayer and co-op status", description: "Chop Chop Inc is single-player only, with no multiplayer or co-op. See its confirmed platforms, PC features and system requirements." },
    de: { title: "Hat Chop Chop Inc. Multiplayer oder Koop?", answer: "Nein. Chop Chop Inc. ist ein Einzelspielerspiel.", second: "Es gibt weder Multiplayer noch einen Koop-Modus.", card: "Multiplayer- und Koop-Status", description: "Chop Chop Inc. ist ausschließlich für Einzelspieler ausgelegt und bietet weder Multiplayer noch Koop. Plattformen und PC-Anforderungen im Überblick." },
  },
  "steam-deck": {
    en: { title: "Does Chop Chop Inc Work on Steam Deck?", answer: "Chop Chop Inc. is not verified for Steam Deck by Valve.", second: "The available data does not establish Steam Deck compatibility beyond that status.", card: "Steam Deck verification", description: "Chop Chop Inc is not verified for Steam Deck by Valve. See the confirmed platform status, PC features and official system requirements." },
    de: { title: "Läuft Chop Chop Inc. auf dem Steam Deck?", answer: "Chop Chop Inc. ist von Valve nicht für das Steam Deck verifiziert.", second: "Die verfügbaren Daten belegen darüber hinaus keine Steam-Deck-Kompatibilität.", card: "Steam-Deck-Verifizierung", description: "Chop Chop Inc. ist von Valve nicht für das Steam Deck verifiziert. Hier stehen der bestätigte Plattformstatus und die PC-Systemanforderungen." },
  },
  mobile: {
    en: { title: "Is Chop Chop Inc on Mobile?", answer: "No. Chop Chop Inc. is only available on PC via Steam.", second: "No iOS or Android version has been announced.", card: "iOS and Android availability", description: "Chop Chop Inc is PC-only on Steam. No iOS or Android version has been announced. See confirmed platform status and PC requirements." },
    de: { title: "Gibt es Chop Chop Inc. für Smartphones?", answer: "Nein. Chop Chop Inc. ist ausschließlich für PC über Steam erhältlich.", second: "Eine Version für iOS oder Android wurde nicht angekündigt.", card: "Verfügbarkeit für iOS und Android", description: "Chop Chop Inc. ist nur für PC über Steam erhältlich. Eine iOS- oder Android-Version wurde nicht angekündigt. Plattformstatus und PC-Anforderungen." },
  },
};
