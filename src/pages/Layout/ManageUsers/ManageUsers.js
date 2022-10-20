import { Typography } from '@mui/material';
import React, { useEffect } from 'react';
import Box from '@mui/material/Box';

export default function ManageUsers({ setDrawerSelectedItem, link }) {
  useEffect(() => {
    setDrawerSelectedItem(link);
  }, []);
  return (
    <Box sx={{ m: 0, p: 0 }}>
      <Typography>Maage users</Typography>
    </Box>
  );
}
