import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';

import AssessmentIcon from '@mui/icons-material/Assessment';

export default function AssesmentCard({ id, semester, status, setId }) {
  return (
    <Box
      onClick={() => { setId(id); }}
      sx={{
        p: 2,
        backgroundColor: '#ffffff',
        border: 'solid 0.5px rgba(235, 235, 235)',
        borderRadius: 0.5,
        boxShadow: 2,
        display: 'flex',
        flexDirection: 'column',
        '&:hover': {
          backgroundColor: 'rgba(235, 235, 235, 0.53)',
        },
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1.5 }}>
        <Box sx={{ p: 0.5, borderRadius: 2, backgroundColor: '#fdf0ef', width: '3rem', height: '3rem' }}>
          <AssessmentIcon sx={{ color: '#D9372A', width: '100%', height: '100%' }} />
        </Box>
        <Box>
          <Typography variant="body1" sx={{ fontWeight: 'bold', height: '1.5rem' }}>Assesment</Typography>
          <Typography sx={{ height: '1.5rem', fontSize: '1rem' }}>
            {semester}
          </Typography>
        </Box>
      </Box>
      <Box sx={{ mt: 2, display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
        <Chip size="small" label={status} />
        <Typography variant="subtitle1">9 evaluatees</Typography>
      </Box>
    </Box>
  );
}
