// MainContent.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AddVehicleForm from './AddVehicleForm';
import ProfileView from './ProfileView';
import VehicleCard from './VehicleCard';
import ListingModal from './ListingModal';

const MainContent = ({ selectedOption, setSelectedVehicle, user, fromDate, toDate }) => {
  const [listings, setListings] = useState([]);
  const [selectedListing, setSelectedListing] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await axios.get('http://43.204.212.234:3000/vehicle/list'); // Adjust to your actual endpoint
        setListings(response.data);
      } catch (error) {
        console.error('Error fetching listings:', error);
      }
    };

    if (selectedOption === 'vehicles' || selectedOption === 'home') {
      fetchListings();
    }
  }, [selectedOption]);

  const handleListingClick = (listing) => {
    setSelectedListing(listing); // Set selected listing
  };

  const handleBook = () => {
    console.log("Booking confirmed for", selectedListing.name);
    setSelectedListing(null); // Close modal after booking
  };

  const handleCloseModal = () => {
    setSelectedListing(null); // Close modal
  };

  return (
    <main className="col-span-10 p-6 flex flex-col">
      {selectedOption === 'home' && (
        <div>
          <h2 className="text-3xl font-bold mb-6 lg:ml-40 md:ml-40">Home</h2>
          {!user ? (
            <div className="text-center">
              <p className="mb-4 text-lg">Please log in to book vehicles.</p>
              <button 
                className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600"
                onClick={() => navigate('/login')}
              >
                Login
              </button>
            </div>
          ) : (
            <div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4 lg:ml-40 md:ml-40">
              {listings
                .filter((listing) => listing.userID && user._id && listing.userID.toString() !== user._id.toString())
                .map((listing) => (
                  <div 
                    key={listing._id} 
                    className="p-4 bg-gray-800 text-white rounded-lg shadow-md hover:bg-gray-700 cursor-pointer"
                    onClick={() => handleListingClick(listing)}
                  >
                    <h3 className="text-xl font-bold">{listing.name}</h3>
                    <p>Location: {listing.location}</p>
                    <p>Price: ${listing.price} / day</p>
                    <p>Max Speed: {listing.maxSpeed || '100'} km/h</p>
                  </div>
                ))}

              </div>
            </div>
          )}
        </div>
      )}

      {selectedOption === 'vehicles' && (
        <div>
          <h2 className="text-3xl font-bold mb-6 lg:ml-40 md:ml-40">Available Vehicles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:ml-40 md:ml-40">
            {listings.map((listing) => (
              <VehicleCard
                key={listing._id}
                vehicle={listing}
                setSelectedVehicle={setSelectedVehicle}
              />
            ))}
          </div>
        </div>
      )}

      {selectedOption === 'addVehicle' && <AddVehicleForm />}
      {selectedOption === 'profile' && <ProfileView user={user} />}
      {selectedOption === 'bookings' && (
        <div>
          <h2 className="text-3xl font-bold mb-6">Bookings</h2>
          <p>List of bookings will be shown here.</p>
        </div>
      )}

      {selectedListing && (
        <ListingModal
          listing={selectedListing}
          fromDate={fromDate}
          toDate={toDate}
          onClose={handleCloseModal}
          onBook={handleBook}
        />
      )}
    </main>
  );
};

export default MainContent;
