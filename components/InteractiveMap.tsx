"use client";

import { useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import type { Locale } from "@/lib/types";
import { categoryLabel, mapBounds, mapCategorySlugs, mapMarkers, mappedPlaceNames, markerCategory, markerName, terrainMeta, type MapCategorySlug, type MapMarker, type PlaceName } from "@/lib/world-map";

const OVERWORLD_WIDTH = 1024;
const OVERWORLD_HEIGHT = 727;
const DUNGEON_WIDTH = 1024;
const PAD = 34;
const defaultCategories: MapCategorySlug[] = ["landmarks", "rubber-ducks", "trees-birch"];
const categoryCounts = Object.fromEntries(mapCategorySlugs.map((category) => [category, mapMarkers.filter((marker) => markerCategory(marker) === category).length])) as Record<MapCategorySlug, number>;
const treeColors: Record<string, string> = { birch: "#d8e3d5", apple: "#d95745", stone: "#92989b", walnut: "#9a633d", metal: "#aab8c4", electronic: "#44c8b0", palm: "#e1c35f", crystal: "#a985dc" };
const treePath = "M0-11 8-2H4l6 7H3v6h-6V5h-7l6-7h-4z";

type DisplayPlace = PlaceName & { x: number; y: number; z: number };
type SelectedItem = { name: string; x: number; y: number; z: number; elevation: number };

const homeSweetHome: DisplayPlace = { id: "home-sweet-home", name: { en: "Home Sweet Home", de: "Home Sweet Home" }, locaKey: "WorldObject_Discover_HomeSweetHome", triggerObject: null, hierarchyPath: null, layer: "overworld", x: 264.7, y: 100, z: 239.26 };
const furnoxOutside = { name: { en: "Furnox Headquarter", de: "Furnox Hauptsitz" }, x: 91.8, y: 62, z: 146.2 };

function elevationColor(elevation: number) {
  const bounded = Math.max(-55, Math.min(55, elevation));
  if (bounded < 0) { const t = (bounded + 55) / 55; return `hsl(${205 - t * 5} ${75 - t * 40}% ${53 + t * 20}%)`; }
  const t = bounded / 55;
  return `hsl(${45 - t * 35} ${38 + t * 42}% ${73 - t * 20}%)`;
}

const inTerrainBounds = ({ x, z }: { x: number; z: number }) => x >= terrainMeta.cropWorldMinX && x <= terrainMeta.cropWorldMaxX && z >= terrainMeta.cropWorldMinZ && z <= terrainMeta.cropWorldMaxZ;
const overworldX = (x: number) => (x - terrainMeta.cropWorldMinX) / (terrainMeta.cropWorldMaxX - terrainMeta.cropWorldMinX) * (OVERWORLD_WIDTH - 1);
const overworldY = (z: number) => (terrainMeta.cropWorldMaxZ - z) / (terrainMeta.cropWorldMaxZ - terrainMeta.cropWorldMinZ) * (OVERWORLD_HEIGHT - 1);
const placeDistance = (marker: MapMarker, place: DisplayPlace) => Math.hypot(marker.x - place.x, marker.z - place.z);

function placeLabelLayout(places: DisplayPlace[], locale: Locale) {
  const occupied: Array<{ x: number; y: number; w: number; h: number }> = [];
  const offsets = [[10, -27], [10, 10], [-10, -27], [-10, 10], [16, -8], [-16, -8]];
  return places.map((place) => {
    const anchorX = overworldX(place.x), anchorY = overworldY(place.z);
    const text = place.name[locale];
    const w = Math.max(82, text.length * 8.2 + 18), h = 27;
    let result = { x: anchorX + 10, y: anchorY - 27, w, h };
    for (const [dx, dy] of offsets) {
      const x = dx < 0 ? anchorX + dx - w : anchorX + dx;
      const y = anchorY + dy;
      const candidate = { x: Math.max(2, Math.min(OVERWORLD_WIDTH - w - 2, x)), y: Math.max(2, Math.min(OVERWORLD_HEIGHT - h - 2, y)), w, h };
      if (!occupied.some((box) => candidate.x < box.x + box.w + 4 && candidate.x + candidate.w + 4 > box.x && candidate.y < box.y + box.h + 4 && candidate.y + candidate.h + 4 > box.y)) { result = candidate; break; }
    }
    occupied.push(result);
    return { place, anchorX, anchorY, ...result };
  });
}

export function InteractiveMap({ markers, locale, lockedCategory }: { markers: MapMarker[]; locale: Locale; lockedCategory?: MapCategorySlug }) {
  const de = locale === "de";
  const [layer, setLayer] = useState<"overworld" | "dungeon">("overworld");
  const [selected, setSelected] = useState<SelectedItem | null>(null);
  const [enabled, setEnabled] = useState<MapCategorySlug[]>(lockedCategory ? [lockedCategory] : defaultCategories);
  const [showPlaces, setShowPlaces] = useState(true);
  const [zoom, setZoom] = useState(1);
  const mapScrollRef = useRef<HTMLDivElement>(null);
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const pinch = useRef<{ distance: number; zoom: number; anchorX: number; anchorY: number } | null>(null);
  const categories = lockedCategory ? [lockedCategory] : mapCategorySlugs;
  const bounds = mapBounds.dungeon;
  const dungeonHeight = DUNGEON_WIDTH * ((bounds.maxZ - bounds.minZ) / (bounds.maxX - bounds.minX));
  const canvasWidth = layer === "overworld" ? OVERWORLD_WIDTH : DUNGEON_WIDTH;
  const canvasHeight = layer === "overworld" ? OVERWORLD_HEIGHT : dungeonHeight;

  useEffect(() => {
    if (!lockedCategory && window.matchMedia("(max-width: 720px)").matches) setEnabled((current) => current.filter((category) => category !== "trees-birch"));
  }, [lockedCategory]);

  const filtered = useMemo(() => markers.filter((marker) => marker.layer === layer && enabled.includes(markerCategory(marker) as MapCategorySlug)), [markers, layer, enabled]);
  const visible = useMemo(() => filtered.filter((marker) => layer !== "overworld" || inTerrainBounds(marker)), [filtered, layer]);
  const outsideMarkers = useMemo(() => filtered.filter((marker) => layer === "overworld" && !inTerrainBounds(marker)), [filtered, layer]);
  const places = useMemo(() => [...mappedPlaceNames as DisplayPlace[], homeSweetHome].filter(inTerrainBounds), []);
  const placeLabels = useMemo(() => placeLabelLayout(places, locale), [places, locale]);
  const toggle = (category: MapCategorySlug) => setEnabled((current) => current.includes(category) ? current.filter((item) => item !== category) : [...current, category]);
  const projectX = (x: number) => layer === "overworld" ? overworldX(x) : PAD + ((x - bounds.minX) / (bounds.maxX - bounds.minX)) * (DUNGEON_WIDTH - PAD * 2);
  const projectY = (z: number) => layer === "overworld" ? overworldY(z) : PAD + ((z - bounds.minZ) / (bounds.maxZ - bounds.minZ)) * (dungeonHeight - PAD * 2);
  const officialPlaceFor = (marker: MapMarker) => marker.type === "landmark" ? places.find((place) => placeDistance(marker, place) < 15) : undefined;
  const displayMarkerName = (marker: MapMarker) => { const official = officialPlaceFor(marker); return official ? `${official.name[locale]} · ${markerName(marker, locale)}` : markerName(marker, locale); };
  const selectMarker = (marker: MapMarker) => setSelected({ name: displayMarkerName(marker), x: marker.x, y: marker.y, z: marker.z, elevation: marker.elevationRelativeToCamp });

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    const element = mapScrollRef.current;
    if (!element) return;
    element.setPointerCapture(event.pointerId);
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      const rect = element.getBoundingClientRect();
      const centerX = (a.x + b.x) / 2 - rect.left;
      const centerY = (a.y + b.y) / 2 - rect.top;
      pinch.current = { distance: Math.hypot(a.x - b.x, a.y - b.y), zoom, anchorX: (element.scrollLeft + centerX) / element.scrollWidth, anchorY: (element.scrollTop + centerY) / element.scrollHeight };
    }
  };
  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const element = mapScrollRef.current;
    const previous = pointers.current.get(event.pointerId);
    if (!element || !previous) return;
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (pointers.current.size === 1) {
      element.scrollLeft -= event.clientX - previous.x;
      element.scrollTop -= event.clientY - previous.y;
      return;
    }
    if (pointers.current.size === 2 && pinch.current) {
      const [a, b] = [...pointers.current.values()];
      const nextZoom = Math.max(1, Math.min(3, pinch.current.zoom * Math.hypot(a.x - b.x, a.y - b.y) / pinch.current.distance));
      const rect = element.getBoundingClientRect();
      const centerX = (a.x + b.x) / 2 - rect.left;
      const centerY = (a.y + b.y) / 2 - rect.top;
      const anchor = pinch.current;
      setZoom(nextZoom);
      requestAnimationFrame(() => {
        element.scrollLeft = anchor.anchorX * element.scrollWidth - centerX;
        element.scrollTop = anchor.anchorY * element.scrollHeight - centerY;
      });
    }
  };
  const onPointerEnd = (event: ReactPointerEvent<HTMLDivElement>) => {
    pointers.current.delete(event.pointerId);
    if (pointers.current.size < 2) pinch.current = null;
  };

  return <section className="map-tool" aria-label={de ? "Interaktive Karte" : "Interactive map"}>
    <div className="map-toolbar">
      <div className="map-tabs" role="tablist" aria-label={de ? "Kartenebene" : "Map layer"}>{(["overworld", "dungeon"] as const).map((item) => <button key={item} type="button" role="tab" aria-selected={layer === item} className={layer === item ? "active" : ""} onClick={() => { setLayer(item); setSelected(null); setZoom(1); }}>{item === "overworld" ? (de ? "Oberwelt" : "Overworld") : "Dungeon"}</button>)}</div>
      <div className="map-zoom" aria-label={de ? "Kartenzoom" : "Map zoom"}><button type="button" disabled={zoom <= 1} onClick={() => setZoom((value) => Math.max(1, value - .5))} aria-label={de ? "Verkleinern" : "Zoom out"}>−</button><span>{zoom.toFixed(1)}×</span><button type="button" disabled={zoom >= 3} onClick={() => setZoom((value) => Math.min(3, value + .5))} aria-label={de ? "Vergrößern" : "Zoom in"}>+</button></div>
      {!lockedCategory && <details className="map-filter-mobile"><summary>{de ? "Karteninhalte" : "Map contents"} ({enabled.length + (showPlaces ? 1 : 0)})</summary><FilterList categories={categories} enabled={enabled} locale={locale} showPlaces={showPlaces} onToggle={toggle} onTogglePlaces={() => setShowPlaces((value) => !value)}/></details>}
    </div>
    {!lockedCategory && <div className="map-filter-desktop"><FilterList categories={categories} enabled={enabled} locale={locale} showPlaces={showPlaces} onToggle={toggle} onTogglePlaces={() => setShowPlaces((value) => !value)}/></div>}
    <div ref={mapScrollRef} className="map-scroll" style={{ touchAction: "none" }} tabIndex={0} aria-label={de ? "Zoombare und verschiebbare Karte" : "Zoomable, pannable map"} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerEnd} onPointerCancel={onPointerEnd}>
      <svg className="world-map-svg" style={{ width: `${zoom * 100}%`, minWidth: `${760 * zoom}px` }} viewBox={`0 0 ${canvasWidth} ${canvasHeight}`} role="img" aria-label={`${layer === "overworld" ? (de ? "Oberwelt" : "Overworld") : "Dungeon"}: ${visible.length} ${de ? "sichtbare Marker" : "visible markers"}`}>
        <defs><pattern id={`map-grid-${layer}`} width="44" height="44" patternUnits="userSpaceOnUse"><path d="M 44 0 L 0 0 0 44" fill="none" stroke="#ffffff14" strokeWidth="1"/></pattern></defs>
        <rect width={canvasWidth} height={canvasHeight} fill="#0c1b15"/>
        {layer === "overworld" ? <image href="/images/terrain-overworld.webp" x="0" y="0" width="1024" height="727" preserveAspectRatio="none"/> : <rect width={canvasWidth} height={canvasHeight} fill={`url(#map-grid-${layer})`}/>} 
        {visible.map((marker) => {
          const category = markerCategory(marker)!;
          const x = projectX(marker.x), y = projectY(marker.z);
          const officialPlace = officialPlaceFor(marker);
          return <g key={marker.id} className={`map-marker ${category}`} tabIndex={0} role="button" aria-label={displayMarkerName(marker)} onMouseEnter={() => selectMarker(marker)} onFocus={() => selectMarker(marker)} onClick={() => selectMarker(marker)}>
            <MarkerIcon marker={marker} x={x} y={y} zoom={zoom} selected={selected?.name === displayMarkerName(marker)}/>
            {category === "landmarks" && !(showPlaces && officialPlace) && <text className="landmark-label" x={x + 12} y={y + 4}>{markerName(marker, locale)}</text>}
          </g>;
        })}
        {layer === "overworld" && showPlaces && placeLabels.map(({ place, anchorX, anchorY, x, y, w, h }) => <g key={place.id} className="place-label" tabIndex={0} role="button" onClick={() => setSelected({ name: place.name[locale], x: place.x, y: place.y, z: place.z, elevation: place.y - 100 })}>
          <path d={`M${anchorX},${anchorY} L${Math.max(x, Math.min(x + w, anchorX))},${Math.max(y, Math.min(y + h, anchorY))}`} />
          <rect x={x} y={y} width={w} height={h} rx="6"/><text x={x + 9} y={y + 18}>{place.name[locale]}</text>
        </g>)}
        {layer === "overworld" && <g className="map-scale" transform={`translate(38 ${OVERWORLD_HEIGHT - 35})`}><path d="M0 0V8M0 4H102.3M102.3 0V8"/><text x="51.15" y="-6" textAnchor="middle">50 m</text></g>}
      </svg>
    </div>
    <MapLegend locale={locale}/>
    <div className="map-readout" aria-live="polite">{selected ? <><strong>{selected.name}</strong><span>X {selected.x.toFixed(2)} · Y {selected.y.toFixed(2)} · Z {selected.z.toFixed(2)}</span><span>{selected.elevation >= 0 ? "+" : ""}{selected.elevation.toFixed(2)} m {de ? "relativ zum Camp" : "relative to camp"}</span></> : <span>{de ? "Marker oder Ortsnamen auswählen, um Details zu sehen." : "Hover, click, or focus a marker or place name to see details."}</span>}</div>
    {layer === "overworld" && <OutsideBounds locale={locale} markers={outsideMarkers}/>} 
  </section>;
}

function MarkerIcon({ marker, x, y, zoom, selected }: { marker: MapMarker; x: number; y: number; zoom: number; selected: boolean }) {
  const category = markerCategory(marker)!;
  const outline = elevationColor(marker.elevationRelativeToCamp);
  const treeScale = .58 + (zoom - 1) * .21;
  const common = { transform: `translate(${x} ${y})`, className: selected ? "marker-icon selected" : "marker-icon", style: { "--marker-outline": outline } as React.CSSProperties };
  if (marker.type === "tree") return <g {...common}><g transform={`scale(${treeScale})`}><path d={treePath} fill="none" stroke="#0c1b15" strokeWidth="4.5"/><path fill={treeColors[marker.subtype ?? ""] ?? "#8fb66a"} stroke={outline} strokeWidth="1.5" d={treePath}/></g></g>;
  if (marker.type === "rubberDuck") return <g {...common}><path d="M-9 3c2-5 6-6 9-4-1-5 5-8 8-4 2 3-1 5-3 6 4 1 7 4 6 8H-6c-3 0-5-3-3-6zM8-4l5 2-5 1z"/></g>;
  if (marker.type === "blueprint") return <g {...common}><path d="M-8-9h14a4 4 0 0 1 0 8H-4v10h12M-8-9a4 4 0 0 0 0 8h4" fill="none"/><path d="M-4 2h8M-4 6h6" fill="none"/></g>;
  if (marker.type === "teleporter") return <g {...common} opacity={marker.status === "broken" ? .65 : 1}><circle r="9" fill="none"/><path d="M-4-1 0-6 4-1 0 6z"/>{marker.status === "broken" && <path className="broken-mark" d="M-8-8 8 8M8-8-8 8"/>}</g>;
  if (marker.type === "landmark") return <g {...common}><LandmarkIcon subtype={marker.subtype}/></g>;
  return <g {...common}><path d="M0-10C7-10 10-4 8 2L0 11-8 2C-10-4-7-10 0-10z"/></g>;
}

function LandmarkIcon({ subtype }: { subtype?: string }) {
  if (subtype === "tent") return <path d="M-11 9 0-10 11 9H3L0 2-3 9z"/>;
  if (subtype === "old-windmill") return <><path d="M-4 10-2-3h4l2 13z"/><path d="M0-3V-12M0-3 9-7M0-3 8 3M0-3-8 3M0-3-9-7" fill="none"/></>;
  if (subtype === "cave-bridge") return <><path d="M-11 5h22v5H-11z"/><path d="M-8 5C-5-5 5-5 8 5" fill="none"/></>;
  if (subtype === "void-gate") return <><path d="M-8 10V-2a8 8 0 0 1 16 0v12" fill="none"/><circle r="4"/></>;
  if (subtype === "drone-platform") return <><circle r="5"/><path d="M-11-7h5M6-7h5M-11 7h5M6 7h5M-8-9v4M8-9v4M-8 5v4M8 5v4" fill="none"/></>;
  return <path d="M0-11 3-4 11-3 5 2 7 10 0 6-7 10-5 2-11-3-3-4z"/>;
}

function FilterList({ categories, enabled, locale, showPlaces, onToggle, onTogglePlaces }: { categories: readonly MapCategorySlug[]; enabled: MapCategorySlug[]; locale: Locale; showPlaces: boolean; onToggle: (category: MapCategorySlug) => void; onTogglePlaces: () => void }) {
  return <div className="map-filters"><label><input type="checkbox" checked={showPlaces} onChange={onTogglePlaces}/><span>{locale === "de" ? "Ortsnamen" : "Place names"}</span></label>{categories.map((category) => <label key={category}><input type="checkbox" checked={enabled.includes(category)} onChange={() => onToggle(category)}/><span>{categoryLabel(category, locale, false)}</span></label>)}</div>;
}

function MapLegend({ locale }: { locale: Locale }) {
  const de = locale === "de";
  const treeCategories = mapCategorySlugs.filter((category) => category.startsWith("trees-"));
  const symbolCategories = mapCategorySlugs.filter((category) => !category.startsWith("trees-"));
  return <details className="map-symbol-legend"><summary>{de ? "Legende" : "Legend"}</summary><div className="map-legend-content"><div><strong>{de ? "Baumfarben" : "Tree colors"}</strong>{treeCategories.map((category) => <span key={category}><i style={{ background: treeColors[category.slice(6)] }}/>{categoryLabel(category, locale, false)} ({categoryCounts[category]})</span>)}</div><div><strong>{de ? "Höhe der Marker" : "Marker elevation"}</strong><span>{de ? "Kühl: unter dem Camp" : "Cool: below camp"}</span><div className="elevation-scale"/><span>{de ? "Warm: über dem Camp" : "Warm: above camp"}</span><span>{de ? "Der farbige Rand zeigt die relative Höhe." : "The colored outline shows relative elevation."}</span></div><div><strong>{de ? "Symbole" : "Symbols"}</strong>{symbolCategories.map((category) => <span key={category}>{categoryLabel(category, locale, false)} ({categoryCounts[category]})</span>)}<span>{de ? "Ortsnamen: große beschriftete Felder" : "Place names: large labeled boxes"}</span><span>{de ? "Durchgestrichener Teleporter: defekt" : "Crossed teleporter: broken"}</span></div></div></details>;
}

function OutsideBounds({ locale, markers }: { locale: Locale; markers: MapMarker[] }) {
  const de = locale === "de";
  return <details className="outside-bounds"><summary>{de ? "Außerhalb des Kartenausschnitts" : "Outside map bounds"} ({markers.length + 1})</summary><ul>{markers.map((marker) => <li key={marker.id}><strong>{markerName(marker, locale)}</strong> — X {marker.x.toFixed(2)}, Y {marker.y.toFixed(2)}, Z {marker.z.toFixed(2)}</li>)}<li><strong>{furnoxOutside.name[locale]}</strong> — X {furnoxOutside.x.toFixed(2)}, Y {furnoxOutside.y.toFixed(2)}, Z {furnoxOutside.z.toFixed(2)}</li></ul></details>;
}
