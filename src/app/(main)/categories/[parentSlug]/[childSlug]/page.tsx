import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import type { Product, SymptomCategory } from "@/lib/types";
import { ChevronLeftIcon } from "@/components/icons";
import { ProductList } from "@/components/ProductList";

export default async function ChildCategoryProductsPage({
  params,
}: {
  params: Promise<{ parentSlug: string; childSlug: string }>;
}) {
  const { parentSlug, childSlug } = await params;

  const { data: child, error: childError } = await supabase
    .from("symptom_categories")
    .select("*")
    .eq("slug", childSlug)
    .eq("parent_slug", parentSlug)
    .maybeSingle<SymptomCategory>();

  if (childError || !child) {
    notFound();
  }

  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .eq("category_id", child.id)
    .order("brand_name_en", { ascending: true });

  return (
    <div className="mx-auto max-w-md px-4 py-8">
      <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-sm">
        <div className="flex items-center gap-2 border-b border-line px-5 py-4">
          <Link
            href={`/categories/${parentSlug}`}
            aria-label="カテゴリ選択に戻る"
            className="flex h-7 w-7 shrink-0 items-center justify-center text-gray-500 transition hover:text-gray-700"
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </Link>
          <h1 className="text-base font-bold text-gray-900">{child.name_ja}</h1>
        </div>

        <div className="p-5">
          <ProductList
            products={products as Product[] | null}
            error={Boolean(error)}
          />
        </div>
      </div>
    </div>
  );
}
