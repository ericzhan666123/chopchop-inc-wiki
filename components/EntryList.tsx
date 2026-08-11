import type { Entry,Locale } from "@/lib/types";
import { text } from "@/lib/content";
export function EntryList({entries,locale}:{entries:Entry[];locale:Locale}){return <div className="list">{entries.map(e=><article className="card" key={e.id}><h2>{text(e.name,locale)}</h2>{e.description?<p className="muted prose">{text(e.description,locale)}</p>:null}</article>)}</div>}
