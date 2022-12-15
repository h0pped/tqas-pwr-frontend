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
import TeamMembers from './TeamMembers.js';

const Transition = forwardRef((props, ref) => (
  <Slide direction="up" ref={ref} {...props} />
));

const Protocol = ({
  evaluations,
  isProtocolFormOpen,
  handleClose,
  notifyError,
  notifySuccess,
  evaluation,
}) => {
  const [protocolQuestions, setProtocolQuestions] = useState(null);
  const [
    fullfilledProtocolQuestions,
    setFullFilledProtocolQuestions,
  ] = useState({});
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
  const [isHeadOfTeam, setIsHeadOfTeam] = useState(false);

  const { token, id } = useContext(UserContext);

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
    const fetchProtocol = async (evaluationId) => {
      setLoading(true);
      try {
        const res = await fetch(
          `${config.server.url}/protocolManagement/getProtocol?evaluationId=${evaluationId}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        ).then((res) => res.json());
        setProtocol(res);
        setProtocolQuestions(res);
        setFullFilledProtocolQuestions(res);
      } catch (err) {
        notifyError(t('loading_protocol_error'));
      } finally {
        setLoading(false);
      }
    };
    if (selectedCourse) {
      const currentEvaluation = evaluations.find(
        (evaluation) =>
          evaluation.course.course_code === selectedCourse.course.course_code
      );
      if (currentEvaluation) {
        fetchProtocol(currentEvaluation.id);
      }
    }
  }, [selectedCourse]);

  useEffect(() => {
    setIsHeadOfTeam(
      evaluation.evaluations[0].evaluation_team.some(
        ({ userId, is_head_of_team: isHeadOfTeam }) =>
          userId === id && isHeadOfTeam
      )
    );
  }, [evaluation]);

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
          if (typeof question.answer === 'string') {
            question.answer = {
              answer: parentQuestionChoice,
              [id]: value,
            };
          } else if (typeof question.answer === 'object') {
            question.answer = {
              ...question.answer,
              answer: parentQuestionChoice,
              [id]: value,
            };
          }
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

  const onInternalSectionChangeHandler = (
    e,
    parentSectionTitle,
    internalSection
  ) => {
    setFullFilledProtocolQuestions((prev) => {
      const newProtocol = { ...prev };
      const internalSectionData = newProtocol[parentSectionTitle].find(
        (row) => !row.question_text && !row.question_type
      )[internalSection];

      const internalQuestion = internalSectionData.find(
        (question) => question.question_text === e.target.id
      );
      internalQuestion.answer = e.target.value;
      return newProtocol;
    });
  };

  const handleSubmitProtocol = async () => {
    setSubmitLoading(true);
    const currentEvaluation = evaluations.find(
      (evaluation) =>
        evaluation.course.course_code === selectedCourse.course.course_code
    );
    const body = {
      protocol_json: JSON.stringify(fullfilledProtocolQuestions),
      evaluation_id: currentEvaluation.id,
    };
    try {
      const res = await fetch(
        `${config.server.url}/protocolManagement/fillProtocol`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        }
      );
      if (res.status === 200) {
        notifySuccess(t('protocol_submit_success'));
      } else {
        notifyError(t('protocol_submit_error'));
      }
    } catch (err) {
      notifyError(t('protocol_submit_error'));
    } finally {
      setSubmitLoading(false);
    }
  };
  const handleSubmitDraftProtocol = async () => {
    setSubmitLoading(true);
    const currentEvaluation = evaluations.find(
      (evaluation) =>
        evaluation.course.course_code === selectedCourse.course.course_code
    );
    const body = {
      protocol_draft: JSON.stringify(fullfilledProtocolQuestions),
      evaluation_id: currentEvaluation.id,
    };
    try {
      const res = await fetch(
        `${config.server.url}/protocolManagement/saveDraftProtocol`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        }
      );
      if (res.status === 200) {
        notifySuccess(t('protocol_submit_success'));
      } else {
        notifyError(t('protocol_submit_error'));
      }
    } catch (err) {
      notifyError(t('saving_draft_protocol_error'));
    } finally {
      setSubmitLoading(false);
    }
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
        {evaluation && (
          <TeamMembers
            evaluationTeam={evaluation.evaluations[0].evaluation_team}
          />
        )}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <CircularProgress />
          </Box>
        )}
        {protocolQuestions && !loading && (
          <>
            {Object.keys(protocolQuestions).map((sectionTitle, index) =>
              isHeadOfTeam ? (
                <Section
                  isHeadOfTeam={isHeadOfTeam}
                  sectionTitle={`${index + 1}. ${sectionTitle}`}
                  sectionTitleUnformatted={sectionTitle}
                  sectionData={protocolQuestions[sectionTitle]}
                  key={sectionTitle}
                  onChangeHandler={(e) => onChangeHandler(e, sectionTitle)}
                  onInternalQuestionChangeHandler={
                    onInternalQuestionChangeHandler
                  }
                  onInternalSectionChangeHandler={
                    onInternalSectionChangeHandler
                  }
                />
              ) : (
                <Section
                  isHeadOfTeam={isHeadOfTeam}
                  sectionTitle={`${index + 1}. ${sectionTitle}`}
                  sectionTitleUnformatted={sectionTitle}
                  sectionData={protocolQuestions[sectionTitle]}
                  key={sectionTitle}
                  onChangeHandler={(e) => onChangeHandler(e, sectionTitle)}
                  onInternalQuestionChangeHandler={
                    onInternalQuestionChangeHandler
                  }
                />
              )
            )}
            {isHeadOfTeam && (
              <Box
                sx={{
                  width: '100%',
                  display: 'flex',
                  margin: '0 auto',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Button
                  sx={{ width: '49%' }}
                  variant="outlined"
                  disabled={submitLoading}
                  onClick={handleSubmitDraftProtocol}
                >
                  {submitLoading ? (
                    <CircularProgress size={24} />
                  ) : (
                    t('save_draft')
                  )}
                </Button>
                <Button
                  sx={{ width: '49%' }}
                  variant="contained"
                  onClick={handleSubmitProtocol}
                  disabled={submitLoading}
                >
                  {submitLoading ? <CircularProgress size={24} /> : t('submit')}
                </Button>
              </Box>
            )}
          </>
        )}
      </Box>
    </Dialog>
  );
};

export default Protocol;
