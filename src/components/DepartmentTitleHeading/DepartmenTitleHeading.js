import React from 'react';
import { useTranslation } from 'react-i18next';

import classes from './DepartmentTitleHeading.module.css';

export default function DepartmentTitleHeading() {
  const { t } = useTranslation();

  return <h1 className={classes.facultyTitle}>{t('faculty_title')}</h1>;
}
