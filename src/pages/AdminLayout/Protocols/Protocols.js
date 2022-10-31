import React, { useEffect } from 'react';

export default function Protocols({ setDrawerSelectedItem, link }) {
  useEffect(() => {
    setDrawerSelectedItem(link);
  }, []);
  return (
    <div>
      <h1>Protocols</h1>
    </div>
  );
}
