import { describe, expect, it } from "vitest";
import { buildConsultText } from "./buildConsultText";
import type { PhraseClause } from "./types";

function clause(overrides: Partial<PhraseClause> & { id: string }): PhraseClause {
  return {
    clause_type: "symptom",
    applies_to_category: null,
    label_ja: `label-${overrides.id}`,
    text_en: `text-${overrides.id}`,
    sort_order: 0,
    is_active: true,
    last_reviewed_date: null,
    created_at: "2026-01-01T00:00:00Z",
    ...overrides,
  };
}

// あえて種別・sort_order の順をバラバラにして、並び替えロジックを検証する
const clauses: PhraseClause[] = [
  clause({
    id: "fixed-2",
    clause_type: "fixed",
    sort_order: 20,
    text_en: "I'm not confident in English.",
    label_ja: "(締めの依頼2)",
  }),
  clause({
    id: "symptom-cold-2",
    clause_type: "symptom",
    applies_to_category: "cold",
    sort_order: 20,
    text_en: "I have a dry cough.",
    label_ja: "乾いた咳が出る",
  }),
  clause({
    id: "context-1",
    clause_type: "context",
    sort_order: 10,
    text_en: "I would prefer a non-drowsy medicine.",
    label_ja: "眠くならない薬がいい",
  }),
  clause({
    id: "duration-2",
    clause_type: "duration",
    sort_order: 20,
    text_en: "It started 1 week ago.",
    label_ja: "1週間ほど前から",
  }),
  clause({
    id: "symptom-cold-1",
    clause_type: "symptom",
    applies_to_category: "cold",
    sort_order: 10,
    text_en: "I have a sore throat.",
    label_ja: "喉が痛い",
  }),
  clause({
    id: "duration-1",
    clause_type: "duration",
    sort_order: 10,
    text_en: "It started 2-3 days ago.",
    label_ja: "2〜3日前から",
  }),
  clause({
    id: "fixed-1",
    clause_type: "fixed",
    sort_order: 10,
    text_en: "Could you recommend something suitable?",
    label_ja: "(締めの依頼1)",
  }),
];

describe("buildConsultText", () => {
  it("何も選択していなくても en に fixed の文が必ず含まれる", () => {
    const result = buildConsultText(clauses, new Set());

    expect(result.en).toEqual([
      "Could you recommend something suitable?",
      "I'm not confident in English.",
    ]);
  });

  it("symptom → duration → context → fixed の順序を保つ", () => {
    const selectedIds = new Set([
      "context-1",
      "symptom-cold-1",
      "duration-1",
      "symptom-cold-2",
    ]);

    const result = buildConsultText(clauses, selectedIds);

    expect(result.en).toEqual([
      "I have a sore throat.", // symptom
      "I have a dry cough.", // symptom
      "It started 2-3 days ago.", // duration
      "I would prefer a non-drowsy medicine.", // context
      "Could you recommend something suitable?", // fixed
      "I'm not confident in English.", // fixed
    ]);
  });

  it("同一 clause_type 内では sort_order 昇順になる", () => {
    const selectedIds = new Set(["symptom-cold-2", "symptom-cold-1"]);

    const result = buildConsultText(clauses, selectedIds);

    expect(result.en).toEqual([
      "I have a sore throat.", // sort_order 10
      "I have a dry cough.", // sort_order 20
      "Could you recommend something suitable?",
      "I'm not confident in English.",
    ]);
  });

  it("duration は選択されていても最大1件までしか使わない", () => {
    const selectedIds = new Set(["duration-1", "duration-2"]);

    const result = buildConsultText(clauses, selectedIds);

    const durationLines = result.en.filter((line) => line.includes("started"));
    expect(durationLines).toEqual(["It started 2-3 days ago."]);
  });

  it("ja には fixed を含めない", () => {
    const selectedIds = new Set([
      "symptom-cold-1",
      "duration-1",
      "context-1",
    ]);

    const result = buildConsultText(clauses, selectedIds);

    expect(result.ja).toEqual(["喉が痛い", "2〜3日前から", "眠くならない薬がいい"]);
    expect(result.ja.some((line) => line.includes("締めの依頼"))).toBe(false);
  });

  it("存在しない id が selectedIds に含まれていても例外にならない", () => {
    const selectedIds = new Set(["not-a-real-id", "symptom-cold-1"]);

    expect(() => buildConsultText(clauses, selectedIds)).not.toThrow();

    const result = buildConsultText(clauses, selectedIds);
    expect(result.en).toEqual([
      "I have a sore throat.",
      "Could you recommend something suitable?",
      "I'm not confident in English.",
    ]);
  });
});
