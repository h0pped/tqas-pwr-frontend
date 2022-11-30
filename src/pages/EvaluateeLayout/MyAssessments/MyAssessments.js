import React, { useEffect, useState, useContext } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import LinearProgress from '@mui/material/LinearProgress';
import { useTranslation } from 'react-i18next';
import { toast, ToastContainer } from 'react-toastify';

import EvaluationDetails from './EvaluationDetails/EvaluationDetails.js';
import EvaluationCard from '../../../components/AssessmentCard/EvaluationCard.js';
import UserContext from '../../../context/UserContext/UserContext.js';
import config from '../../../config/index.config.js';

export default function MyAssessments({ setSelectedPage, link }) {
  const [isAssessmentsLoading, setAssessmentsLoading] = useState(false);
  const { t } = useTranslation();
  const { token, id } = useContext(UserContext);
  const [assessments, setAssessments] = useState([]);
  const [selectedAssessment, setSelectedAssessment] = useState(null);

  const notifyError = (msg) =>
    toast.error(`${t('error_dialog')} ${msg}`, {
      position: 'top-center',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'light',
    });

  async function getEvaluationByEvaluatee() {
    setAssessmentsLoading(true);
    try {
      await fetch(
        `${config.server.url}/evaluationsManagement/getEvaluationByEvaluatee?id=${id}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
        .then((response) => response.json())
        .then(({ evaluatee }) => {
          setAssessments(evaluatee);
          setAssessmentsLoading(false);
        });
    } catch (error) {
      setAssessmentsLoading(false);
      notifyError(t('error_server'));
    }
  }

  useEffect(() => {
    setSelectedPage(link);
    getEvaluationByEvaluatee();
  }, [link, setSelectedPage]);

  return (
    <Box sx={{ flexGrow: 1, height: '75vh' }}>
      <ToastContainer />
      <Grid container sx={{ height: '100%' }}>
        <Grid item xs={12}>
          <Box
            sx={{
              mb: 2,
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignContent: 'center',
            }}
          >
            <Typography variant="h5">
              {t('drawer_item_title_classes_eval')}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={4} sx={{ height: '100%' }}>
          <Box
            sx={{
              p: 0.7,
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
              overflowY: 'scroll',
              height: '100%',
              borderRadius: 1,
              backgroundColor: '#f4f5f7',
            }}
          >
            {isAssessmentsLoading && <LinearProgress />}
            {assessments.length === 0 && (
              <Typography variant="subtitle2" sx={{ color: '#848884' }}>
                {t('no_assessments')}
              </Typography>
            )}
            {!isAssessmentsLoading &&
              assessments.map((item) => (
                <EvaluationCard
                  key={item.evaluations[0].id}
                  id={item.evaluations[0].id}
                  semester={item.evaluations[0].assessment.name}
                  status={item.evaluations[0].status}
                  setId={setSelectedAssessment}
                  isSelected={selectedAssessment === item.evaluations[0].id}
                  numberOfEvaluatees={item.num_of_evaluatees}
                />
              ))}
          </Box>
        </Grid>
        <Grid item xs={8} sx={{ height: '100%' }}>
          <Box
            sx={{
              p: 0.7,
              ml: 2,
              borderRadius: 1,
              backgroundColor: '#f4f5f7',
              height: '100%',
            }}
          >
            <EvaluationDetails
              evaluationDetails={assessments.find(
                (assessment) =>
                  assessment.evaluations[0].id === selectedAssessment
              )}
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
