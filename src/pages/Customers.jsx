import React, { useState, useEffect } from "react";
import { getCustomers, addCustomer } from "../services/api";
import CardCustomers from "../components/CardCustomers";
import { useNavigate } from "react-router-dom";

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null)

  const navigate = useNavigate();

  // State form menggunakan gmaps_link
  const [formData, setFormData] = useState({
    name: "",
    gmaps_link: "",
    demand: ""
  });

  const fetchCustomerData = async () => {
    try {
      setLoading(true);
      const data = await getCustomers();
      setCustomers(data);
    } catch (err) {
      setError(err.message || "Terjadi kesalahan saat memuat data pelanggan.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomerData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const payload = {
        name: formData.name,
        gmaps_link: formData.gmaps_link,
        demand: parseInt(formData.demand, 10)
      };

      await addCustomer(payload);

      // Reset form dan muat ulang data
      setFormData({ name: "", gmaps_link: "", demand: "" });
      await fetchCustomerData();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Halaman */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <span className="inline-block px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-700 mb-2">
            Master Data
          </span>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Titik Pelanggan Kota Palu</h2>
          <p className="text-sm text-slate-500 mt-0.5">Tambah pelanggan baru otomatis via Link Google Maps</p>
        </div>
        <div className="text-sm font-medium text-slate-600 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
          Total Pelanggan: <span className="font-bold text-indigo-600">{customers.length} Toko</span>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 px-5 py-4 rounded-2xl text-sm">
          {error}
        </div>
      )}

      {/* Form Tambah Toko dengan Google Maps Link */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <h3 className="text-base font-bold text-slate-900 mb-4">Tambah Titik Pelanggan via Link Google Maps</h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            name="name"
            placeholder="Nama Toko / Pelanggan"
            value={formData.name}
            onChange={handleInputChange}
            required
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="url"
            name="gmaps_link"
            placeholder="Paste Link Google Maps (Cth: https://maps.app.goo.gl/...)"
            value={formData.gmaps_link}
            onChange={handleInputChange}
            required
            className="md:col-span-2 px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <div className="flex gap-2">
            <input
              type="number"
              name="demand"
              placeholder="Demand (Botol)"
              value={formData.demand}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              disabled={submitting}
              className={`px-5 py-2.5 rounded-xl font-medium text-white text-sm shadow-sm transition-all whitespace-nowrap ${
                submitting ? "bg-slate-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100"
              }`}
            >
              {submitting ? "Memproses..." : "Simpan"}
            </button>
          </div>
        </form>
      </div>

      {/* Tabel Data Pelanggan */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-sm">Memuat data pelanggan dari database MySQL...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 text-slate-500 text-xs font-semibold uppercase tracking-wider border-b border-slate-100">
                  <th className="py-3.5 px-6">ID</th>
                  <th className="py-3.5 px-6">Nama Toko</th>
                  <th className="py-3.5 px-6">Latitude</th>
                  <th className="py-3.5 px-6">Longitude</th>
                  <th className="py-3.5 px-6 text-center">Permintaan Harian</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                {customers.map((item, index) => (
                  // <tr key={item.id} onClick={()=> navigate(`./${item.id}`)} className="hover:bg-slate-100 transition-colors">
                   <tr key={item.id} onClick={()=> {setSelectedItem(item); document.getElementById('my_modal_1').showModal();}} className="hover:bg-slate-100 transition-colors">
                    <td className="py-4 px-6 font-semibold text-slate-900">{index+1}</td>
                    <td className="py-4 px-6 font-medium text-slate-900">{item.name}</td>
                    <td className="py-4 px-6 font-mono text-xs text-slate-600">{item.lat}</td>
                    <td className="py-4 px-6 font-mono text-xs text-slate-600">{item.lon}</td>
                    <td className="py-4 px-6 text-center">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-indigo-50 text-indigo-700">
                        {item.demand} Botol
                      </span>
                    </td>
                  </tr>

                ))}
              </tbody>
                {console.log(selectedItem)}
                {selectedItem && (
                  <dialog id="my_modal_1" className="modal">
                    <CardCustomers title={selectedItem.name} />
                    <form method="dialog" className="modal-backdrop">
                      <button>close</button>
                    </form>
                  </dialog>
                )}
            </table>
          </div>
        )}
      </div>


    </div>
  );
}