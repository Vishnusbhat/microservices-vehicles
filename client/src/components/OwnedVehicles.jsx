import React from 'react';
import VehicleCard from './VehicleCard';

const OwnedVehicles = ({ vehicles, onVehicleClick }) => (
  <div className="mb-6">
    <h3 className="text-2xl font-bold text-blue-400 mb-4">Owned Vehicles</h3>
    {vehicles.length > 0 ? (
      <div className="grid gap-6 sm:grid-cols-2">
        {vehicles.map((vehicle) => (
          <div key={vehicle._id} onClick={() => onVehicleClick(vehicle)}>
            <VehicleCard vehicle={vehicle} />
          </div>
        ))}
      </div>
    ) : (
      <p>No vehicles owned by this user.</p>
    )}
  </div>
);

export default OwnedVehicles;
