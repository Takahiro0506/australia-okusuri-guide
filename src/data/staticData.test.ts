import { describe, expect, it } from "vitest";
import { symptomCategories } from "./categories";
import { products } from "./products";
import { phraseClauses } from "./phraseClauses";
import type { ClauseType } from "@/lib/types";

// 静的化により失われたSupabase側のCHECK制約・外部キー制約・UNIQUE制約を
// このファイルで肩代わりする(docs/schema/check_constraints_2026-09-02.md 参照)。
// products.brand_name_en / active_ingredient にはDB制約が元々無く、
// 過去3回の日本語混入バグはこの2列で発生しているため、ここが最重要の検証。
const ASCII_ONLY = /^[\x20-\x7E]+$/;

const categoryIds = new Set(symptomCategories.map((c) => c.id));
const categorySlugs = new Set(symptomCategories.map((c) => c.slug));
const parentSlugsWithChildren = new Set(
  symptomCategories
    .map((c) => c.parent_slug)
    .filter((slug): slug is string => slug !== null)
);

describe("ASCII検証(brand_name_en / active_ingredient / text_en への日本語混入防止)", () => {
  it.each(products.map((p) => [p.brand_name_en, p] as const))(
    "products.brand_name_en が印字可能ASCIIのみ: %s",
    (_label, product) => {
      expect(product.brand_name_en).toMatch(ASCII_ONLY);
    }
  );

  it.each(
    products
      .filter((p) => p.active_ingredient !== null)
      .map((p) => [p.brand_name_en, p] as const)
  )("products.active_ingredient が印字可能ASCIIのみ: %s", (_label, product) => {
    expect(product.active_ingredient).toMatch(ASCII_ONLY);
  });

  it.each(phraseClauses.map((c) => [c.id, c] as const))(
    "phrase_clauses.text_en が印字可能ASCIIのみ: %s",
    (_label, clause) => {
      expect(clause.text_en).toMatch(ASCII_ONLY);
    }
  );
});

describe("参照整合性", () => {
  it("products.category_id はすべて categories.id に存在する", () => {
    const orphans = products.filter((p) => !categoryIds.has(p.category_id));
    expect(orphans.map((p) => p.brand_name_en)).toEqual([]);
  });

  it("categories.parent_slug は null か categories.slug のいずれかに存在する", () => {
    const orphans = symptomCategories.filter(
      (c) => c.parent_slug !== null && !categorySlugs.has(c.parent_slug)
    );
    expect(orphans.map((c) => c.slug)).toEqual([]);
  });
});

describe("値の集合", () => {
  // clause_type は ClauseType 型、applies_to_category は ParentCategorySlug | null 型で
  // コンパイル時にも縛っているが、キャストで型を迂回されても検出できるよう実行時にも確認する。
  const validClauseTypes: ClauseType[] = ["symptom", "duration", "context", "fixed"];
  const validParentSlugs = ["cold", "stomach", "head_fever", "allergy", "skin"];

  it("phrase_clauses.clause_type は symptom/duration/context/fixed のいずれか", () => {
    const invalid = phraseClauses.filter(
      (c) => !validClauseTypes.includes(c.clause_type)
    );
    expect(invalid.map((c) => c.id)).toEqual([]);
  });

  it("phrase_clauses.applies_to_category は null か5つの親カテゴリslugのいずれか", () => {
    const invalid = phraseClauses.filter(
      (c) =>
        c.applies_to_category !== null &&
        !validParentSlugs.includes(c.applies_to_category)
    );
    expect(invalid.map((c) => c.id)).toEqual([]);
  });
});

describe("構造上の不変条件", () => {
  it("子カテゴリを持つカテゴリ(cold・skin)には商品が直接紐づいていない", () => {
    const directlyLinked = products.filter((p) => {
      const category = symptomCategories.find((c) => c.id === p.category_id);
      return category !== undefined && parentSlugsWithChildren.has(category.slug);
    });
    expect(directlyLinked.map((p) => p.brand_name_en)).toEqual([]);
  });

  it("葉カテゴリ(子を持たないカテゴリ)はすべて商品を1件以上持つ", () => {
    const leafCategories = symptomCategories.filter(
      (c) => !parentSlugsWithChildren.has(c.slug)
    );
    const emptyLeaves = leafCategories.filter(
      (c) => !products.some((p) => p.category_id === c.id)
    );
    expect(emptyLeaves.map((c) => c.slug)).toEqual([]);
  });

  it("categories.slug は一意である", () => {
    const slugs = symptomCategories.map((c) => c.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});

describe("運用ルールの機械化", () => {
  it("is_active な商品は last_reviewed_date が空でない", () => {
    const missingReview = products.filter(
      (p) => p.is_active && !p.last_reviewed_date
    );
    expect(missingReview.map((p) => p.brand_name_en)).toEqual([]);
  });
});

describe("件数(本番Supabase 2026-09-02時点の実データと一致すること)", () => {
  it("products は30件", () => {
    expect(products).toHaveLength(30);
  });

  it("symptom_categories は11件", () => {
    expect(symptomCategories).toHaveLength(11);
  });

  it("phrase_clauses は59件、内訳は symptom40/duration5/context12/fixed2", () => {
    expect(phraseClauses).toHaveLength(59);

    const countBy = (type: ClauseType) =>
      phraseClauses.filter((c) => c.clause_type === type).length;

    expect(countBy("symptom")).toBe(40);
    expect(countBy("duration")).toBe(5);
    expect(countBy("context")).toBe(12);
    expect(countBy("fixed")).toBe(2);
  });
});
