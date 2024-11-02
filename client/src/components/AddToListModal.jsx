import React, { useState } from 'react';
import axios from 'axios';

const AddToListModal = ({ vehicles, onClose, onAddToList, userId }) => {
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [cost, setCost] = useState('');
  const [location, setLocation] = useState('');
  const [maxSpeed, setMaxSpeed] = useState('');

  const handleAddToList = async () => {
    if (!selectedVehicle || !cost || !location || !maxSpeed) {
      console.error('Please fill in all fields.');
      return;
    }

    const token = localStorage.getItem('token');
    try {
      const response = await axios.post(
        `http://localhost:3000/vehicle/list/${selectedVehicle}`,
        {
          price: cost,
          location: location,
          maxSpeed: maxSpeed,
          userID: userId, // Include the userID in the request body
        },
        { headers: { Authorization: token } }
      );

      console.log('Response:', response.data);
      onAddToList(); // Refresh the vehicle list or perform other actions after adding
      onClose(); // Close the modal after successful addition
    } catch (error) {
      console.error('Error adding vehicle to the list:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50 p-4">
      <div className="bg-gray-900 p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold text-blue-400 mb-4">Add Vehicle to List</h2>
        
        <select 
          value={selectedVehicle} 
          onChange={(e) => setSelectedVehicle(e.target.value)} 
          className="mb-4 p-2 border border-gray-600 rounded w-full bg-gray-800 text-gray-300 overflow-hidden"
          style={{ maxWidth: '100%' }} // Ensure it does not overflow
        >
          <option value="" disabled>Select a vehicle</option>
          {vehicles.map((vehicle) => (
            <option key={vehicle._id} value={vehicle._id}>{vehicle.name} - {vehicle.model}</option>
          ))}
        </select>
        
        <input 
          type="number" 
          value={cost} 
          onChange={(e) => setCost(e.target.value)} 
          placeholder="Cost" 
          className="mb-4 p-2 border border-gray-600 rounded w-full bg-gray-800 text-gray-300"
        />
        
        <input 
          type="text" 
          value={location} 
          onChange={(e) => setLocation(e.target.value)} 
          placeholder="Location" 
          className="mb-4 p-2 border border-gray-600 rounded w-full bg-gray-800 text-gray-300"
        />
        
        <input 
          type="text" 
          value={maxSpeed} 
          onChange={(e) => setMaxSpeed(e.target.value)} 
          placeholder="Max Speed" 
          className="mb-4 p-2 border border-gray-600 rounded w-full bg-gray-800 text-gray-300"
        />
        
        <div className="flex justify-between">
          <button
            onClick={handleAddToList}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 transition w-full mr-2"
          >
            Add to List
          </button>
          <button 
            onClick={onClose} 
            className="bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700 transition w-full"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddToListModal;
