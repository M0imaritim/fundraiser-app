// components/StatsDisplay.tsx
"use client";

import { useEffect, useState } from "react";
import { useWebsocket } from "../hooks/useWebsocket";

interface Stats {
  totalRaised: number;
  totalContributors: number;
  goal: number;
  percentage: number;
}

export default function StatsDisplay() {
  const [stats, setStats] = useState<Stats>({
    totalRaised: 0,
    totalContributors: 0,
    goal: 500000,
    percentage: 0,
  });
  const { messages, subscribe } = useWebsocket();

  useEffect(() => {
    // Mock initial stats - replace with API fetch from lib/api.ts
    setStats({
      totalRaised: 125000,
      totalContributors: 45,
      goal: 500000,
      percentage: 25,
    });

    const handleUpdate = (data: any) => {
      if (data.type === "stats") {
        setStats(data.data);
      }
    };

    subscribe("stats", handleUpdate);

    return () => {
      // Cleanup subscription
    };
  }, [subscribe]);

  useEffect(() => {
    if (messages.stats) {
      setStats(messages.stats);
    }
  }, [messages]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <h3 className="text-lg font-semibold text-gray-900">Total Raised</h3>
        <p className="text-2xl font-bold text-green-600">
          KES {stats.totalRaised.toLocaleString()}
        </p>
      </div>
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <h3 className="text-lg font-semibold text-gray-900">Contributors</h3>
        <p className="text-2xl font-bold text-blue-600">
          {stats.totalContributors}
        </p>
      </div>
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <h3 className="text-lg font-semibold text-gray-900">Goal</h3>
        <p className="text-2xl font-bold text-gray-900">
          KES {stats.goal.toLocaleString()}
        </p>
      </div>
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <h3 className="text-lg font-semibold text-gray-900">Progress</h3>
        <p className="text-2xl font-bold text-purple-600">
          {stats.percentage}%
        </p>
        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
          <div
            className="bg-purple-600 h-2 rounded-full transition-all"
            style={{ width: `${stats.percentage}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}
