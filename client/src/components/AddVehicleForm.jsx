import React, { useState } from 'react';
import axios from 'axios';

const AddVehicleForm = () => {
  const [newVehicle, setNewVehicle] = useState({
    name: '',
    model: '',
    year: '',
    numberPlate: '',
    brand: '',
    color: ''
  });

  const addVehicleHandler = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token'); // Retrieve token from local storage

    try {
      const response = await axios.post('http://43.204.212.234:3000/vehicle', newVehicle, {
        headers: {
          Authorization: `${token}`, // Include token in the request headers
        },
      });

      alert("Vehicle added successfully!");
      // Reset form fields
      setNewVehicle({ name: '', model: '', year: '', color: '', numberPlate: '', brand: '' });
    } catch (error) {
      // Handle error responses
      console.error("Error adding vehicle:", error.message);
      alert("An error occurred while adding the vehicle.");
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-md w-full sm:w-3/4 md:w-1/2 lg:w-1/3 mx-auto">
      <h2 className="text-3xl font-bold mb-6">Add Vehicle</h2>
      <form className="space-y-4" onSubmit={addVehicleHandler}>
        {Object.keys(newVehicle).map((key) => (
          <div key={key}>
            <label className="block mb-2">{key.charAt(0).toUpperCase() + key.slice(1)}</label>
            <input
              type={key === 'year' ? 'number' : 'text'}
              value={newVehicle[key]}
              onChange={(e) => setNewVehicle({ ...newVehicle, [key]: e.target.value })}
              className="w-full bg-gray-700 text-white rounded p-2 focus:outline-none"
              required
            />
          </div>
        ))}
        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Add Vehicle
        </button>
      </form>
    </div>
  );
};

export default AddVehicleForm;
