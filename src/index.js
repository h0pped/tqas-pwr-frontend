/* eslint-disable import/no-named-as-default-member */
/* eslint-disable import/no-named-as-default */
import React, { Suspense } from 'react';
import { createTheme, ThemeProvider } from '@mui/material';
import './index.css';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpApi from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

import App from './App.js';
import AdminLayout from './pages/AdminLayout/Layout.js';
import EvaluateeLayout from './pages/EvaluateeLayout/Layout.js';
import reportWebVitals from './reportWebVitals.js';
import Login from './pages/Login/Login.js';
import { UserContextProvider } from './context/UserContext/UserContext.js';

const theme = createTheme({
  typography: {
    fontFamily: [
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
  },
  palette: {
    primary: {
      light: '#DF9A8C',
      main: '#D9372A',
      dark: '#C31E1A',
    },
    secondary: {
      light: '#DF9A8C',
      main: '#FFFFFF',
      dark: '#C31E1A',
    },
  },
});

i18next
  .use(HttpApi)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    supportedLngs: ['en', 'pl'],
    fallbackLng: 'pl',
    debug: false,
    // Options for language detector
    detection: {
      order: ['path', 'cookie', 'htmlTag'],
      caches: ['cookie'],
    },
    // react: { useSuspense: false },
    backend: {
      loadPath: '/assets/locales/{{lng}}/translation.json',
    },
  });

const loadingMarkupAlert = <h2>Loading...</h2>;

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Suspense fallback={loadingMarkupAlert}>
    <ThemeProvider theme={theme}>
      <UserContextProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/app" element={<App />} />
            <Route path="/home/*" element={<AdminLayout />} />
            <Route path="/evaluatee/*" element={<EvaluateeLayout />} />
          </Routes>
        </BrowserRouter>
      </UserContextProvider>
    </ThemeProvider>
  </Suspense>
);

reportWebVitals();
