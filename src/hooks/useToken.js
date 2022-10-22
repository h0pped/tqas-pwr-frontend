import { useState } from 'react';

const useToken = () => {
  const [token, setToken] = useState(localStorage.getItem('token'));

  const saveToken = (userToken) => {
    localStorage.setItem('token', userToken);
    setToken(userToken);
  };
  const clearToken = () => {
    localStorage.removeItem('token');
    setToken(null);
  };
  const getTokenInfo = () => {
    if (token) {
      const base64Url = token?.split('.')[1];
      const base64 = base64Url?.replace('-', '+').replace('_', '/');
      if (base64) {
        return JSON.parse(window.atob(base64));
      }
    }
    return { token: null, expiresIn: null };
  };
  return [token, getTokenInfo, saveToken, clearToken];
};

export default useToken;
