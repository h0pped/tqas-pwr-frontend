import React, { useReducer } from 'react';
import i18next from 'i18next';
import cookies from 'js-cookie';
import { useTranslation } from 'react-i18next';

import classes from './LanguageSwitch.module.css';

const languages = [
  {
    code: 'pl',
    name: 'PL',
  },
  {
    code: 'en',
    name: 'EN',
  },
];

export default function LanguageSwitch() {
  const currentLanguageCode = cookies.get('i18next');
  const [ignored, forceUpdate] = useReducer((x) => x + 1, 0);

  const { t } = useTranslation();

  const handleLanguageSwitch = (code) => {
    i18next.changeLanguage(code);
    forceUpdate();
  };

  document.title = t('app_name');

  return (
    <div className={classes.switchContainer}>
      {languages.map(({ code, name }) => (
        <p
          className={
            currentLanguageCode === code
              ? classes.languageBtnActive
              : classes.languageBtn
          }
          key={code}
          onClick={() => handleLanguageSwitch(code)}
        >
          {name}
        </p>
      ))}
    </div>
  );
}
