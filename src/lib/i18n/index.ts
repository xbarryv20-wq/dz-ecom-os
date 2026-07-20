import { ar } from "./ar";
import { en } from "./en";
import type { Language, Translations } from "./types";

const translations: Record<Language, Translations> = { ar, en };

export function getTranslations(lang: Language): Translations {
  return translations[lang];
}
