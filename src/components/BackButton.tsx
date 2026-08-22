"use client";

import { ChevronLeftIcon } from "@/components/icons";

export function BackButton() {
  return (
    <button
      type="button"
      onClick={() => window.history.back()}
      aria-label="Back"
      className="absolute left-5 top-5 text-gray-400 transition hover:text-gray-600"
    >
      <ChevronLeftIcon className="h-6 w-6" />
    </button>
  );
}
