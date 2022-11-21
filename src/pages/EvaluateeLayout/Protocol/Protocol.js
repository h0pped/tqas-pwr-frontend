import { forwardRef, useState, useEffect, useContext } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { Typography, Slide } from '@mui/material';

import { useTranslation } from 'react-i18next';

import UserContext from '../../../context/UserContext/UserContext.js';

import config from '../../../config/index.config.js';

import Section from './Section.js';

const Transition = forwardRef((props, ref) => (
  <Slide direction="up" ref={ref} {...props} />
));

const Protocol = ({ isProtocolFormOpen, handleClose }) => {
  const [protocolQuestions, setProtocolQuestions] = useState(null);
  const [, setFullFilledProtocolQuestions] = useState({});
  const [, setProtocol] = useState(null);
  const { token } = useContext(UserContext);

  useEffect(() => {
    const fetchProtocol = async () => {
      const res = await fetch(
        `${config.server.url}/protocolManagement/getProtocol?protocol_id=1`,
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
    };
    fetchProtocol();
  }, []);

  const { t } = useTranslation();

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
        {protocolQuestions &&
          Object.keys(protocolQuestions).map((sectionTitle, index) => (
            <Section
              sectionTitle={`${index + 1}. ${sectionTitle}`}
              sectionTitleUnformatted={sectionTitle}
              sectionData={protocolQuestions[sectionTitle]}
              key={sectionTitle}
              onChangeHandler={(e) => onChangeHandler(e, sectionTitle)}
              onInternalQuestionChangeHandler={onInternalQuestionChangeHandler}
            />
          ))}
      </Box>
    </Dialog>
  );
};

export default Protocol;
