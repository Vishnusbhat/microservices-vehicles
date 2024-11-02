import React from 'react';

const VehicleCard = ({ vehicle, setSelectedVehicle }) => {
  return (
    <div
      onClick={() => setSelectedVehicle(vehicle)}
      className="cursor-pointer bg-gray-800 p-6 rounded-lg shadow-md hover:bg-gray-700"
    >
      <h3 className="text-2xl font-semibold mb-2">{vehicle.name}</h3>
      <p>Model: {vehicle.model}</p>
      <p>Year: {vehicle.year}</p>
      <p>Color: {vehicle.color}</p>
    </div>
  );
};

export default VehicleCard;
