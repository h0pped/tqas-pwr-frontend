import { forwardRef, useState, useEffect, useContext } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import {
  Typography,
  Slide,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from '@mui/material';

import { useTranslation } from 'react-i18next';

import UserContext from '../../../context/UserContext/UserContext.js';

import config from '../../../config/index.config.js';

import Section from './Section.js';

const Transition = forwardRef((props, ref) => (
  <Slide direction="up" ref={ref} {...props} />
));

const Protocol = ({
  evaluations,
  isProtocolFormOpen,
  handleClose,
  notifyError,
}) => {
  const [protocolQuestions, setProtocolQuestions] = useState(null);
  const [, setFullFilledProtocolQuestions] = useState({});
  const [, setProtocol] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState({
    course: {
      course_code: '',
      course_name: '',
    },
    protocolId: null,
  });
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [courses, setCourses] = useState([]);
  const { token } = useContext(UserContext);

  const { t } = useTranslation();

  useEffect(() => {
    setCourses(
      evaluations.map(({ course, protocolId }) => ({
        course,
        protocolId,
      }))
    );
  }, []);

  useEffect(() => {
    const fetchProtocol = async (protocolId) => {
      setLoading(true);
      try {
        const res = await fetch(
          `${config.server.url}/protocolManagement/getProtocol?protocol_id=${protocolId}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        ).then((res) => res.json());
        setProtocol(res);
        setProtocolQuestions(JSON.parse(res.protocol_json));
        setFullFilledProtocolQuestions(JSON.parse(res.protocol_json));
      } catch (err) {
        notifyError(t('loading_protocol_error'));
      } finally {
        setLoading(false);
      }
    };
    if (selectedCourse.protocolId) {
      fetchProtocol(selectedCourse.protocolId);
    }
  }, [selectedCourse]);

  const onChangeHandler = (e, sectionTitle) => {
    const { id, value } = e.target;
    setFullFilledProtocolQuestions((prev) => {
      const newProtocol = { ...prev };
      newProtocol[sectionTitle]?.forEach((question) => {
        if (question.question_text === id) {
          // eslint-disable-next-line no-param-reassign
          question.answer = value;
        }
      });
      return newProtocol;
    });
  };

  const onInternalQuestionChangeHandler = (
    e,
    parentQuestion,
    parentQuestionChoice,
    sectionTitle
  ) => {
    const { id, value } = e.target;

    setFullFilledProtocolQuestions((prev) => {
      const newProtocol = { ...prev };
      newProtocol[sectionTitle]?.forEach((question) => {
        if (question.question_text === parentQuestion) {
          // eslint-disable-next-line no-param-reassign
          question.answer = {
            main_answer: parentQuestionChoice,
            [id]: value,
          };
        }
      });
      return newProtocol;
    });
  };

  const handleChangeSelectedCourse = (e) => {
    setSelectedCourse((prev) => {
      const newSelectedCourse = { ...prev };
      const foundCourse = courses.find(
        ({ course }) => course.course_code === e.target.value
      );
      if (foundCourse) {
        newSelectedCourse.course.course_code = foundCourse.course.course_code;
        newSelectedCourse.course.course_name = foundCourse.course.course_name;
        newSelectedCourse.protocolId = foundCourse.protocolId;
      }
      return newSelectedCourse;
    });
  };

  const handleSubmitProtocol = async () => {
    setSubmitLoading(true);
    setTimeout(() => setSubmitLoading(false), 3000);
  };
  return (
    <Dialog
      fullScreen
      open={isProtocolFormOpen}
      onClose={handleClose}
      TransitionComponent={Transition}
    >
      <AppBar sx={{ position: 'relative' }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            {t('protocol')}
          </Typography>
          <Button autoFocus color="inherit" onClick={handleClose}>
            {t('submit')}
          </Button>
        </Toolbar>
      </AppBar>
      <Box
        sx={{
          width: '70%',
          display: 'flex',
          margin: '0 auto',
          flexDirection: 'column',
          py: 2,
        }}
      >
        <FormControl sx={{ display: 'flex', width: '100%', my: 5 }}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Course</InputLabel>
            {courses && courses.length > 0 && (
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Course"
                onChange={handleChangeSelectedCourse}
                defaultValue=""
              >
                {courses &&
                  courses.length > 0 &&
                  courses.map(({ course, protocolId }) => (
                    <MenuItem
                      value={course.course_code}
                      data-protocolid={protocolId}
                      key={course.course_code}
                    >
                      {course.course_name}
                    </MenuItem>
                  ))}
              </Select>
            )}
          </FormControl>
        </FormControl>
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <CircularProgress />
          </Box>
        )}
        {protocolQuestions && !loading && (
          <>
            {Object.keys(protocolQuestions).map((sectionTitle, index) => (
              <Section
                sectionTitle={`${index + 1}. ${sectionTitle}`}
                sectionTitleUnformatted={sectionTitle}
                sectionData={protocolQuestions[sectionTitle]}
                key={sectionTitle}
                onChangeHandler={(e) => onChangeHandler(e, sectionTitle)}
                onInternalQuestionChangeHandler={
                  onInternalQuestionChangeHandler
                }
              />
            ))}
            <Button
              variant="contained"
              onClick={handleSubmitProtocol}
              disabled={submitLoading}
            >
              {submitLoading ? <CircularProgress size={24} /> : t('submit')}
            </Button>
          </>
        )}
      </Box>
    </Dialog>
  );
};

export default Protocol;
