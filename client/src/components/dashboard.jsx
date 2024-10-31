import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from '../context/userContext'; // Adjust the path as necessary

const Dashboard = () => {
  const [vehicles, setVehicles] = useState([]);
  const [selectedOption, setSelectedOption] = useState('home'); 
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const { user } = useUser(); // Access user data from useUser hook

  useEffect(() => {
    if (selectedOption === 'vehicles') {
      const fetchVehicles = async () => {
        try {
          const response = await axios.get('http://localhost:3002/vehicle');
          setVehicles(response.data);
        } catch (error) {
          console.error('Error fetching vehicles:', error);
        }
      };
      fetchVehicles();
    }
  }, [selectedOption]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white">
      <nav className="bg-gray-800 p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <ul className="flex space-x-4">
          <li>
            <button
              onClick={() => setSelectedOption('home')}
              className={`hover:text-blue-400 ${selectedOption === 'home' && 'text-blue-400'}`}
            >
              Home
            </button>
          </li>
          <li>
            <button
              onClick={() => setSelectedOption('vehicles')}
              className={`hover:text-blue-400 ${selectedOption === 'vehicles' && 'text-blue-400'}`}
            >
              Vehicles
            </button>
          </li>
          <li>
            <button
              onClick={() => setSelectedOption('profile')}
              className={`hover:text-blue-400 ${selectedOption === 'profile' && 'text-blue-400'}`}
            >
              Profile
            </button>
          </li>
          <li>
            <button
              onClick={() => setSelectedOption('bookings')}
              className={`hover:text-blue-400 ${selectedOption === 'bookings' && 'text-blue-400'}`}
            >
              Bookings
            </button>
          </li>
        </ul>
      </nav>

      <div className="grid grid-cols-12 flex-1">
        <aside className="col-span-2 bg-gray-800 p-6">
          <h2 className="text-xl font-semibold mb-4">Select Date Range</h2>
          <label className="block mb-2">From</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="w-full bg-gray-700 text-white rounded p-2 mb-4 focus:outline-none"
          />
          <label className="block mb-2">To</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="w-full bg-gray-700 text-white rounded p-2 focus:outline-none"
          />
        </aside>

        <main className="col-span-10 p-6">
          {selectedOption === 'home' && (
            <div>
              <h2 className="text-3xl font-bold mb-6">Home</h2>
              <p>Welcome to the dashboard home section.</p>
            </div>
          )}
          {selectedOption === 'vehicles' && (
            <div>
              <h2 className="text-3xl font-bold mb-6">Available Vehicles</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {vehicles.map((vehicle) => (
                  <div key={vehicle._id} className="bg-gray-800 p-6 rounded-lg shadow-md">
                    <h3 className="text-2xl font-semibold mb-2">{vehicle.name}</h3>
                    <p>Model: {vehicle.model}</p>
                    <p>Year: {vehicle.year}</p>
                    <p>Color: {vehicle.color}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          {selectedOption === 'profile' && user && (
            <div>
              <h2 className="text-3xl font-bold mb-6">Profile</h2>
              <p>Name: {user.name}</p>
              <p>Email: {user.email}</p>
              <p>Role: {user.role}</p>
            </div>
          )}
          {selectedOption === 'bookings' && (
            <div>
              <h2 className="text-3xl font-bold mb-6">Bookings</h2>
              <p>Your bookings will be displayed here.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
