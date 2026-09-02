import Link from "next/link";
import { notFound } from "next/navigation";
import { getChildCategoryBySlug, getProductsByCategoryId } from "@/lib/data";
import { ChevronLeftIcon } from "@/components/icons";
import { ProductList } from "@/components/ProductList";

export default async function ChildCategoryProductsPage({
  params,
}: {
  params: Promise<{ parentSlug: string; childSlug: string }>;
}) {
  const { parentSlug, childSlug } = await params;

  const child = getChildCategoryBySlug(parentSlug, childSlug);

  if (!child) {
    notFound();
  }

  const products = getProductsByCategoryId(child.id);

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
          <ProductList products={products} error={false} />
        </div>
      </div>
    </div>
  );
}
