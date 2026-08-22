import type { PhraseClause } from "./types";

// sort_order はシード上 clause_type + applies_to_category ごとに 10 から
// 振り直されており、カテゴリを跨ぐと値が重複しうる(例: symptom/cold の
// 1件目も symptom/stomach の1件目も 10)。Array.sort は安定ソートだが、
// 呼び出し元から渡される clauses の並び順(Supabaseの返却順など)に
// 結果が左右されるのを避けるため、id を second key にして常に決定的にする。
const bySortOrder = (a: PhraseClause, b: PhraseClause) =>
  a.sort_order - b.sort_order || a.id.localeCompare(b.id);

/**
 * 選択された phrase_clauses から英文カードと日本語確認文の行配列を組み立てる。
 * 文の結合・語順調整・接続詞の挿入は一切行わず、並び順を決めるだけ。
 *
 * fixed は selectedIds を参照しない。選択状態に関係なく常に末尾へ追加する
 * 特殊な種別(symptom/duration/context とは挙動が異なる)。
 * ja には fixed を含めない。
 */
export function buildConsultText(
  clauses: PhraseClause[],
  selectedIds: Set<string>
): { en: string[]; ja: string[] } {
  const symptoms = clauses
    .filter((c) => c.clause_type === "symptom" && selectedIds.has(c.id))
    .sort(bySortOrder);

  const duration = clauses
    .filter((c) => c.clause_type === "duration" && selectedIds.has(c.id))
    .sort(bySortOrder)
    .slice(0, 1);

  const context = clauses
    .filter((c) => c.clause_type === "context" && selectedIds.has(c.id))
    .sort(bySortOrder);

  const fixed = clauses
    .filter((c) => c.clause_type === "fixed")
    .sort(bySortOrder);

  const selected = [...symptoms, ...duration, ...context];

  return {
    en: [...selected, ...fixed].map((c) => c.text_en),
    ja: selected.map((c) => c.label_ja),
  };
}
