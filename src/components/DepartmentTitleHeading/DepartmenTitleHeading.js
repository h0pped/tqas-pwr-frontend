import React from 'react';
import classes from './DepartmentTitleHeading.module.css';
import { useTranslation } from 'react-i18next';

export default function DepartmentTitleHeading() {
  const { t } = useTranslation();

  return <h1 className={classes.facultyTitle}>{t('faculty_title')}</h1>;
}
