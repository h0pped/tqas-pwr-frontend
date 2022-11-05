import { useEffect, useState, useContext } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Divider from '@mui/material/Divider';

import { v4 as uuid } from 'uuid';

import { useTranslation } from 'react-i18next';

import UserContext from '../../context/UserContext/UserContext.js';

import config from '../../config/index.config.js';

import { formatAcademicTitle } from '../../utils/formatAcademicTitle.js';

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

  const [courses, setCourses] = useState([]);

  const [isFormFullfilled, setIsFormFullfilled] = useState(false);
  const [isModalFullfilled, setisModalFullfilled] = useState(false);

  const [isEditingCourse, setIsEditingCourse] = useState(false);
  const [currentlyEditedCourse, setCurrentlyEditedCourse] = useState(null);

  const [evaluateeFormValues, setEvaluateeFormValues] = useState({
    evaluatee: '',
    courseCode: '',
    courseName: '',
    numberOfPeopleEnrolled: '',
    details: '',
    evaluateeId: '',
  });
  const { token } = useContext(UserContext);

  const sortUsersByEvaluationDate = (a, b) =>
    new Date(a.evaluatee.last_evaluated_date) -
    new Date(b.evaluatee.last_evaluated_date);

  const mapUsersToDropDownValues = () => {
    const users = fetchedUsers.sort(sortUsersByEvaluationDate).map((user) => ({
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
  const deleteCourse = (index) => {
    const newCourses = [...courses];
    newCourses.splice(index, 1);
    setCourses(newCourses);
    setIsEditingCourse(false);
    setCurrentlyEditedCourse(null);
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

  const handleEvaluateeFormValues = (e, val) => {
    if (val) {
      setEvaluateeFormValues((prev) => ({
        ...prev,
        evaluateeId: val.id,
      }));
    } else {
      setEvaluateeFormValues((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
      }));
    }
  };

  const addCourseHandler = () => {
    if (isEditingCourse) {
      const newCourses = [...courses];
      newCourses[currentlyEditedCourse] = {
        courseCode: evaluateeFormValues.courseCode,
        courseName: evaluateeFormValues.courseName,
        numberOfPeopleEnrolled: evaluateeFormValues.numberOfPeopleEnrolled,
        details: evaluateeFormValues.details,
      };
      setCourses(newCourses);
      setIsEditingCourse(false);
      setCurrentlyEditedCourse(null);
    } else if (!isEditingCourse && isFormFullfilledCheck()) {
      setCourses((prev) => [
        ...prev,
        {
          courseCode: evaluateeFormValues.courseCode,
          courseName: evaluateeFormValues.courseName,
          numberOfPeopleEnrolled: evaluateeFormValues.numberOfPeopleEnrolled,
          details: evaluateeFormValues.details,
        },
      ]);
    }
  };

  const setEditingCourseHandler = (index) => {
    setIsEditingCourse(true);
    setCurrentlyEditedCourse(index);
    setEvaluateeFormValues((prev) => ({ ...prev, ...courses[index] }));
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
  useEffect(() => {
    setIsFormFullfilled(isFormFullfilledCheck());
    setisModalFullfilled(isModalFullfilledCheck());
  }, [evaluateeFormValues, courses]);

  const isFormFullfilledCheck = () =>
    evaluateeFormValues.courseCode &&
    evaluateeFormValues.courseName &&
    evaluateeFormValues.numberOfPeopleEnrolled &&
    evaluateeFormValues.details;

  const isModalFullfilledCheck = () =>
    evaluateeFormValues.evaluatee &&
    evaluateeFormValues.evaluateeId &&
    courses.length > 0;

  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '70vw',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 3,
    maxHeight: '80vh',
    overflow: 'auto',
  };

  const inputStyle = {
    width: '100%',
    minWidth: '100% !important',
  };
  const bottomButtonsStyle = {
    width: '100%',
    minWidth: '100%',
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '2rem',
    gap: 2,
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={modalStyle}>
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
            options={evaluatees}
            name="evaluatee"
            sx={inputStyle}
            noOptionsText={t('no_evaluatees_found')}
            onChange={(e, val) => handleEvaluateeFormValues(e, val)}
            onSelect={(e, val) => handleEvaluateeFormValues(e, val)}
            onInputChange={(e, val) => handleEvaluateeFormValues(e, val)}
            groupBy={(option) => option.mappedDate}
            renderInput={(params) => (
              <TextField
                {...params}
                key={params.id}
                label="Select Evaluatee"
                name="evaluatee"
                onChange={handleEvaluateeFormValues}
                value={evaluateeFormValues.evaluatee}
                sx={inputStyle}
              />
            )}
          />
          <Divider
            sx={{ borderBottomWidth: 1, my: 2, backgroundColor: '#999' }}
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
            label="Number of enrolled"
            name="numberOfPeopleEnrolled"
            value={evaluateeFormValues.numberOfPeopleEnrolled}
            onChange={handleEvaluateeFormValues}
            sx={inputStyle}
          />
          <TextField
            id="outlined-multiline-flexible"
            label="Place and date of didactic classes"
            multiline
            name="details"
            value={evaluateeFormValues.details}
            onChange={handleEvaluateeFormValues}
            maxRows={5}
            minRows={5}
            sx={inputStyle}
          />
          <Button
            onClick={addCourseHandler}
            size="large"
            variant="outlined"
            disabled={!isFormFullfilled}
          >
            {!isEditingCourse ? 'Add course' : 'Edit Course'}
          </Button>
          {courses.length > 0 && (
            <Box>
              <Divider
                sx={{ borderBottomWidth: 1, my: 2, backgroundColor: '#999' }}
              />
              <TableContainer component={Paper} sx={{ width: '100%', my: 1 }}>
                <Table sx={{ width: '100%' }} aria-label="simple table">
                  <TableHead sx={{ width: '100%' }}>
                    <TableRow sx={{ display: 'flex' }}>
                      <TableCell sx={{ flex: 1 }}>Course code</TableCell>
                      <TableCell align="left" sx={{ flex: 1.5 }}>
                        Course name
                      </TableCell>
                      <TableCell align="left" sx={{ flex: 1.5 }}>
                        Number of people enrolled
                      </TableCell>
                      <TableCell align="left" sx={{ flex: 4 }}>
                        Details
                      </TableCell>
                      <TableCell align="left" sx={{ flex: 1 }}>
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {courses.map(
                      (
                        {
                          courseCode,
                          courseName,
                          numberOfPeopleEnrolled,
                          details,
                        },
                        index
                      ) => (
                        <TableRow
                          key={uuid()}
                          sx={{
                            '&:last-child td, &:last-child th': { border: 0 },
                            display: 'flex',
                          }}
                        >
                          <TableCell
                            component="th"
                            scope="row"
                            sx={{ flex: '1' }}
                          >
                            {courseCode}
                          </TableCell>
                          <TableCell
                            align="left"
                            size="medium"
                            sx={{ flex: 1.5 }}
                          >
                            {courseName}
                          </TableCell>
                          <TableCell align="left" sx={{ flex: 1.5 }}>
                            {numberOfPeopleEnrolled}
                          </TableCell>
                          <TableCell align="left" sx={{ flex: 4 }}>
                            {details.split('\n').join(', ')}
                          </TableCell>
                          <TableCell sx={{ flex: 1 }}>
                            <IconButton
                              color="primary"
                              onClick={() => setEditingCourseHandler(index)}
                            >
                              <EditIcon fontSize="inherit" />
                            </IconButton>
                            <IconButton
                              color="primary"
                              onClick={() => deleteCourse(index)}
                            >
                              <DeleteIcon fontSize="inherit" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      )
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
          <Box sx={bottomButtonsStyle}>
            <Button onClick={onClose} size="large" variant="outlined">
              Cancel
            </Button>
            <Button
              onClick={addEvaluateeHandler}
              size="large"
              variant="contained"
              sx={{ backgroundColor: '#d9372a', color: 'white' }}
              disabled={!isModalFullfilled}
            >
              Save
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default AddEvaluateeModal;
