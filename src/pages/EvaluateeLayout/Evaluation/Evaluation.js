import { useEffect, useState, useContext } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import { ToastContainer, toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

import Protocol from '../Protocol/Protocol.js';

import Evaluation from '../../../components/EvaluationCard/EvaluationCard.js';

import UserContext from '../../../context/UserContext/UserContext.js';

import config from '../../../config/index.config.js';

export default function Evaluations({ setSelectedPage, link }) {
  const { t } = useTranslation();
  const { token, id } = useContext(UserContext);

  const [
    evaluationsMemberIsAssignedTo,
    setEvaluationsMemberAssignedTo,
  ] = useState([]);

  const [isProtocolFormOpen, setProtocolFormOpen] = useState(false);
  const [isEvaluationsLoading, setEvaluationsLoading] = useState(false);
  const [currentProtocol, setCurrentProtocol] = useState(null);

  const notifyError = (msg) =>
    toast.error(`${msg}`, {
      position: 'top-center',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'light',
    });
  const notifySuccess = (msg) =>
    toast.success(`${msg}`, {
      position: 'top-center',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'light',
    });

  const handleClose = () => {
    setProtocolFormOpen(false);
  };
  const handleOpenProtocolForm = (protocol) => {
    setCurrentProtocol(protocol);
    setProtocolFormOpen(true);
  };
  async function getEvaluationsETMemberResponsibleFor() {
    setEvaluationsLoading(true);
    try {
      await fetch(
        `${config.server.url}/evaluationsManagement/getEvaluationsETMemberResponsibleFor?id=${id}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
        .then((response) => response.json())
        .then(({ evaluatees }) => {
          setEvaluationsMemberAssignedTo(evaluatees);
        });
    } catch (error) {
      notifyError(t('error_server'));
    } finally {
      setEvaluationsLoading(false);
    }
  }

  useEffect(() => {
    setSelectedPage(link);
    getEvaluationsETMemberResponsibleFor();
  }, [link, setSelectedPage]);

  return (
    <Box>
      <ToastContainer />
      <Grid container spacing={2}>
        <Grid item xs={12} sx={{ height: '100%' }}>
          <Box
            sx={{
              display: 'flex',
              width: '100%',
              flexDirection: 'column',
              height: '80vh',
            }}
          >
            <Box sx={{ width: '100%' }}>
              <Typography variant="h5">{t('awaiting_evaluation')}</Typography>
            </Box>
            <Box
              sx={{
                p: 0.7,
                display: 'flex',
                flexDirection: 'column',
                overflowY: 'scroll',
                height: '100%',
                width: '100%',
                gap: 1,
                mt: 1,
                borderRadius: 1,
                backgroundColor: '#f4f5f7',
              }}
            >
              {isEvaluationsLoading && <LinearProgress />}
              {evaluationsMemberIsAssignedTo?.length === 0 && (
                <Typography variant="subtitle2" sx={{ color: '#848884' }}>
                  {t('no_protocols_found')}
                </Typography>
              )}
              {evaluationsMemberIsAssignedTo?.length > 0 &&
                evaluationsMemberIsAssignedTo.map((evaluation) => (
                  <Evaluation
                    key={evaluation.userId}
                    protocol={evaluation}
                    setOpenProtcolForm={() => {
                      handleOpenProtocolForm(evaluation);
                    }}
                  />
                ))}
            </Box>
          </Box>
        </Grid>
      </Grid>
      {isProtocolFormOpen && (
        <Protocol
          evaluations={currentProtocol?.evaluations}
          isProtocolFormOpen={isProtocolFormOpen}
          handleClose={handleClose}
          evaluation={currentProtocol}
          notifyError={notifyError}
          notifySuccess={notifySuccess}
        />
      )}
    </Box>
  );
}
