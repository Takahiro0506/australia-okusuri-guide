import Link from "next/link";
import type { Product } from "@/lib/types";
import { EyeIcon, WarningIcon } from "@/components/icons";

export function ProductList({
  products,
  error,
}: {
  products: Product[] | null;
  error: boolean;
}) {
  if (error) {
    return (
      <p className="rounded-lg bg-red-50 p-4 text-sm text-red-600">
        商品情報の取得に失敗しました。しばらくしてから再度お試しください。
      </p>
    );
  }

  if (!products || products.length === 0) {
    return (
      <p className="rounded-lg border border-line bg-white p-4 text-sm text-gray-500">
        現在このカテゴリに登録されている商品はありません。
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-4">
      {products.map((product) => (
        <li key={product.id} className="rounded-xl border border-line bg-white p-4">
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
              className="inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-4 py-2 text-sm font-semibold text-accent transition hover:bg-accent/20 active:scale-[0.98]"
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
  );
}
