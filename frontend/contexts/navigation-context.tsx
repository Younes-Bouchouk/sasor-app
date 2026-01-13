// context/NavigationContext.tsx
import React, { createContext, ReactNode, useContext, useState } from 'react';

type NavigationContextType = {
  currentScreenIndex: number;
  setCurrentScreenIndex: (index: number) => void;
};

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [currentScreenIndex, setCurrentScreenIndex] = useState(0);

  return (
    <NavigationContext.Provider value={{ currentScreenIndex, setCurrentScreenIndex }}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigationContext() {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigationContext must be used within NavigationProvider');
  }
  return context;
}