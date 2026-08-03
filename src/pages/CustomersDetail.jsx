import React, {useState, useEffect} from 'react'
import { getCustomerById } from '../services/api';
import { useParams } from 'react-router-dom';
import { FaAngleLeft } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

export default function CustomersDetail() {
    const [customer, setCustomer] = useState(null);
    const { id } = useParams();
    const navigate = useNavigate();

    const fetchCustomerDetail = async () => {
        try {
            const data = await getCustomerById(id);
            setCustomer(data);
        } catch (err) {
            console.error(err.message || "Terjadi kesalahan saat memuat data pelanggan.");
        }
    }

    useEffect(() => {
        fetchCustomerDetail();
    }, [])

  return (
    <div>
        <div onClick={() => navigate("/customers")} className="btn mb-3 btn-primary"><FaAngleLeft /> Kembali</div>
        <div className="card bg-base-100 w-full shadow-sm flex-col">
        <div className=" flex flex-col lg:flex-row p-2">
            <figure>
                <img
                src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
                alt="Shoes" className='w-full'/>
            </figure>
            <div className="card-body w-full">
                <h2 className="card-title text-2xl">{customer?.name}</h2>
                <div className="gap-2">
                    <p>Latitude : {customer?.lat}</p>
                    <p>Longitude : {customer?.lon}</p>
                    <p>Estimasi Permintaan : {customer?.demand} Botol</p>
                </div>
                <div className="card-actions justify-end">
                </div>
            </div>
        </div>
        <iframe className='w-full p-2 border-0 rounded-2xl' src={`https://maps.google.com/maps?q=${customer?.lat},${customer?.lon}&z=17&output=embed`} width="600" height="450" loading="lazy" referrerPolicy="strict-origin-when-cross-origin"></iframe>
    </div>
    </div>
  )
}
