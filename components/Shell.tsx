import Link from "next/link";
import type { ReactNode } from "react";
import type { Locale } from "@/lib/types";
import { labels } from "@/lib/i18n";
import { pathFor } from "@/lib/content";

export function Shell({locale,children}:{locale:Locale;children:ReactNode}){const l=labels[locale]; const other=locale==="en"?"de":"en"; return <><header className="header"><nav className="shell nav"><Link className="brand" href={pathFor(locale)}>CHOP CHOP INC. WIKI</Link><div className="navlinks"><Link href={pathFor(locale,"/recipes")}>{l.recipes}</Link><Link href={pathFor(locale,"/items")}>{l.items}</Link><Link href={pathFor(locale,"/ducks")}>{l.ducks}</Link><Link href={pathFor(locale,"/trees")}>{l.trees}</Link><Link href={pathFor(locale,"/audiences")}>{l.audiences}</Link><Link href={pathFor(locale,"/npcs")}>{l.npcs}</Link></div><Link className="lang" href={pathFor(other)}>{other.toUpperCase()}</Link></nav></header><main className="shell main">{children}</main><footer className="footer"><div className="shell">Chop Chop Inc. Wiki · Data-driven static reference</div></footer></>}
