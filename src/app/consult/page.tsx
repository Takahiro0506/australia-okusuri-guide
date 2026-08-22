import { supabase } from "@/lib/supabase";
import { ConsultWizard } from "@/components/ConsultWizard";
import type { PhraseClause, SymptomCategory } from "@/lib/types";

export default async function ConsultPage() {
  const [categoriesResult, clausesResult] = await Promise.all([
    supabase
      .from("symptom_categories")
      .select("*")
      .is("parent_slug", null)
      .order("sort_order", { ascending: true }),
    supabase
      .from("phrase_clauses")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true }),
  ]);

  const hasError = Boolean(categoriesResult.error || clausesResult.error);

  if (hasError) {
    return (
      <div className="mx-auto max-w-md px-4 py-8">
        <p className="rounded-lg bg-red-50 p-4 text-sm text-red-600">
          情報の取得に失敗しました。しばらくしてから再度お試しください。
        </p>
      </div>
    );
  }

  return (
    <ConsultWizard
      parentCategories={(categoriesResult.data as SymptomCategory[] | null) ?? []}
      clauses={(clausesResult.data as PhraseClause[] | null) ?? []}
    />
  );
}
