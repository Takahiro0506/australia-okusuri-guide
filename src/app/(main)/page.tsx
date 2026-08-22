import Link from "next/link";
import { SYMPTOM_CATEGORIES } from "@/lib/categories";
import { ChevronRightIcon, MedicalBagIcon } from "@/components/icons";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-md px-4 py-8">
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center gap-3 border-b border-gray-100 px-5 py-4">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-blue-200 text-blue-600">
            <MedicalBagIcon className="h-5 w-5" />
          </span>
          <div>
            <h1 className="text-base font-bold text-gray-900">
              オーストラリアお薬ガイド
            </h1>
            <p className="text-xs text-gray-500">気になる症状を選んでください</p>
          </div>
        </div>

        <ul>
          {SYMPTOM_CATEGORIES.map((category, index) => (
            <li
              key={category.slug}
              className={
                index !== SYMPTOM_CATEGORIES.length - 1
                  ? "border-b border-gray-100"
                  : ""
              }
            >
              <Link
                href={`/categories/${category.slug}`}
                className="flex items-center gap-3 px-5 py-4 transition hover:bg-gray-50 active:bg-gray-100"
              >
                <category.Icon className="h-5 w-5 shrink-0 text-gray-700" />
                <span className="flex-1 text-sm font-medium text-gray-800">
                  {category.label}
                </span>
                <ChevronRightIcon className="h-4 w-4 shrink-0 text-gray-400" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
