import React, { useEffect } from 'react';

export default function ClassesEvaluation({ setDrawerSelectedItem, link }) {
  useEffect(() => {
    setDrawerSelectedItem(link);
  }, []);
  return (
    <div>
      <h1>Classes evalution</h1>
    </div>
  );
}
