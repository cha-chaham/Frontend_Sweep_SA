import axios from "axios";

// Membuat instance axios dengan konfigurasi dasar
const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Handle passcode admin
api.interceptors.request.use((config) => {
  const passcode = localStorage.getItem("admin_passcode");
  if (passcode) {
    config.headers["x-admin-passcode"] = passcode;
  }
  return config;
});

// Fungsi untuk menjalankan optimasi VRP
export const runOptimization = async (customers) => {
  try {
    const response = await api.post("/api/optimize", { customers });
    return response.data;
  } catch (error) {
    const message = error.response?.data?.detail || "Gagal mengambil data optimasi dari server backend.";
    throw new Error(message);
  }
};

// Fungsi untuk mengambil seluruh data pelanggan
export const getCustomers = async () => {
  try {
    const response = await api.get("/api/customers");
    return response.data;
  } catch (error) {
    const message = error.response?.data?.detail || "Gagal mengambil data pelanggan dari database MySQL.";
    throw new Error(message);
  }
};

export const getCustomerById = async (id) => {
  try {
    const response = await api.get(`/api/customers/${id}`);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.detail || "Gagal mengambil data pelanggan dari database MySQL.";
    throw new Error(message);
  }
};

// Tambahkan di dalam src/services/api.js
export const addCustomer = async (formData) => {
  try {
    const response = await api.post("/api/customers", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    const message = error.response?.data?.detail || "Gagal menambahkan pelanggan baru.";
    throw new Error(message);
  }
};

export const deleteCustomer = async (id) => {
  try {
    const response = await api.delete(`/api/customers/${id}`);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.detail || "Gagal menghapus data pelanggan.";
    throw new Error(message);
  }
};

// --- SCHEDULED ROUTES API SERVICES ---

/**
 * Menyimpan dan menjadwalkan hasil optimasi rute (Khusus Admin)
 * @param {Object} routeData - Berisi title, delivery_date, assigned_driver, dan routes_data
 */
export const saveScheduledRoute = async (routeData) => {
  try {
    const response = await api.post("/api/scheduled-routes", routeData);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.detail || "Gagal menyimpan jadwal rute.";
    throw new Error(message);
  }
};

/**
 * Mengambil daftar rute pengiriman khusus untuk hari ini (Untuk Driver / User)
 */
export const getTodaysRoutes = async () => {
  try {
    const response = await api.get("/api/scheduled-routes/today");
    return response.data;
  } catch (error) {
    const message = error.response?.data?.detail || "Gagal memuat rute pengiriman hari ini.";
    throw new Error(message);
  }
};

/**
 * Mengambil seluruh riwayat / history pengiriman sebelumnya
 */
export const getRouteHistory = async () => {
  try {
    const response = await api.get("/api/scheduled-routes/history");
    return response.data;
  } catch (error) {
    const message = error.response?.data?.detail || "Gagal memuat riwayat perjalanan.";
    throw new Error(message);
  }
};

export const getScheduleById = async (id) => {
  try {
    const response = await api.get(`/api/scheduled-routes/${id}`);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.detail || "Gagal memuat detail rute.";
    throw new Error(message);
  }
}