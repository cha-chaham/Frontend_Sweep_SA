import React from "react";
import { NavLink } from "react-router-dom";

export default function Navbar() {
  const linkClass = ({ isActive }) =>
    `px-4 py-2 rounded-xl text-sm font-medium transition-all ${
      isActive
        ? "bg-indigo-600 text-white shadow-sm shadow-indigo-100"
        : "text-slate-600 hover:bg-slate-100"
    };`;

  return (
    <header className="bg-white border-b border-slate-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold shadow-sm shadow-indigo-200">
            TG
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 block">Air Tahu Gurih</span>
            <h1 className="text-sm font-bold text-slate-900 leading-tight">Logistik Palu</h1>
          </div>
        </div>
        <nav className="flex space-x-2">
          <NavLink to="/" className={linkClass}>Dashboard Optimasi</NavLink>
          <NavLink to="/customers" className={linkClass}>Data Pelanggan</NavLink>
        </nav>
      </div>
    </header>
  );
}