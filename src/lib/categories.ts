import type { ComponentType } from "react";
import type { ParentCategorySlug } from "./types";
import {
  AllergyIcon,
  HeadFeverIcon,
  SkinIcon,
  StomachIcon,
  ThroatIcon,
} from "@/components/icons";

export const CATEGORY_ICONS: Record<
  ParentCategorySlug,
  ComponentType<{ className?: string }>
> = {
  throat: ThroatIcon,
  stomach: StomachIcon,
  head_fever: HeadFeverIcon,
  allergy: AllergyIcon,
  skin: SkinIcon,
};

export function getCategoryIcon(slug: string) {
  return CATEGORY_ICONS[slug as ParentCategorySlug];
}
