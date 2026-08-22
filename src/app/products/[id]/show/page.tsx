import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { BackButton } from "@/components/BackButton";
import type { Product } from "@/lib/types";

export default async function ShowToStaffPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { data: product, error } = await supabase
    .from("products")
    .select("brand_name_en, active_ingredient")
    .eq("id", id)
    .maybeSingle<Pick<Product, "brand_name_en" | "active_ingredient">>();

  if (error || !product) {
    notFound();
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-white px-6 py-10 text-center">
      <BackButton />

      <p className="mb-10 text-4xl font-extrabold leading-tight tracking-tight text-gray-900 sm:text-5xl">
        {product.brand_name_en}
      </p>
      <p className="text-xl font-medium text-gray-600 sm:text-2xl">
        {product.active_ingredient}
      </p>
    </div>
  );
}
