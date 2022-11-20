import React, { useEffect, useState, useContext } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import LinearProgress from '@mui/material/LinearProgress';

import UserContext from '../../../context/UserContext/UserContext.js';
// import AssessmentCard from '../../../components/AssessmentCard/AssessmentCard.js';
import config from '../../../config/index.config.js';
import EvaluationDetails from './EvaluationDetails/EvaluationDetails.js';
// import EvaluationCard from '../../../components/AssessmentCard/EvaluationCard.js';
import AssessmentCard from '../../../components/AssessmentCard/AssessmentCard.js';

const currentlyLoggedInUserId = 15;

export default function MyAssessments({ setSelectedPage, link }) {
  const { token } = useContext(UserContext);
  const [isAssessmentsLoading, setAssessmentsLoading] = useState(false);
  const [assessments, setAssessments] = useState([]);
  const [selectedAssessment, setSelectedAssessment] = useState(null);

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
        }
      )
        .then((response) => response.json())
        .then((data) => {
          setAssessments(data.assessments);
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
              alignContent: 'center',
            }}
          >
            <Typography variant="h5">Assessment List</Typography>
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
            {!isAssessmentsLoading &&
              assessments.map((item) => (
                <AssessmentCard
                  key={item.id}
                  id={item.id}
                  semester={item.name}
                  status={item.status}
                  setId={setSelectedAssessment}
                  isSelected={selectedAssessment === item.id}
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
                (assessment) => assessment.id === selectedAssessment
              )}
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
