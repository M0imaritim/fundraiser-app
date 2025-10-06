"use client";

import { ContributorWithTotal } from "@/lib/api";
import { Heart } from "lucide-react";

interface ThankYouSectionProps {
  contributors: ContributorWithTotal[];
}

export function ThankYouSection({ contributors }: ThankYouSectionProps) {
  if (contributors.length === 0) {
    return null;
  }

  return (
    <div className="bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl shadow-lg p-6 sm:p-8 text-white">
      <div className="flex items-center justify-center gap-3 mb-6">
        <Heart className="w-8 h-8 fill-white" />
        <h2 className="text-3xl font-bold text-center">Thank You!</h2>
        <Heart className="w-8 h-8 fill-white" />
      </div>

      <p className="text-center text-primary-100 mb-8 text-lg">
        We are grateful to all our contributors who made this possible
      </p>

      {/* Contributors Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {contributors.map((contributor) => (
          <div
            key={contributor.id}
            className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center transform hover:scale-105 transition-transform duration-200 border border-white/20"
          >
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-2">
              <span className="text-2xl font-bold">
                {contributor.first_name.charAt(0).toUpperCase()}
              </span>
            </div>
            <p className="font-semibold text-sm truncate">
              {contributor.first_name}
            </p>
            <p className="text-xs text-primary-200 mt-1">
              Class of {contributor.kcpe_year}
            </p>
            <p className="text-xs text-primary-100 mt-1">
              {contributor.contribution_count}{" "}
              {contributor.contribution_count === 1
                ? "contribution"
                : "contributions"}
            </p>
          </div>
        ))}
      </div>

      {/* Floating hearts animation */}
      <div className="mt-8 flex justify-center gap-2">
        {[...Array(5)].map((_, i) => (
          <Heart
            key={i}
            className="w-4 h-4 fill-white/30 animate-bounce"
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </div>
    </div>
  );
}
