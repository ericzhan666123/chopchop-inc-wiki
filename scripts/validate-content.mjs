import fs from "node:fs";import path from "node:path";import process from "node:process";
const dir=path.resolve("content/en");const read=n=>JSON.parse(fs.readFileSync(path.join(dir,n),"utf8"));const recipes=read("recipes.json"),items=read("items.json");const errors=[];const itemIds=new Set(items.map(i=>i.id));
const codePoints=s=>[...s].length;
for(const [type,rows,nameKey] of [["recipe",recipes,"displayName"],["item",items,"name"]])for(const row of rows)for(const locale of ["en","de"]){const title=row[nameKey]?.[locale];if(title&&codePoints(title)>60)errors.push(`${type} ${row.id} ${locale} title is ${codePoints(title)} code points (max 60)`);const description=row.description?.[locale];if(description&&codePoints(description)>320)errors.push(`${type} ${row.id} ${locale} description is ${codePoints(description)} code points (max 320)`)}
for(const recipe of recipes)for(const ref of recipe.inputs)if(ref.itemId&&!itemIds.has(ref.itemId))errors.push(`recipe ${recipe.id} input references missing itemId ${ref.itemId}`);
const nonItemOutputs=recipes.flatMap(r=>r.outputs).filter(ref=>ref.itemId&&!itemIds.has(ref.itemId));
const excludedRecipePageIds=new Set(["Furniture_Beehouse","WeightBench"]);
const visible=recipes.filter(r=>r.displayName!==null&&r.displayInRecipeBook!==false&&!excludedRecipePageIds.has(r.id));if(visible.length!==132)errors.push(`expected 132 visible recipes after explicit source-data exclusions, found ${visible.length}`);
if(errors.length){console.error(errors.join("\n"));process.exit(1)}console.log(`Content valid: ${items.length} items, ${recipes.length} recipes, ${visible.length} visible recipe pages; ${nonItemOutputs.length} non-item action/prefab outputs preserved.`);
