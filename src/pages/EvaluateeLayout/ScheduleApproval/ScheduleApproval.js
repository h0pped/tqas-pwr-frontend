import Box from '@mui/material/Box';
import { useEffect } from 'react';

export default function ScheduleApproval({ setSelectedPage, link }) {
  useEffect(() => {
    setSelectedPage(link);
  }, [link, setSelectedPage]);
  return (
    <Box>Schedule to approve</Box>
  );
}
