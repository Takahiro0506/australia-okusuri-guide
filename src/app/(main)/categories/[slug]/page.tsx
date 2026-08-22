import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import type { Product, SymptomCategory } from "@/lib/types";
import { ChevronLeftIcon, EyeIcon, WarningIcon } from "@/components/icons";

export default async function CategoryProductsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const { data: category, error: categoryError } = await supabase
    .from("symptom_categories")
    .select("*")
    .eq("slug", slug)
    .maybeSingle<SymptomCategory>();

  if (categoryError || !category) {
    notFound();
  }

  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .eq("category_id", category.id)
    .order("brand_name_en", { ascending: true });

  return (
    <div className="mx-auto max-w-md px-4 py-8">
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center gap-2 border-b border-gray-100 px-5 py-4">
          <Link
            href="/"
            aria-label="症状選択に戻る"
            className="flex h-7 w-7 shrink-0 items-center justify-center text-gray-500 transition hover:text-gray-700"
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </Link>
          <h1 className="text-base font-bold text-gray-900">{category.name_ja}</h1>
        </div>

        <div className="p-5">
          {error && (
            <p className="rounded-lg bg-red-50 p-4 text-sm text-red-600">
              商品情報の取得に失敗しました。しばらくしてから再度お試しください。
            </p>
          )}

          {!error && (!products || products.length === 0) && (
            <p className="rounded-lg bg-gray-50 p-4 text-sm text-gray-500">
              現在このカテゴリに登録されている商品はありません。
            </p>
          )}

          <ul className="flex flex-col gap-4">
            {(products as Product[] | null)?.map((product) => (
              <li key={product.id} className="rounded-xl bg-gray-50 p-4">
                <p className="text-base font-semibold text-gray-900">
                  {product.brand_name_en}
                </p>
                {product.description_ja && (
                  <p className="mt-1 text-sm text-gray-500">
                    {product.description_ja}
                  </p>
                )}

                {product.caution_flags && product.caution_flags.length > 0 && (
                  <ul className="mt-3 flex flex-col gap-1.5">
                    {product.caution_flags.map((tag) => (
                      <li
                        key={tag}
                        className="flex items-center gap-1.5 text-sm font-semibold text-amber-700"
                      >
                        <WarningIcon className="h-4 w-4 shrink-0" />
                        {tag}
                      </li>
                    ))}
                  </ul>
                )}

                {product.state_note && (
                  <p className="mt-2 text-xs text-gray-500">
                    州による違い: {product.state_note}
                  </p>
                )}

                <div className="mt-4 flex items-center justify-between gap-3">
                  <Link
                    href={`/products/${product.id}/show`}
                    className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-600 transition hover:bg-blue-100 active:scale-[0.98]"
                  >
                    <EyeIcon className="h-4 w-4" />
                    店員さんに見せる
                  </Link>
                  <span className="shrink-0 text-[11px] text-gray-400">
                    最終確認日: {product.last_reviewed_date}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
