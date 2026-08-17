"use client";

import { useMemo, useState } from "react";
import type { Locale } from "@/lib/types";
import { categoryLabel, mapBounds, mapCategorySlugs, markerCategory, markerName, type MapCategorySlug, type MapMarker } from "@/lib/world-map";

const WIDTH = 882;
const PAD = 28;
const defaultCategories: MapCategorySlug[] = ["landmarks", "rubber-ducks"];

function elevationColor(elevation: number) {
  const bounded = Math.max(-55, Math.min(55, elevation));
  if (bounded < 0) {
    const t = (bounded + 55) / 55;
    return `hsl(${205 - t * 5} ${75 - t * 40}% ${53 + t * 20}%)`;
  }
  const t = bounded / 55;
  return `hsl(${45 - t * 35} ${38 + t * 42}% ${73 - t * 20}%)`;
}

export function InteractiveMap({ markers, locale, lockedCategory }: { markers: MapMarker[]; locale: Locale; lockedCategory?: MapCategorySlug }) {
  const de = locale === "de";
  const [layer, setLayer] = useState<"overworld" | "dungeon">("overworld");
  const [selected, setSelected] = useState<MapMarker | null>(null);
  const [enabled, setEnabled] = useState<MapCategorySlug[]>(lockedCategory ? [lockedCategory] : defaultCategories);
  const bounds = mapBounds[layer];
  const height = WIDTH * ((bounds.maxZ - bounds.minZ) / (bounds.maxX - bounds.minX));
  const visible = useMemo(() => markers.filter((marker) => marker.layer === layer && enabled.includes(markerCategory(marker) as MapCategorySlug)), [markers, layer, enabled]);
  const toggle = (category: MapCategorySlug) => setEnabled((current) => current.includes(category) ? current.filter((item) => item !== category) : [...current, category]);
  const projectX = (x: number) => PAD + ((x - bounds.minX) / (bounds.maxX - bounds.minX)) * (WIDTH - PAD * 2);
  const projectY = (z: number) => PAD + ((z - bounds.minZ) / (bounds.maxZ - bounds.minZ)) * (height - PAD * 2);
  const categories = lockedCategory ? [lockedCategory] : mapCategorySlugs;

  return <section className="map-tool" aria-label={de ? "Interaktive Karte" : "Interactive map"}>
    <div className="map-toolbar">
      <div className="map-tabs" role="tablist" aria-label={de ? "Kartenebene" : "Map layer"}>
        {(["overworld", "dungeon"] as const).map((item) => <button key={item} type="button" role="tab" aria-selected={layer === item} className={layer === item ? "active" : ""} onClick={() => { setLayer(item); setSelected(null); }}>{item === "overworld" ? (de ? "Oberwelt" : "Overworld") : (de ? "Dungeon" : "Dungeon")}</button>)}
      </div>
      {!lockedCategory && <details className="map-filter-mobile"><summary>{de ? "Marker filtern" : "Filter markers"} ({enabled.length})</summary><FilterList categories={categories} enabled={enabled} locale={locale} onToggle={toggle}/></details>}
    </div>
    {!lockedCategory && <div className="map-filter-desktop"><FilterList categories={categories} enabled={enabled} locale={locale} onToggle={toggle}/></div>}
    <div className="map-scroll" tabIndex={0} aria-label={de ? "Karte, horizontal scrollbar" : "Map, horizontally scrollable"}>
      <svg className="world-map-svg" viewBox={`0 0 ${WIDTH} ${height}`} role="img" aria-label={`${layer === "overworld" ? (de ? "Oberwelt" : "Overworld") : "Dungeon"}: ${visible.length} ${de ? "sichtbare Marker" : "visible markers"}`}>
        <defs><pattern id="map-grid" width="44" height="44" patternUnits="userSpaceOnUse"><path d="M 44 0 L 0 0 0 44" fill="none" stroke="#ffffff14" strokeWidth="1"/></pattern></defs>
        <rect width={WIDTH} height={height} rx="12" fill="#0c1b15"/><rect width={WIDTH} height={height} rx="12" fill="url(#map-grid)"/>
        {visible.map((marker) => {
          const category = markerCategory(marker)!;
          const landmark = category === "landmarks";
          const x = projectX(marker.x), y = projectY(marker.z);
          return <g key={marker.id} className={`map-marker ${landmark ? "landmark" : ""}`} tabIndex={0} role="button" aria-label={markerName(marker, locale)} onMouseEnter={() => setSelected(marker)} onFocus={() => setSelected(marker)} onClick={() => setSelected(marker)}>
            <circle cx={x} cy={y} r={landmark ? 7 : 4.5} fill={elevationColor(marker.elevationRelativeToCamp)} stroke={selected?.id === marker.id ? "#fff" : "#07110c"} strokeWidth={selected?.id === marker.id ? 3 : 1.5}/>
            {landmark && <text x={x + 10} y={y + 4}>{markerName(marker, locale)}</text>}
          </g>;
        })}
      </svg>
    </div>
    <div className="map-legend" aria-label={de ? "Höhenlegende" : "Elevation legend"}><span>{de ? "Unter dem Camp" : "Below camp"}</span><div className="elevation-scale"/><span>0 m</span><span>{de ? "Über dem Camp" : "Above camp"}</span></div>
    <div className="map-readout" aria-live="polite">{selected ? <><strong>{markerName(selected, locale)}</strong><span>X {selected.x.toFixed(2)} · Y {selected.y.toFixed(2)} · Z {selected.z.toFixed(2)}</span><span>{selected.elevationRelativeToCamp >= 0 ? "+" : ""}{selected.elevationRelativeToCamp.toFixed(2)} m {de ? "relativ zum Camp" : "relative to camp"}</span></> : <span>{de ? "Marker mit Maus oder Tastatur auswählen, um Details zu sehen." : "Hover, click, or focus a marker to see its details."}</span>}</div>
  </section>;
}

function FilterList({ categories, enabled, locale, onToggle }: { categories: readonly MapCategorySlug[]; enabled: MapCategorySlug[]; locale: Locale; onToggle: (category: MapCategorySlug) => void }) {
  return <div className="map-filters">{categories.map((category) => <label key={category}><input type="checkbox" checked={enabled.includes(category)} onChange={() => onToggle(category)}/><span>{categoryLabel(category, locale, false)}</span></label>)}</div>;
}
