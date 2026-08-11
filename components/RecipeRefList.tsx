import Link from "next/link";
import type { Locale,RecipeRef } from "@/lib/types";
import { items,pathFor,slugifyId,text } from "@/lib/content";
export function RecipeRefList({refs,locale}:{refs:RecipeRef[];locale:Locale}){return <div className="list">{refs.map((ref,i)=>{const item=items.find(x=>x.id===ref.itemId); const name=ref.name?text(ref.name,locale):item?text(item.name,locale):ref.itemId; const body=<div className="row"><span>{name}</span><strong>{ref.amount ?? "—"}</strong></div>;return item?<Link className="card" href={pathFor(locale,`/items/${slugifyId(item.id)}`)} key={`${ref.itemId}-${i}`}>{body}</Link>:<div className="card" key={`${ref.itemId}-${i}`}>{body}</div>})}</div>}
