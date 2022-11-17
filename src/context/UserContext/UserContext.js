/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
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
  const [firstName, setFirstName] = useState(getTokenInfo().first_name);
  const [lastName, setLastName] = useState(getTokenInfo().last_name);
  const [role, setRole] = useState(getTokenInfo().role);
  const [id, setId] = useState(getTokenInfo().id);

  const loginHandler = (jwt) => {
    saveToken(jwt);
    setToken(jwt);
    const base64 = jwt.split('.')[1].replace('-', '+').replace('_', '/');
    const jsonParsedTokenInfo = JSON.parse(window.atob(base64));
    setFirstName(jsonParsedTokenInfo.first_name);
    setLastName(jsonParsedTokenInfo.last_name);
    setRole(jsonParsedTokenInfo.role);
    setId(jsonParsedTokenInfo.id);
    setExpiresIn(new Date(jsonParsedTokenInfo.exp * 1000));
    setIsLoggedIn(true);
  };
  const logoutHandler = () => {
    clearToken();
    setToken(null);
    setExpiresIn(null);
    setIsLoggedIn(false);
    setFirstName(null);
    setLastName(null);
  };

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (expiresIn && new Date() > expiresIn) {
      logoutHandler();
    }
    if (isLoggedIn && expiresIn) {
      const remainingTime = expiresIn.getTime() - new Date().getTime();
      const timer = setTimeout(logoutHandler, remainingTime);
      return () => {
        clearTimeout(timer);
      };
    }
  }, []);

  return (
    <UserContext.Provider
      value={{
        isLoggedIn,
        token,
        expiresIn,
        firstName,
        lastName,
        role,
        id,
        login: loginHandler,
        logout: logoutHandler,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
