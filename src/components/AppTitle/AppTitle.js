import React from 'react';
import { useTranslation } from 'react-i18next';

import classes from './AppTitle.module.css';

export default function AppTitle() {
  const { t } = useTranslation();
  return <h1 className={classes.appTitle}>{t('app_name')}</h1>;
}
