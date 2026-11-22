import React, { useState, useEffect } from "react";
import { getUserProfile } from "../services/api";
import swal from "../services/swal";
import { useNavigate } from "react-router-dom";

export default function Management() {
  const [activeTab, setActiveTab] = useState("customer");

  // State untuk Form Tambah Toko
  const [customerName, setCustomerName] = useState("");
  const [customerDemand, setCustomerDemand] = useState("");
  const [gmapsLink, setGmapsLink] = useState("");

  // State untuk Form & List User
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState("driver");
  const [usersList, setUsersList] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  const navigate = useNavigate();

  // Ambil daftar user saat tab "user" dibuka
  useEffect(() => {
    if (activeTab === "user") {
      fetchUsers();
    }
  }, [activeTab]);

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const response = await getUserProfile();
      setUsersList(response);
    } catch (err) {
      console.error("Gagal memuat daftar user", err);
    } finally {
      setLoadingUsers(false);
    }
  };

  // Handler Kirim Toko Baru
  const handleAddCustomer = async (e) => {
    e.preventDefault();
    try {
      await api.post("/api/customers", {
        name: customerName,
        demand: parseInt(customerDemand),
        gmaps_link: gmapsLink,
      });
      swal.fire("Sukses", "Toko berhasil ditambahkan!", "success");
      setCustomerName("");
      setCustomerDemand("");
      setGmapsLink("");
    } catch (err) {
      const msg = err.response?.data?.detail || "Gagal menambahkan toko.";
      swal.fire("Gagal", msg, "error");
    }
  };

  // Handler Kirim User Baru
  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      await api.post("/api/admin/users", {
        username: newUsername,
        password: newPassword,
        role: newRole,
      });
      swal.fire("Sukses", "User baru berhasil ditambahkan!", "success");
      setNewUsername("");
      setNewPassword("");
      fetchUsers(); // Refresh daftar user otomatis setelah berhasil menambah
    } catch (err) {
      const msg = err.response?.data?.detail || "Gagal menambahkan user.";
      swal.fire("Gagal", msg, "error");
    }
  };

  return (
    <div className="space-y-4 pb-6">
      <div>
        <h2 className="text-sm font-bold text-slate-900">Panel Manajemen</h2>
        <p className="text-[11px] text-slate-500">
          Kelola data toko, pengguna, dan pengaturan rute logistik.
        </p>
      </div>

      {/* Tab Navigasi */}
      <div className="flex bg-slate-200 p-1 rounded-xl text-xs font-semibold">
        <button
          onClick={() => setActiveTab("customer")}
          className={`flex-1 py-1.5 rounded-lg transition-all ${
            activeTab === "customer"
              ? "bg-white text-indigo-600 shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          Tambah Toko
        </button>
        <button
          onClick={() => setActiveTab("user")}
          className={`flex-1 py-1.5 rounded-lg transition-all ${
            activeTab === "user"
              ? "bg-white text-indigo-600 shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          Manajemen User
        </button>
        <button
          onClick={() => setActiveTab("dispatch")}
          className={`flex-1 py-1.5 rounded-lg transition-all ${
            activeTab === "dispatch"
              ? "bg-white text-indigo-600 shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          Rute / Dispatch
        </button>
      </div>

      {/* TAB 1: TAMBAH TOKO */}
      {activeTab === "customer" && (
        <form
          onSubmit={handleAddCustomer}
          className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-3"
        >
          <h3 className="text-xs font-bold text-slate-800">
            Registrasi Toko Baru
          </h3>
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Nama Toko
            </label>
            <input
              type="text"
              required
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="Contoh: Kios Berkah Tatura"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Demand (Jumlah Botol)
            </label>
            <input
              type="number"
              required
              value={customerDemand}
              onChange={(e) => setCustomerDemand(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="Contoh: 15"
            />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">
              Link Google Maps / Plus Code
            </label>
            <input
              type="text"
              value={gmapsLink}
              onChange={(e) => setGmapsLink(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              placeholder="https://maps.app.goo.gl/..."
            />
          </div>
          <button
            type="submit"
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-sm shadow-indigo-200 transition-all mt-2"
          >
            Simpan Toko
          </button>
        </form>
      )}

      {/* TAB 2: MANAJEMEN USER (TAMBAH & LIST) */}
      {activeTab === "user" && (
        <div className="space-y-4">
          {/* Form Tambah User */}
          <form
            onSubmit={handleAddUser}
            className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-3"
          >
            <h3 className="text-xs font-bold text-slate-800">
              Tambah Akun Driver / Admin
            </h3>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Username
              </label>
              <input
                type="text"
                required
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="Masukkan username"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="••••••••"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Peran (Role)
              </label>
              <select
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="driver">Driver</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <button
              type="submit"
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-sm shadow-indigo-200 transition-all mt-2"
            >
              Simpan User Baru
            </button>
          </form>

          {/* List Daftar User yang Sudah Ditambahkan */}
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-slate-800">
              Daftar Akun Terdaftar
            </h3>
            {loadingUsers ? (
              <p className="text-[11px] text-slate-400 text-center py-4">
                Memuat data...
              </p>
            ) : usersList.length === 0 ? (
              <p className="text-[11px] text-slate-400 text-center py-4">
                Belum ada user terdaftar.
              </p>
            ) : (
              <div className="divide-y divide-slate-100">
                {usersList.map((user) => (
                  <div
                    key={user.id}
                    className="py-2.5 flex items-center justify-between text-xs"
                  >
                    <div>
                      <p className="font-bold text-slate-800">
                        username : {user.username}
                      </p>
                      <span
                        className={`inline-block px-2 py-0.5 mt-0.5 rounded-md text-[10px] font-semibold uppercase ${
                          user.role === "admin"
                            ? "bg-indigo-50 text-indigo-600"
                            : "bg-emerald-50 text-emerald-600"
                        }`}
                      >
                        {user.role}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400">
                      ID: #{user.id}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: RUTE / DISPATCH */}
      {activeTab === "dispatch" && navigate("/dispatch")}
    </div>
  );
}
