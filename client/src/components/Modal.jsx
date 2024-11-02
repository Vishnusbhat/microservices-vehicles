import React from 'react';

const Modal = ({ vehicle, fromDate, toDate, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
      <div className="bg-gray-900 p-8 rounded-lg shadow-md max-w-lg w-full">
        <h2 className="text-2xl font-bold text-blue-400 mb-4">Booking Details</h2>
        <p className="text-gray-300 mb-2">
          <span className="font-bold text-blue-300">Vehicle:</span> {vehicle.name}
        </p>
        <p className="text-gray-300 mb-2">
          <span className="font-bold text-blue-300">From Date:</span> {fromDate}
        </p>
        <p className="text-gray-300 mb-4">
          <span className="font-bold text-blue-300">To Date:</span> {toDate}
        </p>
        <button
          onClick={onClose}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Modal;
