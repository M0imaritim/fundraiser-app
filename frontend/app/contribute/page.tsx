// app/contribute/page.tsx
"use client";

import ContributionForm from "@/components/ContributionForm";

export default function ContributePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center py-8 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 sm:p-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-6">
          Make Your Contribution
        </h1>
        <ContributionForm />
      </div>
    </main>
  );
}
