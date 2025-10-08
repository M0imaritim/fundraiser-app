// components/YearlyStats.tsx
"use client";

import { useEffect, useState } from "react";
import { useWebsocket } from "@/hooks/useWebsocket";

interface Contributor {
  name: string;
  year: string;
}

interface YearlyData {
  [year: string]: Contributor[];
}

export default function YearlyStats() {
  const [yearlyContributors, setYearlyContributors] = useState<YearlyData>({});
  const { messages, subscribe } = useWebsocket();

  useEffect(() => {
    // Mock data - replace with API fetch
    const mockData: YearlyData = {
      "2007": [
        { name: "John Doe", year: "2007" },
        { name: "Jane Smith", year: "2007" },
      ],
      "2010": [{ name: "Alice Johnson", year: "2010" }],
      "2015": [
        { name: "Bob Wilson", year: "2015" },
        { name: "Carol Davis", year: "2015" },
        { name: "David Brown", year: "2015" },
      ],
      "2020": [
        { name: "Eve Miller", year: "2020" },
        { name: "Frank Garcia", year: "2020" },
      ],
    };
    setYearlyContributors(mockData);

    const handleUpdate = (data: any) => {
      if (data.type === "contributors") {
        setYearlyContributors(data.data);
      }
    };

    subscribe("contributors", handleUpdate);

    return () => {
      // Cleanup
    };
  }, [subscribe]);

  useEffect(() => {
    if (messages.contributors) {
      setYearlyContributors(messages.contributors);
    }
  }, [messages]);

  return (
    <div className="mb-8">
      <h3 className="text-xl font-semibold text-gray-800 mb-6 text-center">
        Our Generous Contributors
      </h3>
      <div className="space-y-8">
        {Object.entries(yearlyContributors).map(([year, contributors]) => (
          <div
            key={year}
            className="relative bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-2xl p-6 sm:p-8 shadow-xl border border-white/20 overflow-hidden"
          >
            {/* Artistic background elements */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-4 left-4 w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-xl"></div>
              <div className="absolute bottom-4 right-4 w-16 h-16 bg-gradient-to-l from-indigo-400 to-purple-400 rounded-full blur-xl"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-gradient-to-r from-pink-400 to-indigo-400 rounded-full blur-2xl"></div>
            </div>

            {/* Year Header with artistic flair */}
            <div className="relative z-10 text-center mb-6">
              <h4 className="inline-block text-2xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent tracking-wide">
                {year}
              </h4>
              <p className="text-sm text-gray-600 mt-1">Class of Legends</p>
            </div>

            {/* Contributors Layout: Floating artistic bubbles */}
            <div className="relative z-10 flex flex-wrap justify-center items-center gap-2 sm:gap-3">
              {contributors.map((contrib, idx) => {
                // Calculate position for artistic scatter
                const delay = idx * 0.15;
                const rotation = Math.sin(idx) * 10; // Slight rotation variation
                const scale = 1 + (Math.random() - 0.5) * 0.1; // Subtle size variation

                return (
                  <div
                    key={idx}
                    className="group relative inline-flex items-center justify-center"
                    style={{
                      animationDelay: `${delay}s`,
                    }}
                  >
                    <div
                      className="relative px-4 sm:px-5 py-2 sm:py-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg border border-white/50 transform transition-all duration-300 hover:scale-110 hover:rotate-3 hover:shadow-2xl hover:bg-white/100 cursor-pointer"
                      style={{
                        transform: `rotate(${rotation}deg) scale(${scale})`,
                      }}
                    >
                      {/* Initials badge for extra artistry */}
                      <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 rounded-full blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
                      <span className="relative text-sm sm:text-base font-semibold text-gray-800 z-10">
                        {contrib.name}
                      </span>
                    </div>
                    {/* Sparkle effect on hover */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-400 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur"></div>
                  </div>
                );
              })}
            </div>

            {/* Subtle count badge */}
            {contributors.length > 0 && (
              <div className="relative z-10 mt-4 text-center">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border border-purple-200">
                  {contributors.length} Stars Shining Bright
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
