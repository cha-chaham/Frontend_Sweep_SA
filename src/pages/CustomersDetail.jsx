import React, { useState, useEffect } from "react";
import { getCustomerById } from "../services/api";
import { useParams } from "react-router-dom";
import { FaAngleLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { deleteCustomer } from "../services/api";

export default function CustomersDetail() {
  const [customer, setCustomer] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [role, setRole] = useState(localStorage.getItem("role") || "user");

  const fetchCustomerDetail = async () => {
    try {
      const data = await getCustomerById(id);
      setCustomer(data);
    } catch (err) {
      console.error(
        err.message || "Terjadi kesalahan saat memuat data pelanggan.",
      );
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus toko "${name}"?`)) {
      try {
        setError(null);
        await deleteCustomer(id);
        setSuccessMessage(`Toko "${name}" berhasil dihapus.`);
        setTimeout(() => {
          setSuccessMessage(null);
          navigate("/customers");
        }, 2000);
      } catch (err) {
        setError(err.message);
      }
    }
  };

  useEffect(() => {
    fetchCustomerDetail();
  }, []);

  return (
    <div>
      <div
        onClick={() => navigate("/customers")}
        className="btn mb-3 btn-primary"
      >
        <FaAngleLeft /> Kembali
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
      <div className="card bg-base-100 w-full shadow-sm flex-col">
        <div className=" flex flex-col lg:flex-row p-2">
          <figure className="w-full">
            <img
              className="rounded-xl w-full object-cover"
              src={
                customer?.image_url
                  ? `http://127.0.0.1:8000${customer.image_url}`
                  : "/non-toko.png"
              }
              alt={customer?.name}
              className="w-full"
            />
          </figure>
          <div className="card-body w-full">
            <h2 className="card-title text-2xl">{customer?.name}</h2>
            <div className="gap-2">
              <p>Latitude : {customer?.lat}</p>
              <p>Longitude : {customer?.lon}</p>
              <p>Estimasi Permintaan : {customer?.demand} Botol</p>
            </div>
            <div className="card-actions justify-end"></div>
          </div>
          {role === "admin" && (
            <div>
              <div
                className="btn btn-error text-white px-6"
                onClick={() => handleDelete(customer.id, customer.name)}
              >
                Delete
              </div>
            </div>
          )}
        </div>
        <iframe
          className="w-full p-2 border-0 rounded-2xl"
          src={`https://maps.google.com/maps?q=${customer?.lat},${customer?.lon}&z=17&output=embed`}
          width="600"
          height="450"
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
        ></iframe>
      </div>
    </div>
  );
}
