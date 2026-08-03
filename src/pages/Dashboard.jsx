import React, { useState } from "react";
import { runOptimization } from "../services/api";
import MetricCard from "../components/MetricCard";
import RouteTable from "../components/RouteTable";

export default function Dashboard() {
  const [loading, setLoading] = useState(false);
  const [optimizationData, setOptimizationData] = useState(null);
  const [error, setError] = useState(null);

  const handleOptimize = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await runOptimization();
      setOptimizationData(data);
    } catch (err) {
      setError(err.message || "Gagal terhubung ke backend FastAPI.");
    } finally {
      setLoading(false);
    }
  };

  const routes = optimizationData?.routes || [];
  const totalDistance = routes.reduce((acc, curr) => acc + curr.total_distance_km, 0).toFixed(2);
  const totalTime = routes.reduce((acc, curr) => acc + curr.total_time_minutes, 0).toFixed(2);
  const totalTrips = optimizationData?.total_trips || 0;
  const allFeasible = routes.length > 0 && routes.every((r) => r.is_feasible);

  return (
    <div className="space-y-8">
      {/* Header Panel Kontrol */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <span className="inline-block px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-700 mb-2">Panel Kontrol</span>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Optimasi Rute Distribusi</h2>
          <p className="text-sm text-slate-500 mt-0.5">Wilayah Kota Palu • Kapasitas max 50 botol/trip</p>
        </div>
        <button
          onClick={handleOptimize}
          disabled={loading}
          className={`inline-flex items-center justify-center px-6 py-3 rounded-xl font-medium text-white shadow-sm transition-all ${
            loading ? "bg-slate-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] shadow-indigo-100"
          }`}
        >
          {loading ? "Menghitung Rute Optimal..." : "Jalankan Optimasi Rute"}
        </button>
      </div>

      {error && <div className="bg-rose-50 border border-rose-200 text-rose-700 px-5 py-4 rounded-2xl text-sm">{error}</div>}

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="Total Jarak Tempuh" value={totalDistance} unit="Km" subtitle="Akumulasi seluruh trip" statusColor="text-indigo-600" />
        <MetricCard title="Total Waktu Operasional" value={totalTime} unit="menit" subtitle="Termasuk service time 10m" statusColor="text-sky-600" />
        <MetricCard title="Jumlah Trip Aktif" value={totalTrips} unit="Trip" subtitle="Batas max 50 botol" statusColor="text-emerald-600" />
        <MetricCard title="Status SNI (≤ 120m)" value={routes.length > 0 ? (allFeasible ? "Aman" : "Perhatian") : "Standby"} subtitle={routes.length > 0 ? (allFeasible ? "Semua trip layak SNI" : "Ada trip melewati batas") : "Menunggu data"} statusColor={allFeasible ? "text-emerald-600" : "text-amber-600"} />
      </div>

      <RouteTable routes={routes} />
    </div>
  );
}