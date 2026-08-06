import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Customers from "./pages/Customers";
import CustomersDetail from "./pages/CustomersDetail";
import AdminDispatch from "./pages/AdminDispatch";
import RouteDetails from "./pages/RoutesDetails";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
        <Navbar />
        <main className="p-6 md:p-10 max-w-7xl mx-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/customers/:id" element={<CustomersDetail />} />
            <Route path="/dispatch" element={<AdminDispatch />} />
            <Route path="/schedule/:id" element={<RouteDetails />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}