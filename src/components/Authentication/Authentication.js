import React, { useState } from 'react';
// import { useTranslation } from 'react-i18next';
import Login from './Login/LoginComponent.js';
import ActivateAccountComponent from './ActivateAccount/ActivateAccountComponent.js';
import PasswordResetComponent from './PasswordReset/PasswordResetComponent.js';

export default function Authentication() {
  // const { t } = useTranslation();

  const [page, setPage] = useState(0);

  const handleFormClick = (event, num) => {
    setPage(num);
  };

  switch (page) {
    case 0:
      return <Login handleFormClick={handleFormClick} />;
    case 1:
      return <ActivateAccountComponent handleFormClick={handleFormClick} />;
    case 2:
      return <PasswordResetComponent handleFormClick={handleFormClick} />;
    default:
      return <Login handleFormClick={handleFormClick} />;
  }
}
