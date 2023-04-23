import React, { useState, createContext } from 'react';

export const GlobalContext = createContext();

function GlobalContextProvider({ children }) {
  const [showBtn, setShowBtn] = useState(true);

  const toggleAddBtn = () => {
    setShowBtn(!showBtn);
  };

  return (
    <GlobalContext.Provider value={{ showBtn, toggleAddBtn }}>
      {children}
    </GlobalContext.Provider>
  );
}

export default GlobalContextProvider;
