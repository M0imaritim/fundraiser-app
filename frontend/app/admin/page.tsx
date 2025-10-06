"use client";

import { useState, useEffect } from "react";
import { adminApi, contributorApi, ContributorWithTotal } from "@/lib/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { LogOut, Send, CheckSquare, Square } from "lucide-react";

export default function AdminPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [contributors, setContributors] = useState<ContributorWithTotal[]>([]);
  const [selectedContributors, setSelectedContributors] = useState<Set<string>>(
    new Set()
  );
  const [amount, setAmount] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (token) {
      setIsAuthenticated(true);
      fetchContributors();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchContributors = async () => {
    try {
      const res = await contributorApi.getAll();
      setContributors(res.data);
    } catch (error) {
      console.error("Failed to fetch contributors:", error);
      toast.error("Failed to load contributors");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await adminApi.login(loginData);
      localStorage.setItem("admin_token", res.data.token);
      setIsAuthenticated(true);
      toast.success("Login successful");
      fetchContributors();
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    setIsAuthenticated(false);
    router.push("/");
  };

  const toggleContributor = (id: string) => {
    const newSelected = new Set(selectedContributors);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedContributors(newSelected);
  };

  const toggleAll = () => {
    if (selectedContributors.size === contributors.length) {
      setSelectedContributors(new Set());
    } else {
      setSelectedContributors(new Set(contributors.map((c) => c.id)));
    }
  };

  const handleSendStkPush = async () => {
    if (selectedContributors.size === 0) {
      toast.error("Please select at least one contributor");
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    setSending(true);

    try {
      const res = await adminApi.initiateStk({
        contributor_ids: Array.from(selectedContributors),
        amount: parseFloat(amount),
      });

      toast.success(`STK push sent to ${res.data.successful} contributors`);
      if (res.data.failed > 0) {
        toast.warning(`${res.data.failed} requests failed`);
      }

      setSelectedContributors(new Set());
      setAmount("");
    } catch (error: any) {
      console.error("STK push error:", error);
      toast.error("Failed to send STK push");
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="animate-pulse text-gray-600 text-xl font-semibold">
          Loading...
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
          <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            Admin Login
          </h1>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <input
                type="text"
                required
                value={loginData.username}
                onChange={(e) =>
                  setLoginData({ ...loginData, username: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter username"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                required
                value={loginData.password}
                onChange={(e) =>
                  setLoginData({ ...loginData, password: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition font-semibold disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            <button
              type="button"
              onClick={() => router.push("/")}
              className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition font-semibold"
            >
              Back to Home
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Admin Panel
            </h1>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* STK Push Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Send STK Push
          </h2>

          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount (KES)
              </label>
              <input
                type="number"
                min="1"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter amount"
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={handleSendStkPush}
                disabled={sending || selectedContributors.size === 0}
                className="w-full sm:w-auto px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                {sending
                  ? "Sending..."
                  : `Send to ${selectedContributors.size} Selected`}
              </button>
            </div>
          </div>

          <p className="text-sm text-gray-600">
            Select contributors below to send them an STK push prompt.
          </p>
        </div>

        {/* Contributors List */}
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Contributors ({contributors.length})
            </h2>
            <button
              onClick={toggleAll}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm font-medium"
            >
              {selectedContributors.size === contributors.length ? (
                <>
                  <CheckSquare className="w-4 h-4" />
                  Deselect All
                </>
              ) : (
                <>
                  <Square className="w-4 h-4" />
                  Select All
                </>
              )}
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Select
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    KCPE Year
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Contributed
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contributions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {contributors.map((contributor) => (
                  <tr
                    key={contributor.id}
                    className={`hover:bg-gray-50 transition ${
                      selectedContributors.has(contributor.id)
                        ? "bg-primary-50"
                        : ""
                    }`}
                  >
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        checked={selectedContributors.has(contributor.id)}
                        onChange={() => toggleContributor(contributor.id)}
                        className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                      />
                    </td>
                    <td className="px-4 py-4 text-sm font-medium text-gray-900">
                      {contributor.first_name}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-700">
                      {contributor.kcpe_year}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-700 capitalize">
                      {contributor.role}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900 font-semibold">
                      KES{" "}
                      {parseFloat(
                        contributor.total_contributed
                      ).toLocaleString()}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-700">
                      {contributor.contribution_count}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
