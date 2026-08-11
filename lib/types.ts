export type Locale = "en" | "de";
export type Localized = Record<Locale, string>;
export type RecipeRef = { itemId: string; name: Localized | null; amount: number | null };
export type Recipe = { id: string; category: string | null; displayName: Localized | null; nameSource: string; craftTime: number; unlockedAtStart: boolean; displayInRecipeBook: boolean; inputs: RecipeRef[]; outputs: RecipeRef[] };
export type Item = { id: string; category: string | null; name: Localized; description: Localized | null; sellValue: number; buyValue: number; isSellable: boolean };
export type Entry = { id: string; name: Localized; description: Localized | null };
