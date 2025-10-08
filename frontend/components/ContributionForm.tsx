// components/ContributionForm.tsx
"use client";

import { useState } from "react";
import { useWebsocket } from "@/hooks/useWebsocket";

interface ContributorData {
  name: string;
  phone: string;
  kcpeYear: string;
  amount: string;
}

export default function ContributionForm() {
  const [formData, setFormData] = useState<ContributorData>({
    name: "",
    phone: "",
    kcpeYear: "",
    amount: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { sendMessage } = useWebsocket(); // For real-time update after payment

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.name ||
      !formData.phone ||
      !formData.kcpeYear ||
      !formData.amount
    ) {
      alert("Please fill all fields");
      return;
    }

    setIsSubmitting(true);
    try {
      // TODO: Integrate with lib/api.ts for M-Pesa STK Push
      // const response = await initiateSTKPush(formData.phone, parseInt(formData.amount))
      // if (response.success) {
      //   // Send to websocket for real-time update
      //   sendMessage({ type: 'contribution', data: formData })
      //   alert('STK Push sent! Please complete payment on your phone.')
      // }
      console.log("Form submitted:", formData); // Placeholder
      alert("Payment initiated! (Demo mode - integrate M-Pesa next)");
    } catch (error) {
      alert("Error initiating payment");
    } finally {
      setIsSubmitting(false);
    }
  };

  const years = Array.from({ length: 18 }, (_, i) => (2007 + i).toString());

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Full Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      <div>
        <label
          htmlFor="phone"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Phone Number
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="07XXXXXXXX"
          required
        />
      </div>
      <div>
        <label
          htmlFor="kcpeYear"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          KCPE Year
        </label>
        <select
          id="kcpeYear"
          name="kcpeYear"
          value={formData.kcpeYear}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="">Select Year</option>
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label
          htmlFor="amount"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Amount (KES)
        </label>
        <input
          type="number"
          id="amount"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          min="100"
          placeholder="Minimum 100 KES"
          required
        />
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-semibold py-2 px-4 rounded-md transition-colors"
      >
        {isSubmitting ? "Processing..." : "Checkout with M-Pesa"}
      </button>
    </form>
  );
}
