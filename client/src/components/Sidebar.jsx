// Sidebar.js
import React, { useState } from 'react';
import { FiChevronRight, FiChevronLeft } from 'react-icons/fi';

const Sidebar = ({ fromDate, setFromDate, toDate, setToDate }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Set default dates
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  // Initialize the default date values for fromDate and toDate
  const [initialFromDate, setInitialFromDate] = useState(today);
  const [initialToDate, setInitialToDate] = useState(tomorrow);

  return (
    <div>
      {/* Toggle Button for Mobile */}
      <button
        className="fixed bottom-4 left-4 z-20 text-white bg-blue-500 p-2 rounded-full md:hidden"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <FiChevronLeft size={20} /> : <FiChevronRight size={20} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 bg-gray-800 p-6 text-white transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:block w-64 z-10`}
      >
        <h2 className="text-xl font-semibold mb-4">Select Date Range</h2>

        <div className="mb-4">
          <label className="block mb-2">From</label>
          <input
            type="date"
            value={fromDate || initialFromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="w-full bg-gray-700 text-white rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block mb-2">To</label>
          <input
            type="date"
            value={toDate || initialToDate}
            onChange={(e) => setToDate(e.target.value)}
            className="w-full bg-gray-700 text-white rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Close Button on Mobile */}
        <button
          onClick={() => setIsSidebarOpen(false)}
          className="text-white bg-red-500 p-2 mt-4 rounded md:hidden"
        >
          Close
        </button>
      </aside>
    </div>
  );
};

export default Sidebar;
