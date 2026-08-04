import React from "react";
import {Link} from "react-router-dom";

export default function RouteTable({ routes }) {
  if (!routes || routes.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 p-12 text-center text-slate-400">
        Belum ada data rute. Klik tombol <span className="font-semibold text-slate-600">"Jalankan Optimasi Rute"</span> di Dashboard.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-slate-100">
        <h3 className="text-base font-bold text-slate-900">Rincian Rute Pengiriman per Trip</h3>
        <p className="text-xs text-slate-500 mt-0.5">Hasil optimasi algoritma Sweep & Simulated Annealing</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 text-slate-500 text-xs font-semibold uppercase tracking-wider border-b border-slate-100">
              <th className="py-3.5 px-6">Trip ID</th>
              <th className="py-3.5 px-6">Urutan Kunjungan Toko</th>
              <th className="py-3.5 px-6 text-center">Muatan</th>
              <th className="py-3.5 px-6 text-center">Jarak</th>
              <th className="py-3.5 px-6 text-center">Waktu</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
            {routes.map((trip) => (
              <tr onClick={()=> window.open(trip.gmaps_url, "_blank")} key={trip.trip_id} className="hover:bg-slate-50/50 transition-colors">
                <td className="py-4 px-6 font-semibold text-slate-900">T0{trip.trip_id}</td>
                <td className="py-4 px-6 font-mono text-xs text-slate-600 max-w-xs truncate">
                  {trip.route.join(" → ")}
                </td>
                <td className="py-4 px-6 text-center">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-indigo-50 text-indigo-700">
                    {trip.total_demand} Botol
                  </span>
                </td>
                <td className="py-4 px-6 text-center font-medium">{trip.total_distance_km} Km</td>
                <td className="py-4 px-6 text-center font-medium">{trip.total_time_minutes} min</td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}