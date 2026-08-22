import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import type { SymptomCategory, Product } from "@/lib/types";
import { getCategoryIcon } from "@/lib/categories";
import { ChevronLeftIcon, ChevronRightIcon, MedicalBagIcon } from "@/components/icons";
import { ProductList } from "@/components/ProductList";

export default async function ParentCategoryPage({
  params,
}: {
  params: Promise<{ parentSlug: string }>;
}) {
  const { parentSlug } = await params;

  const { data: parent, error: parentError } = await supabase
    .from("symptom_categories")
    .select("*")
    .eq("slug", parentSlug)
    .is("parent_slug", null)
    .maybeSingle<SymptomCategory>();

  if (parentError || !parent) {
    notFound();
  }

  const { data: children, error: childrenError } = await supabase
    .from("symptom_categories")
    .select("*")
    .eq("parent_slug", parentSlug)
    .order("sort_order", { ascending: true });

  const childCategories = (children as SymptomCategory[] | null) ?? [];

  // 子カテゴリが1つ以下なら中間選択をスキップし、そのまま商品一覧を表示する
  if (!childrenError && childCategories.length <= 1) {
    const targetCategory = childCategories[0] ?? parent;

    const { data: products, error: productsError } = await supabase
      .from("products")
      .select("*")
      .eq("category_id", targetCategory.id)
      .order("brand_name_en", { ascending: true });

    return (
      <div className="mx-auto max-w-md px-4 py-8">
        <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-sm">
          <div className="flex items-center gap-2 border-b border-line px-5 py-4">
            <Link
              href="/"
              aria-label="症状選択に戻る"
              className="flex h-7 w-7 shrink-0 items-center justify-center text-gray-500 transition hover:text-gray-700"
            >
              <ChevronLeftIcon className="h-5 w-5" />
            </Link>
            <h1 className="text-base font-bold text-gray-900">{parent.name_ja}</h1>
          </div>

          <div className="p-5">
            <ProductList
              products={products as Product[] | null}
              error={Boolean(productsError)}
            />
          </div>
        </div>
      </div>
    );
  }

  const ParentIcon = getCategoryIcon(parent.slug) ?? MedicalBagIcon;

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
          <h1 className="text-base font-bold text-gray-900">{parent.name_ja}</h1>
        </div>

        {childrenError && (
          <p className="p-5 text-sm text-red-600">
            症状カテゴリの取得に失敗しました。しばらくしてから再度お試しください。
          </p>
        )}

        {!childrenError && childCategories.length > 0 && (
          <ul>
            {childCategories.map((child, index) => (
              <li
                key={child.id}
                className={
                  index !== childCategories.length - 1
                    ? "border-b border-line"
                    : ""
                }
              >
                <Link
                  href={`/categories/${parentSlug}/${child.slug}`}
                  className="flex items-center gap-3 px-5 py-4 transition hover:bg-gray-50 active:bg-gray-100"
                >
                  <ParentIcon className="h-5 w-5 shrink-0 text-gray-700" />
                  <span className="flex-1 text-sm font-medium text-gray-800">
                    {child.name_ja}
                  </span>
                  <ChevronRightIcon className="h-4 w-4 shrink-0 text-gray-400" />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
