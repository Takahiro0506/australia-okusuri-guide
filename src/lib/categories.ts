import type { ComponentType } from "react";
import type { SymptomCategorySlug } from "./types";
import {
  AllergyIcon,
  HeadFeverIcon,
  SkinIcon,
  StomachIcon,
  ThroatIcon,
} from "@/components/icons";

export interface SymptomCategory {
  slug: SymptomCategorySlug;
  label: string;
  Icon: ComponentType<{ className?: string }>;
}

export const SYMPTOM_CATEGORIES: SymptomCategory[] = [
  { slug: "throat", label: "喉の痛み・咳・鼻水", Icon: ThroatIcon },
  { slug: "stomach", label: "お腹の不調", Icon: StomachIcon },
  { slug: "head_fever", label: "頭痛・発熱", Icon: HeadFeverIcon },
  { slug: "allergy", label: "アレルギー・花粉症", Icon: AllergyIcon },
  { slug: "skin", label: "擦り傷・虫刺され・日焼け", Icon: SkinIcon },
];

export function getCategoryBySlug(slug: string): SymptomCategory | undefined {
  return SYMPTOM_CATEGORIES.find((category) => category.slug === slug);
}
