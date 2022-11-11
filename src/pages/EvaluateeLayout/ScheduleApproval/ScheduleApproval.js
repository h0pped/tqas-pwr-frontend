import { useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import AssessmentDetails from './AssessmentDetails/AssessmentDetails.js';

import AssesmentCard from '../../../components/AssessmentCard/AssessmentCard.js';

import UserContext from '../../../context/UserContext/UserContext.js';

import config from '../../../config/index.config.js';

const currentlyLoggedInUserId = 15;

export default function ScheduleApproval({ setSelectedPage, link }) {
  const { t } = useTranslation();
  const { token } = useContext(UserContext);

  const [isAssesmentsLoading, setAssessmentsLoading] = useState(false);

  const [assesments, setAssessments] = useState([]);
  const [selectedAssesment, setSelectedAssesment] = useState(null);

  async function getAssessments() {
    setAssessmentsLoading(true);
    try {
      await fetch(
        `${config.server.url}/evaluationsManagement/getAssessmentsBySupervisor?id=${currentlyLoggedInUserId}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      ).then((response) => response.json())
        .then((data) => {
          setAssessments(
            data.assessments,
          );
          setAssessmentsLoading(false);
        });
    } catch (error) {
      setAssessmentsLoading(false);
    }
  }
  useEffect(() => {
    setSelectedPage(link);
    getAssessments();
  }, [link, setSelectedPage]);

  return (
    <Box sx={{ flexGrow: 1, height: '75vh' }}>
      <Grid container sx={{ height: '100%' }}>
        <Grid item xs={12}>
          <Box
            sx={{
              mb: 2,
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignContent: 'center'
            }}>
            <Typography variant="h5">{t('awaiting_your_approval')}</Typography>
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
              backgroundColor: '#f4f5f7'
            }}
          >
            {isAssesmentsLoading && <LinearProgress />}
            {!isAssesmentsLoading && assesments.map((item) => (
              <AssesmentCard
                key={item.id}
                id={item.id}
                semester={item.name}
                status={item.status}
                setId={setSelectedAssesment}
                isSelected={selectedAssesment === item.id}
                numberOfEvaluatees={item.num_of_evaluatees}
              />
            ))}
          </Box>
        </Grid>
        <Grid item xs={8} sx={{ height: '100%' }}>
          <Box sx={{ p: 0.7, ml: 2, borderRadius: 1, backgroundColor: '#f4f5f7', height: '100%' }}>
            <AssessmentDetails
              assesmentDetails={
                assesments.find((assesment) => assesment.id === selectedAssesment)
              }
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
