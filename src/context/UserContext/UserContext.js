/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react';
import useToken from '../../hooks/useToken.js';

const UserContext = React.createContext({
  isLoggedIn: false,
  login: () => {},
  logout: () => {},
  token: null,
  expiresIn: null,
});

export const UserContextProvider = ({ children }) => {
  const [storageToken, getTokenInfo, saveToken, clearToken] = useToken();
  const expIn = getTokenInfo().exp * 1000;
  const [expiresIn, setExpiresIn] = useState(expIn ? new Date(expIn) : null);
  const [isLoggedIn, setIsLoggedIn] = useState(storageToken?.length > 0);
  const [token, setToken] = useState(storageToken);

  const loginHandler = (jwt) => {
    saveToken(jwt);
    setToken(jwt);
    const base64 = jwt.split('.')[1].replace('-', '+').replace('_', '/');
    setExpiresIn(new Date(JSON.parse(window.atob(base64)).exp * 1000));
    setIsLoggedIn(true);
  };
  const logoutHandler = () => {
    clearToken();
    setToken(null);
    setExpiresIn(null);
    setIsLoggedIn(false);
  };

  return (
    <UserContext.Provider
      value={{
        isLoggedIn,
        token,
        expiresIn,
        login: loginHandler,
        logout: logoutHandler,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
