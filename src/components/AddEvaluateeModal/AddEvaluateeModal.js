import { useEffect, useState, useContext } from 'react';
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
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { useTranslation } from 'react-i18next';

import UserContext from '../../context/UserContext/UserContext.js';

import config from '../../config/index.config.js';

import { formatAcademicTitle } from '../../utils/formatAcademicTitle.js';

import { WEEKDAYS } from '../../constants.js';

const yearsMap = {
  1: '1 year ago',
  2: '2 years ago',
  3: '3 years ago',
  4: '4 years ago',
  5: '5 years ago',
  default: 'More than 5 years ago',
};

const AddEvaluateeModal = ({ isOpen, onClose, notifySuccess, notifyError }) => {
  const { t } = useTranslation();

  const [evaluatees, setEvaluatees] = useState([]);
  const [fetchedUsers, setFetchUsers] = useState([]);
  const [evaluateeFormValues, setEvaluateeFormValues] = useState({
    evaluatee: '',
    courseCode: '',
    courseName: '',
    place: '',
    timeFrom: '00:00',
    timeTo: '00:00',
    weekday: '',
    week: 'everyweek',
  });
  const { token } = useContext(UserContext);

  const mapUsersToDropDownValues = () => {
    const users = fetchedUsers.map((user) => ({
      ...user,
      mappedDate: mapDate(user.evaluatee.last_evaluated_date),
      label: formatUserDropDownTitle(user),
    }));
    setEvaluatees(users);
  };

  const formatUserDropDownTitle = (user) =>
    `${formatAcademicTitle(user.academic_title)} ${user.first_name} ${
      user.last_name
    }${
      user.evaluatee.last_evaluated_date
        ? ` (Last evaluation: ${user.evaluatee.last_evaluated_date})`
        : ''
    }`;

  const addEvaluateeHandler = async () => {
    try {
      const res = await fetch(`${config.server.url}/evaluatee/addEvaluatee`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        notifySuccess(t('evaluatee_adding_success'));
        onClose();
      }
    } catch (err) {
      notifyError(t('evaluatee_adding_error'));
    }
  };

  const mapDate = (date) => {
    if (!date) {
      return 'No evaluation yet';
    }

    const providedDate = new Date(date);
    const providedDateYear = providedDate.getFullYear();
    const providedDateMonth = providedDate.getMonth();

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();

    const yearsDiff = currentYear - providedDateYear;
    if (yearsDiff !== 0) {
      return yearsMap[yearsDiff] || yearsMap.default;
    }
    return currentMonth - providedDateMonth === 0
      ? 'This month'
      : `${currentMonth - providedDateMonth} months ago`;
  };

  const handleEvaluateeFormValues = (e) => {
    setEvaluateeFormValues((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  useEffect(() => {
    const fetchEvaluatees = async () => {
      try {
        const res = await fetch(`${config.server.url}/userData/getUsers`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setFetchUsers(data);
      } catch (err) {
        notifyError(t('fetching_evaluatees_error'));
      }
    };
    fetchEvaluatees();
  }, []);

  useEffect(() => {
    mapUsersToDropDownValues();
  }, [fetchedUsers]);

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
            '& .MuiTextField-root': { my: 1 },
          }}
          noValidate
          autoComplete="off"
        >
          <Autocomplete
            disablePortal
            freeSolo
            options={evaluatees}
            name="evaluatee"
            sx={{ width: '100%', minWidth: '100% !important' }}
            onSelect={(e) => handleEvaluateeFormValues(e)}
            groupBy={(option) => option.mappedDate}
            renderInput={(params) => (
              <TextField
                {...params}
                key={params.id}
                label="Select Evaluatee"
                name="evaluatee"
                onChange={handleEvaluateeFormValues}
                value={evaluateeFormValues.evaluatee}
                sx={{ width: '100%', minWidth: '100% !important' }}
              />
            )}
          />
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              id="outlined-input"
              label="Course Name"
              name="courseName"
              value={evaluateeFormValues.courseName}
              onChange={handleEvaluateeFormValues}
              sx={{ flex: 2.5 }}
            />

            <TextField
              id="outlined-input"
              label="Course code"
              name="courseCode"
              value={evaluateeFormValues.courseCode}
              onChange={handleEvaluateeFormValues}
              sx={{ flex: 1.5 }}
            />
          </Box>

          <TextField
            id="outlined-input"
            label="Place"
            name="place"
            value={evaluateeFormValues.place}
            onChange={handleEvaluateeFormValues}
            sx={{ width: '100%' }}
          />

          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              labelid="time-from-label"
              id="outlined-input"
              name="timeFrom"
              type="time"
              label="Time From"
              sx={{ flex: 1 }}
              value={evaluateeFormValues.timeFrom}
              onChange={handleEvaluateeFormValues}
            />
            <TextField
              id="outlined-input"
              label="Time To"
              name="timeTo"
              type="time"
              sx={{ flex: 1 }}
              value={evaluateeFormValues.timeTo}
              onChange={handleEvaluateeFormValues}
            />
          </Box>
          <FormControl fullWidth sx={inputSx}>
            <InputLabel id="demo-simple-select-label">Weekday</InputLabel>
            <Select
              labelid="demo-simple-select-label"
              id="weekday"
              name="weekday"
              value={evaluateeFormValues.weekday}
              label="Weekday"
              onChange={handleEvaluateeFormValues}
            >
              {WEEKDAYS.map((weekday) => (
                <MenuItem value={weekday}>{weekday}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Box sx={inputSx}>
            <FormLabel id="demo-radio-buttons-group-label">Week</FormLabel>
            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              value={evaluateeFormValues.week}
              name="week"
              sx={{ display: 'flex', flexDirection: 'row', gap: '1rem' }}
              onChange={handleEvaluateeFormValues}
            >
              <FormControlLabel
                value="everyweek"
                control={<Radio />}
                label="Every week"
              />
              <FormControlLabel value="even" control={<Radio />} label="Even" />
              <FormControlLabel value="odd" control={<Radio />} label="Odd" />
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
            <Button onClick={addEvaluateeHandler} color="success" size="large">
              Save
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default AddEvaluateeModal;
