import { symptomCategories } from "@/data/categories";
import { products } from "@/data/products";
import { phraseClauses } from "@/data/phraseClauses";
import type { Product, SymptomCategory, PhraseClause } from "./types";

// 各ページが元々Supabaseに投げていたクエリ(絞り込み・並び替え)を
// 静的データに対して再現するだけの関数群。書き込み・キャッシュ制御は行わない。
//
// 注意: is_active によるフィルタは表示を止めるだけで配信は止めない。
// 静的化後はソースがJSバンドルに含まれるため、is_active: false の行を
// 追加してもその内容はクライアントに配信され、ブラウザの開発者ツール等
// から読める状態になる(SupabaseのRLSのようなサーバー側の遮断はない)。

export function getParentCategories(): SymptomCategory[] {
  return symptomCategories
    .filter((c) => c.parent_slug === null)
    .sort((a, b) => a.sort_order - b.sort_order);
}

export function getParentCategoryBySlug(slug: string): SymptomCategory | null {
  return (
    symptomCategories.find((c) => c.slug === slug && c.parent_slug === null) ??
    null
  );
}

export function getChildCategories(parentSlug: string): SymptomCategory[] {
  return symptomCategories
    .filter((c) => c.parent_slug === parentSlug)
    .sort((a, b) => a.sort_order - b.sort_order);
}

export function getChildCategoryBySlug(
  parentSlug: string,
  childSlug: string
): SymptomCategory | null {
  return (
    symptomCategories.find(
      (c) => c.slug === childSlug && c.parent_slug === parentSlug
    ) ?? null
  );
}

export function getProductsByCategoryId(categoryId: string): Product[] {
  return products
    .filter((p) => p.category_id === categoryId && p.is_active)
    .sort((a, b) => a.brand_name_en.localeCompare(b.brand_name_en));
}

export function getProductById(id: string): Product | null {
  return products.find((p) => p.id === id && p.is_active) ?? null;
}

export function getActivePhraseClauses(): PhraseClause[] {
  return phraseClauses
    .filter((c) => c.is_active)
    .sort((a, b) => a.sort_order - b.sort_order);
}
