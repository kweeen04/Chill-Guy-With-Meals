'use client';
import { createContext, useState, useContext } from 'react';

export const UserPreferencesContext = createContext();

export function UserPreferencesProvider({ children }) {
  const [preferences, setPreferences] = useState({});

  return (
    <UserPreferencesContext.Provider value={{ preferences, setPreferences }}>
      {children}
    </UserPreferencesContext.Provider>
  );
}