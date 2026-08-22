/** トップレベル(親)の症状カテゴリ。アイコンのローカルマッピングに使う。 */
export type ParentCategorySlug =
  | "throat"
  | "stomach"
  | "head_fever"
  | "allergy"
  | "skin";

export interface SymptomCategory {
  id: string;
  slug: string;
  /** 親カテゴリは null、子カテゴリは親の slug。 */
  parent_slug: string | null;
  name_ja: string;
  sort_order: number;
}

export interface Product {
  id: string;
  category_id: string;
  /** 店頭の実物表記(英語のみ)。店員さんに見せる画面で使用する。 */
  brand_name_en: string;
  /** 日本語の説明。店員さんに見せる画面では表示しない。 */
  description_ja: string | null;
  active_ingredient: string | null;
  caution_flags: string[] | null;
  state_note: string | null;
  last_reviewed_date: string;
  source_note: string | null;
  is_active: boolean;
  created_at: string;
}
