# 制約一覧(Supabase本番からの記録)

取得日: 2026-09-02
静的化に伴い、これらの制約はDBから失われます。
対応する検証は src/data/ を対象としたテストへ移行済み。

| table_name         | conname                                  | definition                                                                                                                                                                         |
| ------------------ | ---------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| phrase_clauses     | phrase_clauses_clause_type_check         | CHECK ((clause_type = ANY (ARRAY['symptom'::text, 'duration'::text, 'context'::text, 'fixed'::text])))                                                                             |
| phrase_clauses     | phrase_clauses_text_en_check             | CHECK ((text_en ~ '^[\x20-\x7E]+$'::text))                                                                                                                                         |
| phrase_clauses     | phrase_clauses_applies_to_category_check | CHECK (((applies_to_category IS NULL) OR (applies_to_category = ANY (ARRAY['cold'::text, 'stomach'::text, 'head_fever'::text, 'allergy'::text, 'skin'::text]))))                   |
| products           | products_category_id_fkey                | FOREIGN KEY (category_id) REFERENCES symptom_categories(id)                                                                                                                        |
| symptom_categories | symptom_categories_slug_check            | CHECK ((slug = ANY (ARRAY['cold', 'cold_combined', 'cold_throat', 'cold_cough', 'stomach', 'head_fever', 'allergy', 'skin', 'skin_scratch', 'skin_insect_bite', 'skin_sunburn']))) |
| symptom_categories | symptom_categories_parent_slug_fkey      | FOREIGN KEY (parent_slug) REFERENCES symptom_categories(slug)                                                                                                                      |
| symptom_categories | symptom_categories_slug_key              | UNIQUE (slug)                                                                                                                                                                      |

## 注記

- products.brand_name_en と active_ingredient にはDB制約が無かった。
  過去3回の日本語混入バグはこの2列で発生している。
  静的化に際してテスト側で新たに検証を追加する。
- symptom_categories_slug_check は静的化に持ち込まない。
  カテゴリ追加のたびに書き換えが必要になるため、TypeScript の union 型で表現する。
