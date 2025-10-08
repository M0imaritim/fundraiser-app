// app/page.tsx
"use client";

import Link from "next/link";
import StatsDisplay from "../components/StatsDisplay";
import ThankYouSection from "../components/ThankYouSection";
import YearlyStats from "../components/YearlyStats";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      {/* Hero Section: Purpose */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Reunite with Your KCPE Classmates
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-8">
            This one-time fundraiser is dedicated to organizing an unforgettable
            reunion for KCPE alumni from 2007-2024. Your contributions will help
            cover venue, catering, and memorable activities to celebrate our
            shared journey.
          </p>
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              How Your Money is Collected and Managed
            </h2>
            <ul className="text-left space-y-2 text-gray-600">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                Secure payments via M-Pesa STK Push using Daraja API.
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                Funds are held in a dedicated transparent account, with updates
                shared via dashboard.
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                All expenditures audited and reported to contributors.
              </li>
            </ul>
          </div>
          <Link
            href="/contribute"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
          >
            Contribute Now
          </Link>
        </div>
      </section>

      {/* Dashboard Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-8">
            Campaign Progress
          </h2>
          <StatsDisplay />
        </div>
      </section>

      {/* Thank You and Contributors */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <ThankYouSection />
          <YearlyStats />
        </div>
      </section>

      {/* CTA Footer */}
      <footer className="py-8 px-4 sm:px-6 lg:px-8 text-center bg-gray-800 text-white">
        <p className="mb-4">Join us in making memories that last a lifetime.</p>
        <Link
          href="/contribute"
          className="inline-block bg-green-600 hover:bg-green-700 font-semibold py-2 px-6 rounded-lg transition-colors"
        >
          Contribute Now
        </Link>
      </footer>
    </main>
  );
}
