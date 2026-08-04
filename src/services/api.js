import axios from "axios";

// Membuat instance axios dengan konfigurasi dasar
const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Fungsi untuk menjalankan optimasi VRP
export const runOptimization = async () => {
  try {
    const response = await api.post("/api/optimize");
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