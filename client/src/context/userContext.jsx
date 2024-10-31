import React, { createContext, useState, useContext } from 'react';

// Create the context
const UserContext = createContext();

// Custom hook to use the UserContext easily
export const useUser = () => useContext(UserContext);

// Context provider component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Initialize with user info or null if not logged in

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
