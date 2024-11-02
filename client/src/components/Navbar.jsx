import React, { useState } from 'react';
import { FiMenu, FiX } from 'react-icons/fi'; // Import both menu and close icons

const Navbar = ({ setSelectedOption, selectedOption }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-gray-800 p-4 flex justify-between items-center relative">
      <h1 className="text-2xl font-bold text-white">Dashboard</h1>

      {/* Mobile menu icon */}
      <button 
        className="text-white md:hidden" 
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      {/* Full-screen mobile menu overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-95 flex flex-col justify-center items-center z-50">
          <button 
            className="absolute top-4 right-4 text-white" 
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <FiX size={24} />
          </button>
          <ul className="flex flex-col space-y-4">
            {['home', 'addVehicle', 'vehicles', 'profile', 'bookings'].map((option) => (
              <li key={option}>
                <button
                  onClick={() => {
                    setSelectedOption(option);
                    setIsMobileMenuOpen(false); // Close menu on selection in mobile view
                  }}
                  className={`text-white hover:text-blue-400 text-2xl`}
                >
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Desktop navigation links */}
      <div className="hidden md:flex md:space-x-6">
        {['home', 'addVehicle', 'vehicles', 'profile', 'bookings'].map((option) => (
          <button
            key={option}
            onClick={() => setSelectedOption(option)}
            className={`text-white hover:text-blue-400 text-lg`}
          >
            {option.charAt(0).toUpperCase() + option.slice(1)}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;
