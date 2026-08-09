import React, { useState, useEffect } from "react";
import { getTodaysRoutes, getRouteHistory } from "../services/api";
import swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

export default function DriverDashboard() {
  const [activeTab, setActiveTab] = useState("today"); // "today" atau "history"
  const [todaysRoutes, setTodaysRoutes] = useState([]);
  const [historyRoutes, setHistoryRoutes] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    try {
      setLoading(true);
      if (activeTab === "today") {
        const res = await getTodaysRoutes();
        setTodaysRoutes(res);
      } else {
        const res = await getRouteHistory();
        setHistoryRoutes(res);
      }
    } catch (err) {
      swal.fire("Error", "Gagal memuat data perjalanan.", "error");
    } finally {
      setLoading(false);
    }
  };

  const routesToDisplay = activeTab === "today" ? todaysRoutes : historyRoutes;

  return (
    <div className="space-y-8">
      {/* Header & Tab Switcher */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Dashboard Pengiriman</h2>
          <p className="text-sm text-slate-500 mt-0.5">Lihat rute penugasan hari ini dan riwayat perjalanan sebelumnya</p>
        </div>

        {/* Navigasi Tab */}
        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab("today")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold w-full transition-all ${
              activeTab === "today" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Perjalanan Hari Ini
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold w-full transition-all ${
              activeTab === "history" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Riwayat Perjalanan
          </button>
        </div>
      </div>

      {/* Konten Daftar Rute */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center text-slate-400 text-sm">
          Memuat data...
        </div>
      ) : routesToDisplay.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center space-y-2">
          <p className="text-base font-semibold text-slate-700">
            {activeTab === "today" ? "Tidak ada jadwal pengiriman untuk hari ini." : "Belum ada riwayat perjalanan."}
          </p>
          <p className="text-xs text-slate-400">
            {activeTab === "today" ? "Admin belum menetapkan rute atau pengiriman untuk tanggal hari ini." : "Riwayat pengiriman yang tersimpan akan muncul di sini."}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {routesToDisplay.map((schedule) => (
            <div key={schedule.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6 hover:border-blue-600 ease-in transition-all">

              {/* Informasi Jadwal */}
              <div onClick={()=>navigate(`/schedule/${schedule.id}`)} className="flex flex-col md:flex-row md:items-center justify-between border-slate-100 gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-slate-900">{schedule.title}</h3>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Kurir: <strong className="text-slate-700">{schedule.assigned_driver || "Tidak ditentukan"}</strong> | Tanggal: {schedule.delivery_date}
                  </p>
                </div>
                <div className="flex flex-col gap-3">
                    <span className="px-2.5 py-0.5 rounded-full text-xs text-center font-medium bg-emerald-50 text-emerald-700">
                      {schedule.status}
                    </span>
                  <div className="text-xs font-medium text-slate-500 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                  Total Jarak Optimal: <strong className="text-indigo-600">{schedule.routes_data?.total_distance_optimal_km || 0} km</strong>
                </div>
                <div className="text-xs font-medium text-slate-500 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                  Total Perjalanan: <strong className="text-indigo-600">{schedule.routes_data?.total_trips || 0}</strong>
                </div>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}