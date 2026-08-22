import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { buildConsultText } from "./buildConsultText";
import type { ClauseType, PhraseClause } from "./types";

// supabase/phrase_clauses_seed.csv の実データでの検証。
// text_en に "," を含む行が1件あるため(fixed の双方向化クロージング文)、
// 引用符対応の最小限のCSVパーサーを用意する。
function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let field = "";
  let row: string[] = [];
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];

    if (inQuotes) {
      if (char === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += char;
      }
      continue;
    }

    if (char === '"') {
      inQuotes = true;
    } else if (char === ",") {
      row.push(field);
      field = "";
    } else if (char === "\n") {
      row.push(field);
      rows.push(row);
      field = "";
      row = [];
    } else if (char === "\r") {
      continue;
    } else {
      field += char;
    }
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  return rows.filter((r) => r.length > 1 || r[0] !== "");
}

function loadSeedClauses(): PhraseClause[] {
  const csvPath = path.resolve(
    import.meta.dirname,
    "../../supabase/phrase_clauses_seed.csv"
  );
  const text = readFileSync(csvPath, "utf-8");
  const [header, ...rows] = parseCsv(text);

  return rows.map((row, index) => {
    const record = Object.fromEntries(
      header.map((column, i) => [column, row[i]])
    );

    return {
      id: `seed-${index}`,
      clause_type: record.clause_type as ClauseType,
      applies_to_category: record.applies_to_category || null,
      label_ja: record.label_ja,
      text_en: record.text_en,
      sort_order: Number(record.sort_order),
      is_active: record.is_active === "true",
      last_reviewed_date: record.last_reviewed_date || null,
      created_at: "2026-01-01T00:00:00Z",
    };
  });
}

describe("buildConsultText (実データ: supabase/phrase_clauses_seed.csv)", () => {
  const seedClauses = loadSeedClauses();

  it("読み込んだ内訳がSupabase投入結果(symptom40/context12/duration5/fixed2)と一致する", () => {
    const countBy = (type: ClauseType) =>
      seedClauses.filter((c) => c.clause_type === type).length;

    expect(seedClauses).toHaveLength(59);
    expect(countBy("symptom")).toBe(40);
    expect(countBy("context")).toBe(12);
    expect(countBy("duration")).toBe(5);
    expect(countBy("fixed")).toBe(2);
  });

  it("cold症状を全選択+duration1件+context2件で件数・カテゴリ混入・末尾fixedを確認する", () => {
    const coldSymptomIds = seedClauses
      .filter((c) => c.clause_type === "symptom" && c.applies_to_category === "cold")
      .map((c) => c.id);
    expect(coldSymptomIds).toHaveLength(9);

    const durationId = seedClauses.find((c) => c.clause_type === "duration")!.id;
    const contextIds = seedClauses
      .filter((c) => c.clause_type === "context")
      .slice(0, 2)
      .map((c) => c.id);

    const selectedIds = new Set([...coldSymptomIds, durationId, ...contextIds]);
    const result = buildConsultText(seedClauses, selectedIds);

    // cold症状9 + duration1 + context2 + fixed2 = 14
    expect(result.en).toHaveLength(14);

    // cold以外の症状のtext_enが1件も混入していないこと
    const otherCategorySymptomTexts = seedClauses
      .filter(
        (c) => c.clause_type === "symptom" && c.applies_to_category !== "cold"
      )
      .map((c) => c.text_en);
    for (const text of otherCategorySymptomTexts) {
      expect(result.en).not.toContain(text);
    }

    // 末尾2件はfixedの2文(sort_order昇順)
    expect(result.en.slice(-2)).toEqual([
      "Could you recommend something suitable?",
      "I'm not confident in English. Could you please write down your answer, or show me the product?",
    ]);
  });
});
