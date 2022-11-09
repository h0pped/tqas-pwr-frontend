import { useEffect } from 'react';
import Box from '@mui/material/Box';

export default function MyAssessments({ setSelectedPage, link }) {
  useEffect(() => {
    setSelectedPage(link);
  }, [link, setSelectedPage]);
  return <Box>Your assessments</Box>;
}
