import React, { useState } from 'react';
import axios from 'axios';

const VehicleModal = ({ vehicle, onClose, onVehicleUpdate }) => {
  const [editedVehicle, setEditedVehicle] = useState(vehicle);

  const handleEditVehicle = async () => {
    if (!editedVehicle.name || !editedVehicle.model || !editedVehicle.brand || !editedVehicle.year) {
      console.error('Please fill in all required fields.');
      return;
    }

    const token = localStorage.getItem('token');
    try {
      await axios.put(
        `http://43.204.212.234:3000/vehicle/${vehicle._id}`,
        editedVehicle,
        { headers: { Authorization: token } }
      );
      onVehicleUpdate(); // Refresh vehicle data
      onClose(); // Close modal after successful edit
    } catch (error) {
      console.error('Error updating vehicle:', error.response ? error.response.data : error.message);
    }
  };

  const handleDeleteVehicle = async () => {
    try {
      await axios.delete(`http://43.204.212.234:3000/vehicle/${vehicle._id}`, {
        headers: {
          Authorization: `${localStorage.getItem('token')}`,
        },
      });
      onVehicleUpdate();
      onClose();
    } catch (error) {
      console.error('Error deleting vehicle:', error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 text-black bg-opacity-75 z-50">
      <div className="bg-gray-900 p-8 rounded-lg shadow-md max-w-lg w-full">
        <h2 className="text-3xl font-bold text-blue-400 mb-6">Edit Vehicle</h2>
        
        <input 
          type="text" 
          value={editedVehicle.name || ''} 
          onChange={(e) => setEditedVehicle({ ...editedVehicle, name: e.target.value })} 
          placeholder="Vehicle Name" 
          className="mb-2 p-2 border border-gray-600 rounded w-full bg-gray-800 text-gray-300"
        />
        <input 
          type="text" 
          value={editedVehicle.model || ''} 
          onChange={(e) => setEditedVehicle({ ...editedVehicle, model: e.target.value })} 
          placeholder="Model" 
          className="mb-2 p-2 border border-gray-600 rounded w-full bg-gray-800 text-gray-300"
        />
        <input 
          type="text" 
          value={editedVehicle.brand || ''} 
          onChange={(e) => setEditedVehicle({ ...editedVehicle, brand: e.target.value })} 
          placeholder="Brand" 
          className="mb-2 p-2 border border-gray-600 rounded w-full bg-gray-800 text-gray-300"
        />
        <input 
          type="number" 
          value={editedVehicle.year || ''} 
          onChange={(e) => setEditedVehicle({ ...editedVehicle, year: Number(e.target.value) })} 
          placeholder="Year" 
          className="mb-2 p-2 border border-gray-600 rounded w-full bg-gray-800 text-gray-300"
        />
        <input 
          type="text" 
          value={editedVehicle.numberPlate || ''} 
          onChange={(e) => setEditedVehicle({ ...editedVehicle, numberPlate: e.target.value })} 
          placeholder="Number Plate" 
          className="mb-2 p-2 border border-gray-600 rounded w-full bg-gray-800 text-gray-300"
        />
        <input 
          type="text" 
          value={editedVehicle.color || ''} 
          onChange={(e) => setEditedVehicle({ ...editedVehicle, color: e.target.value })} 
          placeholder="Color" 
          className="mb-4 p-2 border border-gray-600 rounded w-full bg-gray-800 text-gray-300"
        />
        {/* Owner field set to read-only */}
        <input 
          type="text" 
          value={editedVehicle.owner || ''} 
          readOnly 
          placeholder="Owner ID" 
          className="mb-4 p-2 border border-gray-600 rounded w-full bg-gray-800 text-gray-300 cursor-not-allowed"
        />
        
        <div className="flex justify-between mt-4">
          <button
            onClick={handleEditVehicle}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
          >
            Save Changes
          </button>
          <button
            onClick={handleDeleteVehicle}
            className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700 transition"
          >
            Delete
          </button>
          <button 
            onClick={onClose} 
            className="bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default VehicleModal;
