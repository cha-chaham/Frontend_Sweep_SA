import React, { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [token, setToken] = useState(localStorage.getItem("token"));
  const [role, setRole] = useState(localStorage.getItem("role"));
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Sinkronisasi status login setiap kali rute/halaman berubah
  useEffect(() => {
    setToken(localStorage.getItem("token"));
    setRole(localStorage.getItem("role"));
    setDropdownOpen(false); // Tutup dropdown otomatis saat pindah halaman
  }, [location]);

  // Menutup dropdown jika pengguna mengklik di luar area menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setToken(null);
    setRole(null);
    setDropdownOpen(false);
    navigate("/login");
  };

  const linkClass = ({ isActive }) =>
    `px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
      isActive
        ? "bg-indigo-600 text-white shadow-sm shadow-indigo-100"
        : "text-slate-600 hover:bg-slate-100"
    }`;

  return (
    <header className="bg-white border-b border-slate-100 sticky top-0 z-50 shrink-0">
      <div className="px-4 h-14 flex items-center justify-between">
        {/* Logo & Brand */}
        <div className="flex h-full items-center">
          <img
            className="w-32 md:w-48 object-contain"
            src="/logo-horizontal.png"
            alt="Logo"
          />
        </div>

        {/* Navigasi & Menu Akun */}
        <div className="flex items-center space-x-3">
          <nav className="flex space-x-1">
            <NavLink to="/" className={linkClass}>
              Home
            </NavLink>
            <NavLink to="/customers" className={linkClass}>
              Toko
            </NavLink>
            {role === "admin" && (
              <NavLink to="/management" className={linkClass}>
                Manajemen
              </NavLink>
            )}
          </nav>

          <div className="h-5 w-px bg-slate-200"></div>

          {/* Tombol Icon User dengan Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition-colors focus:outline-none"
              title="Menu Akun"
            >
              {/* Icon User SVG */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </button>

            {/* Kotak Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-100 rounded-2xl shadow-xl py-2 z-50 text-xs">
                {token ? (
                  <>
                    {/* Informasi Role */}
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                        Masuk Sebagai
                      </p>
                      <p className="font-bold text-slate-800 capitalize mt-0.5">
                        {role || "User"}
                      </p>
                    </div>
                    {/* Tombol Keluar */}
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2.5 text-red-600 hover:bg-red-50 font-semibold transition-colors mt-1"
                    >
                      Keluar
                    </button>
                  </>
                ) : (
                  /* Tombol Masuk jika belum login */
                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      navigate("/login");
                    }}
                    className="w-full text-left px-4 py-2.5 text-indigo-600 hover:bg-indigo-50 font-semibold transition-colors"
                  >
                    Masuk (Login)
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
