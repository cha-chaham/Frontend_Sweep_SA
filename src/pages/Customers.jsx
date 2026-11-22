import React, { useState, useEffect } from "react";
import { getCustomers, addCustomer, deleteCustomer } from "../services/api";
import { useNavigate } from "react-router-dom";
import swal from "../services/swal";

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [role, setRole] = useState(localStorage.getItem("role") || "user");

  const [inputCode, setInputCode] = useState("");

  const Navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    gmaps_link: "",
    demand: "",
    image: null,
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

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      // Bungkus data ke dalam FormData untuk mendukung file upload
      const dataToSend = new FormData();
      dataToSend.append("name", formData.name);
      dataToSend.append("gmaps_link", formData.gmaps_link);
      dataToSend.append("demand", formData.demand);
      if (formData.image) {
        dataToSend.append("image", formData.image);
      }

      await addCustomer(dataToSend);

      // Reset form
      setFormData({ name: "", gmaps_link: "", demand: "", image: null });
      await fetchCustomerData();
      setSuccessMessage("Pelanggan berhasil ditambahkan!");
      setTimeout(() => setSuccessMessage(null), 3000); // Hapus pesan sukses setelah 3 detik
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
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Titik Pelanggan Kota Palu
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Kelola titik pelanggan dan unggah foto lokasi secara manual
          </p>
        </div>
        <div className="text-sm font-medium text-slate-600 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
          Total Pelanggan:{" "}
          <span className="font-bold text-indigo-600">
            {customers.length} Toko
          </span>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 px-5 py-4 rounded-2xl text-sm">
          {error}
        </div>
      )}

      {/* Success Alert */}
      {successMessage && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-5 py-4 rounded-2xl text-sm">
          {successMessage}
        </div>
      )}

      {/* Tabel Data Pelanggan */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-sm">
            Memuat data pelanggan dari database MySQL...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 text-slate-500 text-xs font-semibold uppercase tracking-wider border-b border-slate-100">
                  <th className="py-3.5 px-6">#</th>
                  <th className="py-3.5 px-6">Nama Toko</th>
                  <th className="py-3.5 px-6">Koordinat (Lat, Lon)</th>
                  <th className="py-3.5 px-6 text-center">Permintaan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                {customers.map((c, index) => (
                  <tr
                    key={c.id}
                    onClick={() => Navigate(`/customers/${c.id}`)}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="py-4 px-6 font-semibold text-slate-900">
                      {index + 1}
                    </td>
                    <td className="py-4 px-6 font-medium text-slate-900">
                      {c.name}
                    </td>
                    <td className="py-4 px-6 font-mono text-xs text-slate-600">
                      {c.lat}, {c.lon}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-indigo-50 text-indigo-700">
                        {c.demand} Botol
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
