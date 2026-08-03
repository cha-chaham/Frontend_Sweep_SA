import React from 'react'

const CardCustomers = ({title, address, latitude, longitude}) => {
  return (
    <div className="card bg-base-100 w-96 shadow-sm">
  <figure>
    <img
      src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
      alt="Shoes" />
  </figure>
  <div className="card-body">
    <h2 className="card-title">{title}</h2>
    <p>{address}</p>
    <p>Latitude: {latitude}, Longitude: {longitude}</p>
    <div className="card-actions justify-end">
      <button className="btn btn-primary">Go To Maps</button>
    </div>
  </div>
</div>
  )
}

export default CardCustomers