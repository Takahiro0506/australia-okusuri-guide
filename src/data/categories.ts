import type { SymptomCategory } from "@/lib/types";

// supabase/schema.sql の symptom_categories INSERT文を静的化したもの。
// id は元々uuidだったが、parent_slug が既に slug文字列で親を参照する設計のため、
// id もそのまま slug と同じ値にして参照を単純化している。
export const symptomCategories: SymptomCategory[] = [
  { id: "cold", slug: "cold", parent_slug: null, name_ja: "風邪の症状", sort_order: 1 },
  { id: "stomach", slug: "stomach", parent_slug: null, name_ja: "お腹の不調", sort_order: 2 },
  { id: "head_fever", slug: "head_fever", parent_slug: null, name_ja: "頭痛・発熱", sort_order: 3 },
  { id: "allergy", slug: "allergy", parent_slug: null, name_ja: "アレルギー・花粉症", sort_order: 4 },
  { id: "skin", slug: "skin", parent_slug: null, name_ja: "擦り傷・虫刺され・日焼け", sort_order: 5 },

  { id: "cold_combined", slug: "cold_combined", parent_slug: "cold", name_ja: "風邪(複合症状)", sort_order: 1 },
  { id: "cold_throat", slug: "cold_throat", parent_slug: "cold", name_ja: "喉の痛み", sort_order: 2 },
  { id: "cold_cough", slug: "cold_cough", parent_slug: "cold", name_ja: "咳", sort_order: 3 },

  { id: "skin_scratch", slug: "skin_scratch", parent_slug: "skin", name_ja: "擦り傷", sort_order: 1 },
  { id: "skin_insect_bite", slug: "skin_insect_bite", parent_slug: "skin", name_ja: "虫刺され", sort_order: 2 },
  { id: "skin_sunburn", slug: "skin_sunburn", parent_slug: "skin", name_ja: "日焼け", sort_order: 3 },
];
