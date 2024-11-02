import React from 'react';

const MyListingsModal = ({ listings, onClose, onDelete }) => {
  const handleDelete = (vehicleID) => {
    if (window.confirm("Are you sure you want to delete this listing?")) {
      onDelete(vehicleID);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
      <div className="bg-gray-900 p-8 rounded-lg shadow-md max-w-lg w-full">
        <h2 className="text-2xl font-bold text-blue-400 mb-4">My Listings</h2>
        {listings.length === 0 ? (
          <p className="text-gray-300">No listings available.</p>
        ) : (
          <ul className="space-y-2">
            {listings.map((listing) => (
              <li key={listing._id} className="flex justify-between items-center">
                <span className="text-gray-300">{listing.name} - {listing.price}</span>
                <button
                  onClick={() => handleDelete(listing.vehicleID)}
                  className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-700 transition"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
        <div className="flex justify-end mt-4">
          <button 
            onClick={onClose} 
            className="bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyListingsModal;
