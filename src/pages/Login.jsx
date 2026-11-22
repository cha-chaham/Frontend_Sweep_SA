import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Sesuaikan URL backend Anda jika port-nya berbeda (misal: http://localhost:8000)
      const response = await axios.post("http://localhost:8000/api/login", {
        username,
        password,
      });

      // Simpan token akses dan role ke localStorage
      localStorage.setItem("token", response.data.access_token);
      localStorage.setItem("role", response.data.role);

      // Arahkan kembali ke halaman utama (Dashboard)
      navigate("/");
    } catch (err) {
      // Menangkap pesan error dari backend FastAPI
      const errorMsg =
        err.response?.data?.detail ||
        "Gagal terhubung ke server atau autentikasi salah.";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center h-full px-2 py-8">
      {/* Logo & Header */}
      <div className="text-center mb-6">
        <h2 className="text-base font-bold text-slate-900">
          Masuk ke Akun Anda
        </h2>
        <p className="text-[11px] text-slate-500 mt-0.5">
          Sistem Perutean UMKM Air Tahu Gurih
        </p>
      </div>

      {/* Form Login */}
      <form onSubmit={handleLogin} className="space-y-4">
        {error && (
          <div className="p-3 text-xs text-red-600 bg-red-50 border border-red-100 rounded-xl leading-relaxed">
            {error}
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Username
          </label>
          <input
            type="text"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
            placeholder="Masukkan username admin/driver"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Password
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-sm shadow-indigo-200 transition-all disabled:opacity-50 mt-2"
        >
          {loading ? "Memproses..." : "Masuk"}
        </button>
      </form>
    </div>
  );
}
