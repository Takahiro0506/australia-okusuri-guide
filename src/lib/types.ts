/** トップレベル(親)の症状カテゴリ。アイコンのローカルマッピングに使う。 */
export type ParentCategorySlug =
  | "cold"
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

/**
 * fixed は選択式ステップには表示せず、カード生成時に選択状態と無関係に
 * 常に末尾へ追加する特殊な種別。他の3種類とは buildConsultText 内での
 * 扱いが異なる。
 */
export type ClauseType = "symptom" | "duration" | "context" | "fixed";

export interface PhraseClause {
  id: string;
  clause_type: ClauseType;
  /** 親カテゴリのslug。null は全カテゴリ共通(duration/context/fixedで使用)。 */
  applies_to_category: ParentCategorySlug | null;
  label_ja: string;
  text_en: string;
  sort_order: number;
  is_active: boolean;
  last_reviewed_date: string | null;
  created_at: string;
}
