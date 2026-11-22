import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Customers from "./pages/Customers";
import CustomersDetail from "./pages/CustomersDetail";
import AdminDispatch from "./pages/AdminDispatch";
import RouteDetails from "./pages/RoutesDetails";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Management from "./pages/Management";

export default function App() {
  return (
    <BrowserRouter>
      {/* Latar belakang luar (hanya terlihat di layar desktop/laptop) */}

      {/* Bingkai Container Mobile */}
      <div className="w-full md:w-3/4 m-auto py-5 px-4">
        {/* Navbar di bagian atas frame */}
        <Navbar />

        {/* Area Konten Utama yang dapat di-scroll vertikal */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-20">
          <Routes>
            <Route path="/login" element={<Login />} />

            <Route element={<ProtectedRoute allowedRole="admin" />}>
              <Route path="/dispatch" element={<AdminDispatch />} />
              <Route path="/management" element={<Management />} />
            </Route>

            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/customers/:id" element={<CustomersDetail />} />
              <Route path="/schedule/:id" element={<RouteDetails />} />
            </Route>
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
