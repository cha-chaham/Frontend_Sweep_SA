import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getScheduleById } from "../services/api";
import { useEffect, useState } from "react";
import swal from "sweetalert2";
import { FaArrowLeft } from "react-icons/fa";

export default function RouteDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [routeDetails, setRouteDetails] = useState(null);
  const [allRoutes, setAllRoutes] = useState([]);

  useEffect(() => {
    fetchRouteDetails();
  }, []);

  const fetchRouteDetails = async () => {
    try {
      const data = await getScheduleById(id);
      setRouteDetails(data);
      setAllRoutes(data.routes_data.routes);
    } catch (err) {
      swal.fire({
        title: "Error",
        text: "Gagal Mendapatkan data",
        timer: 2000,
      });
    }
  };

  // Fungsi helper untuk menghitung total waktu semua trip
  const calculateTotalTime = (routes) => {
    if (!routes || !Array.isArray(routes)) return 0;
    return routes.reduce(
      (acc, trip) => acc + (trip.total_time_minutes || 0),
      0,
    );
  };

  // Fungsi helper untuk memformat menit menjadi Jam & Menit (Contoh: 125 menit -> 2 jam 5 menit)
  const formatDuration = (totalMinutes) => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = Math.round(totalMinutes % 60);
    if (hours === 0) return `${minutes} menit`;
    return `${hours} jam ${minutes} menit`;
  };

  const totalMins = calculateTotalTime(allRoutes);

  if (!routeDetails)
    return (
      <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center space-y-4">
        <p className="text-sm text-slate-500">
          Tidak ada data rute yang dipilih.
        </p>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-md font-semibold rounded-xl shadow-sm transition-all"
        >
          <FaArrowLeft /> Kembali ke Daftar
        </button>
      </div>
    );

  return (
    <div className="space-y-6">
      {/* Tombol Kembali & Header Ringkasan */}
      <button
        onClick={() => navigate(-1)}
        className="p-2.5 rounded-xl border btn btn-primary px-6 transition-all text-md font-semibold flex items-center gap-1.5"
      >
        <FaArrowLeft /> Kembali
      </button>
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div>
            <span className="inline-block px-2.5 py-0.5 rounded-md text-xs font-semibold bg-indigo-50 text-indigo-700 mb-1">
              Detail Perjalanan
            </span>
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              {routeDetails.title}
            </h2>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="bg-slate-50 px-3 py-2 rounded-xl border border-slate-100 text-slate-600">
            Kurir:{" "}
            <strong className="text-slate-900">
              {routeDetails.assigned_driver || "Belum ditentukan"}
            </strong>
          </div>
          <div className="bg-indigo-50 px-3 py-2 rounded-xl border border-indigo-100 text-indigo-700 font-semibold">
            Total Jarak:{" "}
            {routeDetails.routes_data?.total_distance_optimal_km || 0} km
          </div>
          <div className="bg-indigo-50 px-3 py-2 rounded-xl border border-indigo-100 text-indigo-700 font-semibold">
            Estimasi Pengerjaan: {formatDuration(totalMins)}
          </div>
        </div>
      </div>

      {/* Grid Trip Berdasarkan Hasil Optimasi */}
      <div className="grid grid-cols-1 gap-6">
        {routeDetails.routes_data?.routes?.map((trip) => (
          <div
            key={trip.trip_id}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6 flex flex-col justify-between"
          >
            <div className="space-y-4">
              {/* Header Trip */}
              <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-sm shadow-indigo-100">
                    #{trip.trip_id}
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Trip Pengiriman #{trip.trip_id}
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Estimasi waktu: {trip.total_time_minutes} menit
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700">
                    Muatan: {trip.total_demand} Botol
                  </span>
                </div>
              </div>

              {/* Timeline Urutan Antaran */}
              <div className="relative pl-6 space-y-5 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {trip.route.map((stopName, idx) => {
                  const isDepot = stopName.name === "Depot Air Tahu Gurih";
                  return (
                    <div
                      key={idx}
                      className="relative flex items-start space-x-3"
                    >
                      {/* Titik Indikator Timeline */}
                      <div
                        className={`absolute -left-6 mt-1 w-3.5 h-3.5 rounded-full border-2 border-white shadow-sm transition-all ${
                          isDepot
                            ? "bg-indigo-600 ring-4 ring-indigo-50"
                            : "bg-emerald-500 ring-4 ring-emerald-50"
                        }`}
                      />

                      {/* Kartu Informasi Titik */}
                      <div className="flex-1 bg-slate-50/70 p-3.5 rounded-xl border border-slate-100">
                        <div className="flex justify-between items-center mb-1">
                          <div className="flex flex-col gap-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                              Pemberhentian #{idx + 1}
                            </span>

                            <p
                              className={`text-sm font-semibold ${isDepot ? "text-indigo-900 font-bold" : "text-slate-800"}`}
                            >
                              {stopName.name}
                            </p>
                          </div>
                          {isDepot ? (
                            <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md font-semibold">
                              Titik Depot
                            </span>
                          ) : (
                            <div className="flex flex-col gap-2">
                              <span className="text-[10px] bg-slate-200/60 text-slate-600 px-2 py-0.5 rounded-md font-medium">
                                Toko Pelanggan
                              </span>
                              <span className="text-sm bg-slate-200/60 text-indigo-700 px-2 py-0.5 rounded-md font-medium">
                                {stopName.demand} Botol
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Tombol Navigasi Google Maps */}
            <div className="pt-4 border-t border-slate-100">
              <a
                href={trip.gmaps_url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-medium text-center shadow-sm shadow-emerald-100 transition-all flex items-center justify-center gap-2"
              >
                🗺️ Buka Navigasi Google Maps (Trip #{trip.trip_id})
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
