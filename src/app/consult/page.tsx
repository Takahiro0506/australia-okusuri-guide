import { getActivePhraseClauses, getParentCategories } from "@/lib/data";
import { ConsultWizard } from "@/components/ConsultWizard";

export default function ConsultPage() {
  return (
    <ConsultWizard
      parentCategories={getParentCategories()}
      clauses={getActivePhraseClauses()}
    />
  );
}
