import { useContext } from 'react';
import { Navigate } from 'react-router-dom';

import UserContext from '../../context/UserContext/UserContext.js';

import LanguageSwitch from '../../components/LanguageSwitch/LanguageSwitch.js';
import DepartmentTitleHeading from '../../components/DepartmentTitleHeading/DepartmenTitleHeading.js';

import departmentLogo from '../../assets/images/departmentLogo.svg';

import pwrLogo from '../../assets/images/pwrLogo.svg';

import classes from './Login.module.css';
import Authentication from '../../components/Authentication/Authentication.js';
import AppTitle from '../../components/AppTitle/AppTitle.js';

const Login = () => {
  const { isLoggedIn, role } = useContext(UserContext);

  if (isLoggedIn && role !== 'admin') {
    return <Navigate to="/evaluatee/my-assessments" />;
  }
  if (isLoggedIn && role === 'admin') {
    return <Navigate to="/home/assessments" />;
  }
  return (
    <div className={classes.container}>
      <div className={classes.facultySymbolicsContainer}>
        <div className={classes.facultyLogoAndTitle}>
          <img
            src={departmentLogo}
            alt="WIT Department Logo"
            className={classes.facultyLogoSVG}
          />
          <DepartmentTitleHeading />
        </div>
      </div>
      <div className={classes.mainLoginContainer}>
        <div className={classes.toolBar}>
          <LanguageSwitch />
        </div>
        <div className={classes.loginFormContainer}>
          <div className={classes.loginForm}>
            <AppTitle />
            <Authentication />
          </div>
        </div>
        <div className={classes.pwrLogoContainer}>
          <img src={pwrLogo} alt="PWr Logo" className={classes.pwrLogoSVG} />
        </div>
      </div>
    </div>
  );
};

export default Login;
