import React, { useState, useEffect } from "react";
import {
  saveScheduledRoute,
  getCustomers,
  runOptimization,
} from "../services/api";
import swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

export default function AdminDispatch() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [optimizing, setOptimizing] = useState(false);
  const [optimizationResult, setOptimizationResult] = useState(null);

  const navigate = useNavigate();

  // State untuk menyimpan daftar ID toko yang dicentang beserta nilai demand-nya
  // Format: { [id]: { isSelected: boolean, demand: number } }
  const [selectedStores, setSelectedStores] = useState({});

  // 1. Perbaiki fungsi helper agar bisa menerima string atau objek Date
  function formatIndonesianDate(inputDate) {
    if (!inputDate) return "-";

    // Jika input sudah berupa objek Date, ubah ke string YYYY-MM-DD
    let dateString = inputDate;
    if (inputDate instanceof Date) {
      dateString = inputDate.toISOString().split("T")[0];
    }

    const dateObj = new Date(dateString + "T00:00:00");

    if (isNaN(dateObj.getTime())) return "Format tidak valid";

    const options = {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    };

    return new Intl.DateTimeFormat("id-ID", options).format(dateObj);
  }

  // Form State untuk Penjadwalan
  const [dispatchForm, setDispatchForm] = useState({
    delivery_date: new Date().toISOString().split("T")[0],
    title: "",
    assigned_driver: "Daniel",
  });

  // Ambil data pelanggan saat komponen dimuat
  useEffect(() => {
    fetchCustomers();
    setDispatchForm((prev) => ({
      ...prev,
      title: `Pengantaran ${formatIndonesianDate(prev.delivery_date)}`,
    }));
  }, [dispatchForm.delivery_date]);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const data = await getCustomers();
      setCustomers(data);

      // Inisialisasi awal: Default semua toko terpilih dengan demand bawaan dari database
      const initialSelection = {};
      data.forEach((c) => {
        initialSelection[c.id] = {
          isSelected: true, // Default tercentang
          demand: c.demand, // Mengambil demand default dari database
        };
      });
      setSelectedStores(initialSelection);
    } catch (err) {
      swal.fire("Error", "Gagal memuat data pelanggan.", "error");
    } finally {
      setLoading(false);
    }
  };

  // Handler Checkbox (Pilih/Batalkan toko untuk pengiriman hari ini)
  const handleToggleStore = (id) => {
    setSelectedStores((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        isSelected: !prev[id].isSelected,
      },
    }));
    setOptimizationResult(null); // Reset hasil optimasi jika pilihan berubah
  };

  // Handler Input Perubahan Demand Dinamis
  const handleDemandChange = (id, value) => {
    const numValue = parseInt(value, 10) || 0;
    setSelectedStores((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        demand: numValue,
      },
    }));
    setOptimizationResult(null); // Reset hasil optimasi jika demand berubah
  };

  // Handler Input Form Dispatch
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDispatchForm((prev) => ({ ...prev, [name]: value }));
  };

  // Jalankan Kalkulasi VRP dengan Data Dinamis (Hanya toko yang dicentang & demand terbaru)
  const handleRunOptimization = async () => {
    // Saring toko yang dicentang dan ambil data lengkapnya beserta demand dinamis
    const activePayload = customers
      .filter((c) => selectedStores[c.id]?.isSelected)
      .map((c) => ({
        id: c.id,
        name: c.name,
        lat: c.lat,
        lon: c.lon,
        demand: selectedStores[c.id].demand, // Menggunakan demand dinamis terbaru
        gmaps_link: c.gmaps_link || "",
      }));

    if (activePayload.length === 0) {
      swal.fire(
        "Peringatan",
        "Pilih minimal satu toko untuk diantar.",
        "warning",
      );
      return;
    }

    try {
      setOptimizing(true);
      const res = await runOptimization(activePayload);
      setOptimizationResult(res);
      swal.fire("Berhasil", "Optimasi rute berhasil dikalkulasi!", "success");
    } catch (err) {
      swal.fire(
        "Gagal",
        err.response?.data?.detail || "Gagal menjalankan optimasi.",
        "error",
      );
    } finally {
      setOptimizing(false);
    }
  };

  // Simpan Rute ke Jadwal Pengiriman (Publish ke Driver)
  const handleSaveDispatch = async (e) => {
    e.preventDefault();
    if (!optimizationResult) {
      swal.fire(
        "Peringatan",
        "Harap jalankan optimasi rute terlebih dahulu sebelum menjadwalkan.",
        "warning",
      );
      return;
    }

    try {
      const payload = {
        title: dispatchForm.title,
        delivery_date: dispatchForm.delivery_date,
        assigned_driver: dispatchForm.assigned_driver,
        routes_data: optimizationResult,
      };

      await saveScheduledRoute(payload);
      swal
        .fire(
          "Sukses!",
          "Jadwal pengiriman berhasil disimpan dan dikirim ke Driver.",
          "success",
        )
        .finally(() => {
          navigate("/");
        });

      // Reset form
      setDispatchForm({
        title: "",
        delivery_date: new Date().toISOString().split("T")[0],
        assigned_driver: "",
      });
      setOptimizationResult(null);
    } catch (err) {
      swal.fire("Error", err.message, "error");
    }
  };

  // Hitung total toko yang dicentang
  const totalSelectedCount = Object.values(selectedStores).filter(
    (s) => s.isSelected,
  ).length;

  const totalDemand = Object.values(selectedStores).reduce((sum, store) => {
    return store.isSelected ? sum + (Number(store.demand) || 0) : sum;
  }, 0);

  // Cek apakah semua toko sedang terpilih
  const isAllSelected =
    customers.length > 0 &&
    customers.every((c) => selectedStores[c.id]?.isSelected);

  // Handler untuk mencentang / membatalkan centang semua toko sekaligus
  const handleToggleAll = () => {
    const newStatus = !isAllSelected; // Jika semua terpilih, ubah jadi false (batalkan semua). Sebaliknya, jadi true.
    const updatedSelection = {};

    customers.forEach((c) => {
      updatedSelection[c.id] = {
        ...selectedStores[c.id],
        isSelected: newStatus,
        demand: selectedStores[c.id]?.demand ?? c.demand,
      };
    });

    setSelectedStores(updatedSelection);
    setOptimizationResult(null); // Reset hasil optimasi
  };

  return (
    <div className="space-y-8">
      {/* Header Halaman */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <span className="inline-block px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-50 text-amber-700 mb-2">
            Menu Penambahan Rute
          </span>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Manajemen & Penjadwalan Rute
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Tentukan toko aktif, ubah demand harian, dan tetapkan rute kurir
          </p>
        </div>
        <button
          onClick={handleRunOptimization}
          disabled={optimizing || totalSelectedCount === 0}
          className={`px-5 py-2.5 rounded-xl font-medium text-white text-sm shadow-sm transition-all ${
            optimizing || totalSelectedCount === 0
              ? "bg-slate-300 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100"
          }`}
        >
          {optimizing
            ? "Menghitung Rute..."
            : `⚡ Kalkulasi VRP (${totalSelectedCount} Toko Terpilih)`}
        </button>
      </div>

      {/* Grid Utama: Daftar Pelanggan & Form Publish Jadwal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Kolom Kiri: Tabel Seleksi Toko */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4 w-full">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-bold text-slate-900">
              Pilih Toko & Atur Demand Harian
            </h3>
            <span className="text-xs text-slate-500 font-medium bg-slate-50 px-3 py-1 rounded-lg border border-slate-100">
              Aktif:{" "}
              <strong className="text-indigo-600">{totalSelectedCount}</strong>{" "}
              dari {customers.length} Toko
            </span>
          </div>

          {loading ? (
            <p className="text-sm text-slate-400 py-8 text-center">
              Memuat data toko...
            </p>
          ) : (
            /* 2. Tambahkan max-h-[420px] agar kontainer memiliki batas dan scrollbar aktif */
            <div className="overflow-x-auto overflow-y-auto max-h-105 pr-2">
              <table className="w-full text-left border-collapse relative">
                <thead className="sticky top-0 bg-slate-50 z-10 shadow-sm">
                  <tr className="text-slate-500 text-xs font-semibold uppercase tracking-wider border-b border-slate-100">
                    <th className="py-3 px-4 text-center w-12">
                      {/* Master Checkbox untuk Pilih/Batalkan Semua */}
                      <input
                        type="checkbox"
                        checked={isAllSelected}
                        onChange={handleToggleAll}
                        className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 cursor-pointer"
                        title="Pilih/Batalkan Semua"
                      />
                    </th>
                    <th className="py-3 px-4">Nama Toko</th>
                    <th className="py-3 px-4">Koordinat</th>
                    <th className="py-3 px-4 text-center w-36">
                      Demand (Botol)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                  {customers.map((c) => {
                    const isChecked = selectedStores[c.id]?.isSelected ?? true;
                    const currentDemand =
                      selectedStores[c.id]?.demand ?? c.demand;

                    return (
                      <tr
                        key={c.id}
                        className={`hover:bg-slate-50/50 transition-colors ${!isChecked ? "opacity-40 bg-slate-50/30" : ""}`}
                      >
                        <td className="py-3 px-4 text-center">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleToggleStore(c.id)}
                            className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 cursor-pointer"
                          />
                        </td>
                        <td className="py-3 px-4 font-medium text-slate-900">
                          {c.name}
                        </td>
                        <td className="py-3 px-4 font-mono text-xs text-slate-500">
                          {c.lat}, {c.lon}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <input
                            type="number"
                            min="0"
                            disabled={!isChecked}
                            value={currentDemand}
                            onChange={(e) =>
                              handleDemandChange(c.id, e.target.value)
                            }
                            className="w-24 px-3 py-1.5 text-center rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-slate-100 disabled:cursor-not-allowed"
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot className="sticky bottom-0 bg-slate-50 z-10 shadow-sm">
                  <tr className="text-slate-500 text-xs font-semibold uppercase tracking-wider border-b border-slate-100">
                    <td className="py-3 px-4 text-center" colSpan={3}>
                      Total
                    </td>
                    <td className="py-3 px-4">{totalDemand}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </div>

        {/* Kolom Kanan: Form Publish Jadwal ke Driver */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-2">
              Publikasi Penugasan
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Kunci hasil optimasi rute ke dalam jadwal harian driver.
            </p>

            <form
              onSubmit={handleSaveDispatch}
              id="dispatch-form"
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Judul / Sesi Pengiriman
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  placeholder="Contoh: Rute Pagi Wilayah Kota"
                  value={dispatchForm.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-base-200 text-neutral-500"
                  disabled
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Tanggal Pengiriman
                </label>
                <input
                  type="date"
                  name="delivery_date"
                  required
                  value={dispatchForm.delivery_date}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Nama Kurir / Driver
                </label>
                <input
                  type="text"
                  name="assigned_driver"
                  required
                  placeholder="Contoh: Andi Kurir"
                  value={dispatchForm.assigned_driver}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-base-200 text-neutral-500"
                  disabled
                />
              </div>
            </form>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100">
            <div className="mb-3 text-xs flex justify-between text-slate-500">
              <span>Status Kalkulasi:</span>
              <span
                className={`font-semibold ${optimizationResult ? "text-emerald-600" : "text-amber-600"}`}
              >
                {optimizationResult ? "Siap Dipublikasikan" : "Belum Dihitung"}
              </span>
            </div>
            <button
              type="submit"
              form="dispatch-form"
              disabled={!optimizationResult}
              className={`w-full py-3 rounded-xl font-medium text-white text-sm shadow-sm transition-all ${
                !optimizationResult
                  ? "bg-slate-300 cursor-not-allowed"
                  : "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-100"
              }`}
            >
              Simpan & Kirim ke Driver
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
