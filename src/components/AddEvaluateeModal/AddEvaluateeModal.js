import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import FormLabel from '@mui/material/FormLabel';

const AddEvaluateeModal = ({ isOpen, onClose, onAdd }) => {
  const [evaluatees, setEvaluatees] = useState([]);
  useEffect(() => {
    setEvaluatees([{ label: 'John Doe', id: 1 }]);
  }, []);

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '40vw',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 3,
  };
  const inputSx = {
    minWidth: '100% !important',
    width: '100% !important',
    marginTop: '1rem !important',
  };
  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography
          id="modal-modal-title"
          variant="h5"
          component="h5"
          sx={{ textAlign: 'center', marginBottom: '2rem !important' }}
        >
          Add Evaluatee
        </Typography>
        <Box
          component="form"
          sx={{
            '& .MuiTextField-root': { m: 1, width: '25ch' },
          }}
          noValidate
          autoComplete="off"
        >
          <Autocomplete
            disablePortal
            id="combo-box"
            options={evaluatees}
            sx={{ width: '100%', minWidth: '100% !important' }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select Evaluatee"
                sx={{ width: '100%', minWidth: '100% !important' }}
              />
            )}
          />
          <TextField
            id="outlined-input"
            label="Course code"
            defaultValue=""
            sx={inputSx}
          />
          <TextField
            id="outlined-input"
            label="Course Name"
            defaultValue=""
            sx={inputSx}
          />

          <TextField
            id="outlined-input"
            label="Place"
            defaultValue=""
            sx={inputSx}
          />
          <TextField
            id="outlined-input"
            label="Time"
            defaultValue=""
            sx={inputSx}
          />
          <Box sx={{ marginLeft: '8px' }}>
            <FormLabel id="demo-radio-buttons-group-label">Week</FormLabel>
            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              defaultValue="female"
              name="radio-buttons-group"
              sx={{ display: 'flex', flexDirection: 'row', gap: '1rem' }}
            >
              <FormControlLabel
                value="other"
                control={<Radio />}
                label="Every week"
              />
              <FormControlLabel
                value="female"
                control={<Radio />}
                label="Even"
              />
              <FormControlLabel value="male" control={<Radio />} label="Odd" />
            </RadioGroup>
          </Box>
          <Box
            sx={{
              width: '100%',
              minWidth: '100%',
              display: 'flex',
              justifyContent: 'flex-end',
              marginTop: '2rem',
            }}
          >
            <Button onClick={onClose} size="large">
              Cancel
            </Button>
            <Button onClick={onAdd} color="success" size="large">
              Save
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default AddEvaluateeModal;
