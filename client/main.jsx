import React from 'react';
import ReactDOM from 'react-dom/client';
import './style.css';
import { UserProvider } from './src/context/userContext';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './src/components/login';
import Dashboard from './src/components/dashboard';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Dashboard />} />
    </Routes>
  );
}

ReactDOM.createRoot(document.getElementById('app')).render(
  <Router>
    <UserProvider>
      <App />
    </UserProvider>
  </Router>
);
