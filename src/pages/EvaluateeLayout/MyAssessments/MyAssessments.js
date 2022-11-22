import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import LinearProgress from '@mui/material/LinearProgress';
import { useTranslation } from 'react-i18next';

import EvaluationDetails from './EvaluationDetails/EvaluationDetails.js';
import EvaluationCard from '../../../components/AssessmentCard/EvaluationCard.js';

export default function MyAssessments({ setSelectedPage, link }) {
  const [isAssessmentsLoading] = useState(false);
  const { t } = useTranslation();
  const [assessments] = useState([
    {
      id: 33,
      status: 'Open',
      name: 'Winter 2022/2023',
      createdAt: '2022-11-12T14:53:01.637Z',
      updatedAt: '2022-11-20T13:49:19.576Z',
      supervisor_id: 22,
      num_of_evaluatees: 2,
    },
  ]);
  const [selectedAssessment, setSelectedAssessment] = useState(null);

  useEffect(() => {
    setSelectedPage(link);
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
              assessmentDetails={assessments.find(
                (assessment) => assessment.id === selectedAssessment
              )}
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
