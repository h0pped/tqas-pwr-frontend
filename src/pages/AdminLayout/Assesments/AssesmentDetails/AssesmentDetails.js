import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export default function AssesmentDetails({ assesmentDetails }) {
  if (assesmentDetails === undefined) {
    return (
      <Box sx={{
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
      >
        <Typography variant="subtitle2" sx={{ color: '#848884' }}>Select assesment on the left to see details.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2, borderRadius: 0.5, backgroundColor: '#ffffff', boxShadow: 2, border: 'solid 1px rgba(235, 235, 235)', height: '100%' }}>
      <Typography sx={{ mb: 1 }} variant="h5">
        Assesment details
      </Typography>
      <Divider sx={{ m: 0 }} variant="middle" />
      <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Typography sx={{ width: '10%' }}>
            Status
          </Typography>
          <FormControl>
            <Select
              value={assesmentDetails.status}
              displayEmpty
              inputProps={{ 'aria-label': 'Without label' }}
              size="small"
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Completed">Completed</MenuItem>
              <MenuItem value={30}>Thirty</MenuItem>
            </Select>

          </FormControl>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Typography sx={{ width: '10%' }}>
            Semester
          </Typography>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
            {assesmentDetails.semester}
          </Typography>
        </Box>
        <Divider sx={{ m: 0 }} variant="middle" />
        <Typography variant="h6">
          Evaluatees
        </Typography>
      </Box>
    </Box>
  );
}
