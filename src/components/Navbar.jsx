import React from "react";
import { NavLink } from "react-router-dom";

export default function Navbar() {
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
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-sm shadow-indigo-200">
            TG
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 block leading-none">
              Tahu Gurih
            </span>
            <h1 className="text-xs font-bold text-slate-900 leading-tight mt-0.5">
              Logistik
            </h1>
          </div>
        </div>

        {/* Navigasi Menu Mobile */}
        <nav className="flex space-x-1">
          <NavLink to="/" className={linkClass}>
            Home
          </NavLink>
          <NavLink to="/customers" className={linkClass}>
            Toko
          </NavLink>
        </nav>
      </div>
    </header>
  );
}