import { writable } from "svelte/store"
export type Locale = "de" | "en"

export const locale = writable("en" as Locale)
export const sourceLocale = writable("de" as Locale)
