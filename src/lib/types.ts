export type SymptomCategorySlug =
  | "throat"
  | "stomach"
  | "head_fever"
  | "allergy"
  | "skin";

export interface Product {
  id: string;
  category: SymptomCategorySlug;
  /** 店頭の実物表記(英語のみ)。店員さんに見せる画面で使用する。 */
  brand_name_en: string;
  /** 日本語の説明。店員さんに見せる画面では表示しない。 */
  description_ja: string;
  active_ingredient: string;
  caution_tags: string[] | null;
  state_note: string | null;
  last_confirmed_date: string | null;
}
