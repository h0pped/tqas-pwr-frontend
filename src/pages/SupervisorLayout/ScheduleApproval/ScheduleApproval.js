import { useEffect, useState, useContext } from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { LinearProgress } from '@mui/material';

import AssesmentCard from '../../../components/AssesmentCard/AssesmentCard.js';
import AssesmentDetails from './AssesmentDetails/AssesmentDetails.js';

import config from '../../../config/index.config.js';
import UserContext from '../../../context/UserContext/UserContext.js';

export default function ScheduleApproval() {
  const { token } = useContext(UserContext);

  const [isAssesmentsLoading, setAssesmentsLoading] = useState(false);
  const [selectedAssesment, setSelectedAssesment] = useState(null);

  const [assesments, setAssements] = useState([]);

  async function getAssesments() {
    setAssesmentsLoading(true);
    try {
      await fetch(
        `${config.server.url}/assesmentData/getAssesments`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      ).then((response) => response.json())
        .then((data) => {
          console.log(data);
          setAssements(
            data,
          );
          setAssesmentsLoading(false);
        });
    } catch (error) {
      alert('Error');
      setAssesmentsLoading(false);
    }
  }

  useEffect(() => {
    getAssesments();
  }, []);
  return (
    <Box sx={{ flexGrow: 1, height: '75vh' }}>
      <Grid container sx={{ height: '100%' }}>
        <Grid item xs={12}>
          <Box sx={{ mb: 2, display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignContent: 'center' }}>
            <Typography variant="h5">Assesments</Typography>
          </Box>
        </Grid>
        <Grid item xs={4} sx={{ height: '100%' }}>
          <Box sx={{ p: 0.7, display: 'flex', flexDirection: 'column', gap: 1, overflowY: 'scroll', height: '100%', borderRadius: 1, backgroundColor: '#f4f5f7' }}>
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
            <AssesmentDetails
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
