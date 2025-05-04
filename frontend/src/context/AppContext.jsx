'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { createContext, useState, useContext } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const router = useRouter();

  const [currentUser, setCurrentUser] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);

  // Only access sessionStorage on client
  React.useEffect(() => {
    const user = typeof window !== 'undefined' ? JSON.parse(sessionStorage.getItem('user')) : null;
    setCurrentUser(user);
    setLoggedIn(!!user);
  }, []);

  const logout = () => {
    setCurrentUser(null);
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('user');
    }
    setLoggedIn(false);
    router.push("/login");
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        loggedIn,
        setLoggedIn,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

const useAppContext = () => useContext(AppContext);
export default useAppContext;