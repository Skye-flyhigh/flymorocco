"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { TourByDate } from "@/lib/types/tour";
import { trackVaultAccess } from "@/lib/analytics";

export default function VaultDashboard() {
  const [tours, setTours] = useState<TourByDate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalTours: 0,
    totalRevenue: 0,
    totalPeople: 0,
    pilotsCount: 0,
  });
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/vault/logout", { method: "POST" });
    router.push("/en/vault");
  };

  const fetchDashboardData = async () => {
    try {
      const response = await fetch("/api/vault/bookings");
      if (response.ok) {
        const data = await response.json();
        setTours(data.bookings || []);

        // Calculate stats from tour data
        const totalTours = data.bookings?.length || 0;
        const totalRevenue =
          data.bookings?.reduce((sum: number, tour: TourByDate) => {
            return sum + tour.totalRevenue;
          }, 0) || 0;
        const totalPeople =
          data.bookings?.reduce((sum: number, tour: TourByDate) => {
            return sum + tour.totalPeople;
          }, 0) || 0;
        const pilotsCount =
          data.bookings?.reduce((sum: number, tour: TourByDate) => {
            return sum + tour.pilotsCount;
          }, 0) || 0;

        setStats({
          totalTours,
          totalRevenue,
          totalPeople,
          pilotsCount,
        });
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    trackVaultAccess();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p>Loading vault data...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-900 text-white md:pt-10">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700 px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white">
              🔐 FlyMorocco Vault
            </h1>
            <p className="text-slate-400">Business Intelligence Dashboard</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-slate-400">
              Last updated: {new Date().toLocaleTimeString()}
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium">
                  Active Tours
                </p>
                <p className="text-3xl font-bold text-blue-400">
                  {stats.totalTours}
                </p>
              </div>
              <div className="text-blue-400 text-2xl">📅</div>
            </div>
          </div>

          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium">
                  Total Revenue
                </p>
                <p className="text-3xl font-bold text-green-400">
                  £{stats.totalRevenue.toFixed(2)}
                </p>
              </div>
              <div className="text-green-400 text-2xl">💰</div>
            </div>
          </div>

          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium">
                  Total Participants
                </p>
                <p className="text-3xl font-bold text-purple-400">
                  {stats.totalPeople}
                </p>
              </div>
              <div className="text-purple-400 text-2xl">👥</div>
            </div>
          </div>

          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium">Pilots</p>
                <p className="text-3xl font-bold text-orange-400">
                  {stats.pilotsCount}
                </p>
              </div>
              <div className="text-orange-400 text-2xl">🪂</div>
            </div>
          </div>
        </div>

        {/* Tours by Date */}
        <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-700">
            <h2 className="text-xl font-semibold text-white">Tours by Date</h2>
            <p className="text-slate-400">
              Manage your tours and participant details
            </p>
          </div>

          {tours.length === 0 ? (
            <div className="p-8 text-center text-slate-400">
              <div className="text-4xl mb-4">📊</div>
              <p className="text-lg font-medium mb-2">No tour data available</p>
              <p className="text-sm">
                Tours will appear here once your Google Sheets integration is
                active
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-700">
              {tours.map((tour, index) => (
                <details key={tour.tourStartDate || index} className="group">
                  <summary className="px-6 py-4 cursor-pointer hover:bg-slate-700/50 list-none">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="text-blue-400 group-open:rotate-90 transition-transform">
                          ▶️
                        </div>
                        <div>
                          <div className="text-lg font-semibold text-white">
                            {new Date(tour.tourStartDate).toLocaleDateString(
                              "en-GB",
                              {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              },
                            )}
                          </div>
                          <div className="text-sm text-slate-400">
                            {tour.tourType} • {tour.totalPeople} participants
                            {tour.pilotsCount > 0 &&
                              ` • ${tour.pilotsCount} pilot${tour.pilotsCount > 1 ? "s" : ""}`}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold text-green-400">
                          {tour.currency} {tour.totalRevenue.toFixed(2)}
                        </div>
                        <div className="text-sm text-slate-400">
                          {tour.tourStartDate} - {tour.tourEndDate}
                        </div>
                      </div>
                    </div>
                  </summary>

                  {/* Participant Details */}
                  <div className="px-6 pb-6">
                    <div className="mt-4 bg-slate-900/50 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-slate-300 mb-3">
                        Participants
                      </h4>
                      <div className="space-y-3">
                        {tour.participants.map((participant, pIndex) => (
                          <div
                            key={pIndex}
                            className="border border-slate-600 rounded-lg p-4 bg-slate-800/50"
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <div className="flex items-center space-x-2">
                                  <h5 className="font-medium text-white">
                                    {participant.name}
                                  </h5>
                                  {participant.pilotRating && (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-900 text-orange-200">
                                      🪂 Pilot
                                    </span>
                                  )}
                                  {participant.soloOccupancy && (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-900 text-purple-200">
                                      Solo
                                    </span>
                                  )}
                                </div>
                                <p className="text-sm text-slate-400">
                                  {participant.email}
                                </p>
                              </div>
                              {participant.paymentInfo && (
                                <div className="text-right">
                                  <div className="text-sm font-medium text-green-400">
                                    Paid: {participant.paymentInfo.currency}{" "}
                                    {participant.paymentInfo.paymentAmount.toFixed(
                                      2,
                                    )}
                                  </div>
                                  <div className="text-xs text-slate-500 font-mono">
                                    {participant.paymentInfo.stripeSessionId.slice(
                                      -8,
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Participant Details Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-3 text-xs">
                              {participant.dietary && (
                                <div>
                                  <span className="text-slate-400">
                                    Dietary:
                                  </span>
                                  <span className="ml-1 text-slate-300">
                                    {participant.dietary}
                                  </span>
                                </div>
                              )}
                              {participant.medical && (
                                <div>
                                  <span className="text-slate-400">
                                    Medical:
                                  </span>
                                  <span className="ml-1 text-slate-300">
                                    {participant.medical}
                                  </span>
                                </div>
                              )}
                              {participant.emergencyContact.name && (
                                <div>
                                  <span className="text-slate-400">
                                    Emergency:
                                  </span>
                                  <span className="ml-1 text-slate-300">
                                    {participant.emergencyContact.name}
                                  </span>
                                  {participant.emergencyContact.phone && (
                                    <span className="ml-1 text-slate-400">
                                      ({participant.emergencyContact.phone})
                                    </span>
                                  )}
                                </div>
                              )}
                              {participant.insurance.provider && (
                                <div>
                                  <span className="text-slate-400">
                                    Insurance:
                                  </span>
                                  <span className="ml-1 text-slate-300">
                                    {participant.insurance.provider}
                                  </span>
                                </div>
                              )}
                              {participant.passport.number && (
                                <div>
                                  <span className="text-slate-400">
                                    Passport:
                                  </span>
                                  <span className="ml-1 text-slate-300">
                                    {participant.passport.number}
                                  </span>
                                </div>
                              )}
                              {participant.flyingExperience && (
                                <div>
                                  <span className="text-slate-400">
                                    Experience:
                                  </span>
                                  <span className="ml-1 text-slate-300">
                                    {participant.flyingExperience}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </details>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
