import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import UserInfo from './UserInfo';
import OwnedVehicles from './OwnedVehicles';
import VehicleModal from './VehicleModal';
import AddToListModal from './AddToListModal';
import MyListingsModal from './MyListingsModal'; // Import the new modal

const ProfileView = ({ user }) => {
  const navigate = useNavigate();
  const [ownedVehicles, setOwnedVehicles] = useState([]);
  const [listings, setListings] = useState([]); // State to hold listings
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [addToListModalOpen, setAddToListModalOpen] = useState(false);
  const [myListingsModalOpen, setMyListingsModalOpen] = useState(false);

  const fetchOwnedVehicles = async () => {
    if (!user) return;
    try {
      const response = await axios.get(`http://localhost:3000/vehicle/owner/${user._id}`, {
        headers: {
          Authorization: `${localStorage.getItem('token')}`,
        },
      });
      setOwnedVehicles(response.data);
    } catch (error) {
      console.error('Error fetching owned vehicles:', error);
    }
  };

  const fetchListings = async () => {
    if (!user) return;
    try {
      const response = await axios.get(`http://localhost:3000/vehicle/listings/${user._id}`, {
        headers: {
          Authorization: `${localStorage.getItem('token')}`,
        },
      });
      setListings(response.data);
    } catch (error) {
      console.error('Error fetching listings:', error);
    }
  };

  const handleDeleteListing = async (vehicleID) => {
    try {
      await axios.delete(`http://localhost:3000/vehicle/list/${vehicleID}`, {
        headers: {
          Authorization: `${localStorage.getItem('token')}`,
        },
      });
      fetchListings(); // Refresh listings after deletion
    } catch (error) {
      console.error('Error deleting listing:', error);
    }
  };

  useEffect(() => {
    fetchOwnedVehicles();
  }, [user]);

  const handleVehicleClick = (vehicle) => {
    setSelectedVehicle(vehicle);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedVehicle(null);
  };

  const handleAddToListClick = () => {
    setAddToListModalOpen(true);
  };

  const handleCloseAddToListModal = () => {
    setAddToListModalOpen(false);
  };

  const handleMyListingsClick = async () => {
    await fetchListings(); // Fetch listings every time the button is pressed
    setMyListingsModalOpen(true);
  };

  const handleCloseMyListingsModal = () => {
    setMyListingsModalOpen(false);
  };

  if (!user) {
    return (
      <div className="bg-gray-800 p-6 rounded-lg shadow-md max-w-lg mx-auto text-white">
        <h2 className="text-3xl font-bold mb-4">User Profile</h2>
        <p>No user data available.</p>
        <button 
          onClick={() => navigate('/login')} 
          className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
        >
          Login
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 text-gray-300 p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-blue-400 mb-6">User Profile</h2>
      <UserInfo user={user} />

      <div className="mt-6 mb-4 flex space-x-4">
        <button 
          onClick={handleAddToListClick} 
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
        >
          Add Vehicle to List
        </button>
        <button 
          onClick={handleMyListingsClick}
          className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-700 transition"
        >
          My Listings
        </button>
      </div>
      
      <div className="mt-4">
        <h3 className="text-xl font-semibold text-gray-200 mb-2">Owned Vehicles</h3>
        <OwnedVehicles vehicles={ownedVehicles} onVehicleClick={handleVehicleClick} />
      </div>
      
      {modalOpen && (
        <VehicleModal 
          vehicle={selectedVehicle} 
          onClose={handleCloseModal} 
          onVehicleUpdate={fetchOwnedVehicles}
        />
      )}
      
      {addToListModalOpen && (
        <AddToListModal 
          vehicles={ownedVehicles}
          userId={user._id}
          onClose={handleCloseAddToListModal} 
          onAddToList={fetchOwnedVehicles}
        />
      )}

      {myListingsModalOpen && (
        <MyListingsModal 
          listings={listings}
          onClose={handleCloseMyListingsModal} 
          onDelete={handleDeleteListing} 
        />
      )}
    </div>
  );
};

export default ProfileView;
