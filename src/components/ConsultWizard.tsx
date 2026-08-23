"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Disclaimer } from "@/components/Disclaimer";
import { getCategoryIcon } from "@/lib/categories";
import { buildConsultText } from "@/lib/buildConsultText";
import { ChevronLeftIcon, MedicalBagIcon } from "@/components/icons";
import type { PhraseClause, SymptomCategory } from "@/lib/types";

// 0-3: カテゴリ→症状→期間→状況の選択導線
// "preview": buildConsultText の結果をカードとして確認する画面
// "fullscreen": 日本語を一切出さず、英文のみを店員さんに見せる画面
//   (products/[id]/show と同じ見せ方。ルートは分けず、この1コンポーネント内の
//   state切り替えだけで表示する)
type Step = 0 | 1 | 2 | 3 | "preview" | "fullscreen";

const bySortOrder = (a: PhraseClause, b: PhraseClause) => a.sort_order - b.sort_order;

export function ConsultWizard({
  parentCategories,
  clauses,
}: {
  parentCategories: SymptomCategory[];
  clauses: PhraseClause[];
}) {
  const [step, setStep] = useState<Step>(0);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedClauseIds, setSelectedClauseIds] = useState<Set<string>>(
    new Set()
  );

  const symptomClauses = useMemo(
    () =>
      clauses
        .filter(
          (c) =>
            c.clause_type === "symptom" &&
            (c.applies_to_category === selectedCategory ||
              c.applies_to_category === null)
        )
        .sort(bySortOrder),
    [clauses, selectedCategory]
  );

  const durationClauses = useMemo(
    () => clauses.filter((c) => c.clause_type === "duration").sort(bySortOrder),
    [clauses]
  );

  const contextClauses = useMemo(
    () => clauses.filter((c) => c.clause_type === "context").sort(bySortOrder),
    [clauses]
  );

  const consultText = useMemo(
    () => buildConsultText(clauses, selectedClauseIds),
    [clauses, selectedClauseIds]
  );

  // consultText.ja は fixed を含まないため、その件数を境目にすれば
  // en配列を「選択内容から組み立てた本文」と「fixedの締めの文」に分けられる。
  const mainLines = consultText.en.slice(0, consultText.ja.length);
  const fixedLines = consultText.en.slice(consultText.ja.length);
  const [primaryFixedLine, ...noteFixedLines] = fixedLines;

  function toggleClause(id: string) {
    setSelectedClauseIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function selectSingleClause(id: string, group: PhraseClause[]) {
    setSelectedClauseIds((prev) => {
      const next = new Set(prev);
      for (const c of group) {
        next.delete(c.id);
      }
      next.add(id);
      return next;
    });
  }

  function handleSelectCategory(slug: string) {
    // 症状の選択は選んだカテゴリに紐づくため、カテゴリを変更したら
    // 旧カテゴリ専用のsymptom選択だけ破棄する
    // (全カテゴリ共通のnull categoryのsymptomやduration/contextは維持する)。
    // 同じカテゴリを選び直した場合は何も破棄しない。
    setSelectedClauseIds((prev) => {
      const next = new Set(prev);
      for (const c of clauses) {
        if (
          c.clause_type === "symptom" &&
          c.applies_to_category !== null &&
          c.applies_to_category !== slug
        ) {
          next.delete(c.id);
        }
      }
      return next;
    });
    setSelectedCategory(slug);
  }

  function goBack() {
    if (step === 1) setStep(0);
    else if (step === 2) setStep(1);
    else if (step === 3) setStep(2);
    else if (step === "preview") setStep(3);
    else if (step === "fullscreen") setStep("preview");
  }

  function handlePrimaryAction() {
    if (step === 0) setStep(1);
    else if (step === 1) setStep(2);
    else if (step === 2) setStep(3);
    else if (step === 3) setStep("preview");
  }

  const isPrimaryDisabled =
    (step === 0 && !selectedCategory) ||
    (step === 2 && !durationClauses.some((c) => selectedClauseIds.has(c.id)));

  if (step === "fullscreen") {
    return (
      <div className="relative flex min-h-screen flex-col items-center justify-center gap-6 bg-white px-6 py-10 text-center">
        <button
          type="button"
          onClick={() => setStep("preview")}
          aria-label="戻る"
          className="absolute left-5 top-5 text-gray-400 transition hover:text-gray-600"
        >
          <ChevronLeftIcon className="h-6 w-6" />
        </button>
        <div className="flex max-w-2xl flex-col gap-6">
          {mainLines.map((line, i) => (
            <p key={i} className="text-3xl font-bold leading-snug text-gray-900">
              {line}
            </p>
          ))}
          {fixedLines.length > 0 && (
            <div className="mt-2 flex flex-col gap-3 border-t border-line pt-6">
              {/*
                preview では締めの2文目を控えめに表示するが、fullscreenは
                カウンター越しに薬剤師へ確実に読んでもらう必要があるため、
                本文と同じサイズ・太さで表示する(小さくしない)。
              */}
              {fixedLines.map((line, i) => (
                <p key={i} className="text-3xl font-bold leading-snug text-gray-900">
                  {line}
                </p>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <div className="mx-auto max-w-md px-4 py-8">
          <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-sm">
            <div className="flex items-center gap-2 border-b border-line px-5 py-4">
              {step === 0 ? (
                <Link
                  href="/"
                  aria-label="ホームに戻る"
                  className="flex h-7 w-7 shrink-0 items-center justify-center text-gray-500 transition hover:text-gray-700"
                >
                  <ChevronLeftIcon className="h-5 w-5" />
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={goBack}
                  aria-label="前のステップに戻る"
                  className="flex h-7 w-7 shrink-0 items-center justify-center text-gray-500 transition hover:text-gray-700"
                >
                  <ChevronLeftIcon className="h-5 w-5" />
                </button>
              )}
              <h1 className="text-base font-bold text-gray-900">薬剤師に見せる英語</h1>
            </div>

            {typeof step === "number" && (
              <p className="px-5 pt-4 text-xs font-medium text-gray-500">
                {step + 1} / 4
              </p>
            )}

            {step === 0 && (
              <div className="p-5">
                <p className="mb-3 text-xs font-medium text-gray-500">
                  気になる症状のカテゴリを選んでください
                </p>
                <ul className="flex flex-col gap-2">
                  {parentCategories.map((category) => {
                    const Icon = getCategoryIcon(category.slug) ?? MedicalBagIcon;
                    return (
                      <li key={category.id}>
                        <ClauseChip
                          label={category.name_ja}
                          checked={selectedCategory === category.slug}
                          onClick={() => handleSelectCategory(category.slug)}
                          shape="round"
                          icon={<Icon className="h-5 w-5 shrink-0 text-gray-700" />}
                        />
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            {step === 1 && (
              <div className="p-5">
                <p className="mb-3 text-xs font-medium text-gray-500">
                  あてはまるものをすべて選んでください
                </p>
                <ul className="flex flex-col gap-2">
                  {symptomClauses.map((clause) => (
                    <li key={clause.id}>
                      <ClauseChip
                        label={clause.label_ja}
                        checked={selectedClauseIds.has(clause.id)}
                        onClick={() => toggleClause(clause.id)}
                      />
                    </li>
                  ))}
                </ul>
                {/*
                  選択内容に関わらず常時表示する固定の注意文。
                  条件分岐にせず、常にDOMに存在させる。
                */}
                <p className="mt-4 rounded-md border border-line border-l-[3px] border-l-red-700 bg-white px-3 py-2.5 text-[11px] leading-relaxed text-gray-600">
                  息苦しさ、強い胸の痛み、意識がはっきりしない場合は、薬局ではなく医療機関を受診してください。
                </p>
              </div>
            )}

            {step === 2 && (
              <div className="p-5">
                <p className="mb-3 text-xs font-medium text-gray-500">
                  ひとつ選んでください
                </p>
                <ul className="flex flex-col gap-2">
                  {durationClauses.map((clause) => (
                    <li key={clause.id}>
                      <ClauseChip
                        label={clause.label_ja}
                        checked={selectedClauseIds.has(clause.id)}
                        onClick={() => selectSingleClause(clause.id, durationClauses)}
                        shape="round"
                      />
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {step === 3 && (
              <div className="p-5">
                <p className="mb-3 text-xs font-medium text-gray-500">
                  なければ選ばずに進めます
                </p>
                <ul className="flex flex-col gap-2">
                  {contextClauses.map((clause) => (
                    <li key={clause.id}>
                      <ClauseChip
                        label={clause.label_ja}
                        checked={selectedClauseIds.has(clause.id)}
                        onClick={() => toggleClause(clause.id)}
                      />
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {step === "preview" && (
              <div className="p-5">
                <div className="flex flex-col gap-3">
                  {mainLines.map((line, i) => (
                    <p key={i} className="text-base leading-relaxed text-gray-900">
                      {line}
                    </p>
                  ))}
                  {primaryFixedLine && (
                    <p className="text-base font-semibold leading-relaxed text-gray-900">
                      {primaryFixedLine}
                    </p>
                  )}
                  {noteFixedLines.length > 0 && (
                    <div className="border-t border-line pt-3">
                      {noteFixedLines.map((line, i) => (
                        <p key={i} className="text-xs leading-relaxed text-gray-600">
                          {line}
                        </p>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-4 rounded-lg border border-line bg-white p-3">
                  <p className="mb-1 text-[10px] font-semibold text-gray-400">
                    日本語で確認
                  </p>
                  {consultText.ja.map((line, i) => (
                    <p key={i} className="text-[11px] leading-relaxed text-gray-500">
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            )}

            {typeof step === "number" && (
              <div className="border-t border-line px-5 py-4">
                <button
                  type="button"
                  onClick={handlePrimaryAction}
                  disabled={isPrimaryDisabled}
                  className="w-full rounded-lg bg-accent py-3 text-center text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {step === 3 ? "英語のカードを作る" : "次へ"}
                </button>
              </div>
            )}

            {step === "preview" && (
              <div className="flex gap-2 border-t border-line px-5 py-4">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="flex-1 rounded-lg border border-line bg-white py-3 text-center text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
                >
                  選び直す
                </button>
                <button
                  type="button"
                  onClick={() => setStep("fullscreen")}
                  className="flex-1 rounded-lg bg-accent py-3 text-center text-sm font-semibold text-white transition"
                >
                  全画面で見せる
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
      <Disclaimer />
    </div>
  );
}

function ClauseChip({
  label,
  checked,
  onClick,
  shape = "square",
  icon,
}: {
  label: string;
  checked: boolean;
  onClick: () => void;
  shape?: "square" | "round";
  icon?: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={checked}
      className={`flex w-full items-center gap-2.5 rounded-lg border px-3.5 py-3 text-left text-sm transition ${
        checked
          ? "border-accent bg-accent/10"
          : "border-line bg-white hover:bg-gray-50"
      }`}
    >
      <span
        className={`flex h-4 w-4 shrink-0 items-center justify-center border ${
          shape === "round" ? "rounded-full" : "rounded"
        } ${checked ? "border-accent bg-accent" : "border-line bg-white"}`}
      >
        {checked && (
          <span
            className={
              shape === "round"
                ? "h-1.5 w-1.5 rounded-full bg-white"
                : "h-1.5 w-2.5 -translate-y-px -rotate-45 border-b-2 border-l-2 border-white"
            }
          />
        )}
      </span>
      {icon}
      <span className="text-gray-800">{label}</span>
    </button>
  );
}
