// ListingModal.js
import React, { useMemo } from 'react';

const ListingModal = ({ listing, fromDate, toDate, onClose, onBook }) => {
  // Calculate total cost based on the number of days
  const totalCost = useMemo(() => {
    if (!fromDate || !toDate) return 0;
    const diffTime = Math.abs(new Date(toDate) - new Date(fromDate));
    const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
    return days * listing.price;
  }, [fromDate, toDate, listing.price]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
        {console.log(fromDate)}
      <div className="bg-gray-900 text-gray-300 p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-blue-400 mb-4">{listing.name}</h2>
        <p><span className="font-bold text-blue-300">Location:</span> {listing.location}</p>
        <p><span className="font-bold text-blue-300">Max Speed:</span> {listing.maxSpeed} km/h</p>
        <p><span className="font-bold text-blue-300">Price per Day:</span> ${listing.price}</p>
        <p><span className="font-bold text-blue-300">Total Cost:</span> ${totalCost}</p>
        <div className="mt-6 flex space-x-4">
          <button onClick={onBook} className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 transition">
            Book
          </button>
          <button onClick={onClose} className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700 transition">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ListingModal;
