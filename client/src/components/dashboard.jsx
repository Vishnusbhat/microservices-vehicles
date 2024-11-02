import React, { useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import MainContent from './MainContent';
import Modal from './Modal'; // Import Modal component
import { useUser } from '../context/userContext';

const Dashboard = () => {
  const [selectedOption, setSelectedOption] = useState('home');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const { user } = useUser();
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white">
      <Navbar setSelectedOption={setSelectedOption} selectedOption={selectedOption} />
      <div className="grid grid-cols-12 flex-1">
        <Sidebar fromDate={fromDate} setFromDate={setFromDate} toDate={toDate} setToDate={setToDate} />
        <MainContent
          selectedOption={selectedOption}
          setSelectedVehicle={setSelectedVehicle}
          user={user}
          fromDate={fromDate}
          toDate={toDate}
        />
      </div>

      {/* Modal for booking */}
      {selectedVehicle && (
        <Modal
          vehicle={selectedVehicle}
          fromDate={fromDate}
          toDate={toDate}
          onClose={() => setSelectedVehicle(null)}
        />
      )}
    </div>
  );
};

export default Dashboard;
