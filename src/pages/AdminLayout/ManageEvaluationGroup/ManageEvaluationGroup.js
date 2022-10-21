import React, { useEffect } from 'react';

export default function ManageEvaluationGroup({ setDrawerSelectedItem, link }) {
  useEffect(() => {
    setDrawerSelectedItem(link);
  }, []);
  return (
    <div>
      <h1>WZHZ</h1>
    </div>
  );
}
