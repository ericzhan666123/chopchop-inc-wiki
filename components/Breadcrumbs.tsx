import Link from "next/link";
import { pathFor } from "@/lib/content";
import type { Locale } from "@/lib/types";

export type Crumb = { name: string; path?: string };
export function Breadcrumbs({locale,items}:{locale:Locale;items:Crumb[]}) {
  const home={name:locale==="de"?"Startseite":"Home",path:""};
  const all=[home,...items];
  const origin=process.env.NEXT_PUBLIC_SITE_URL??"https://chopchop-inc.wiki";
  const jsonLd={"@context":"https://schema.org","@type":"BreadcrumbList",itemListElement:all.map((item,index)=>({"@type":"ListItem",position:index+1,name:item.name,item:item.path!==undefined?`${origin}${pathFor(locale,item.path)}`:undefined}))};
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(jsonLd)}}/><nav className="breadcrumbs" aria-label={locale==="de"?"Brotkrümelnavigation":"Breadcrumb"}>{all.map((item,index)=><span key={`${item.name}-${index}`}>{index>0&&<b aria-hidden>›</b>}{item.path!==undefined?<Link href={pathFor(locale,item.path)}>{item.name}</Link>:<span>{item.name}</span>}</span>)}</nav></>;
}
