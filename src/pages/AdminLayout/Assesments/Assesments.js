import { useEffect } from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';

import Add from '@mui/icons-material/Add';

import AssesmentCard from '../../../components/AssesmentCard/AssesmentCard.js';

export default function ClassesEvaluation({ setDrawerSelectedItem, link }) {
  const fakeAssesments = [
    {
      id: 1,
      start_fate: '2022-10-24 09:46:36.860 +0200',
      end_date: '2022-11-24 09:46:36.860 +0200',
      status: 'Active',
      evaluation: {
        id: 1,
        subject_code: 'MA001',
        assessment_id: 1,
        date_created: '2022-10-24 09:46:36.860 +0200',
        occurences: 'pn 9:15-11:00 D-2 s.333',
        status: 'Active',
        schedule_accepted: true,
        reson_declined: null,
      },
    },
    {
      id: 2,
      start_fate: '2022-10-24 09:46:36.860 +0200',
      end_date: '2022-11-24 09:46:36.860 +0200',
      status: 'Active',
      evaluation: {
        id: 2,
        subject_code: 'MA001',
        assessment_id: 1,
        date_created: '2022-10-24 09:46:36.860 +0200',
        occurences: 'pn 9:15-11:00 D-2 s.333',
        status: 'Active',
        schedule_accepted: true,
        reson_declined: null,
      },
    },
    {
      id: 3,
      start_fate: '2022-10-24 09:46:36.860 +0200',
      end_date: '2022-11-24 09:46:36.860 +0200',
      status: 'Active',
      evaluation: {
        id: 3,
        subject_code: 'MA001',
        assessment_id: 3,
        date_created: '2022-10-24 09:46:36.860 +0200',
        occurences: 'pn 9:15-11:00 D-2 s.333',
        status: 'Active',
        schedule_accepted: true,
        reson_declined: null,
      },
    },
    {
      id: 4,
      start_fate: '2022-10-24 09:46:36.860 +0200',
      end_date: '2022-11-24 09:46:36.860 +0200',
      status: 'Active',
      evaluation: {
        id: 4,
        subject_code: 'MA001',
        assessment_id: 4,
        date_created: '2022-10-24 09:46:36.860 +0200',
        occurences: 'pn 9:15-11:00 D-2 s.333',
        status: 'Active',
        schedule_accepted: true,
        reson_declined: null,
      },
    },
    {
      id: 5,
      start_fate: '2022-10-24 09:46:36.860 +0200',
      end_date: '2022-11-24 09:46:36.860 +0200',
      status: 'Active',
      evaluation: {
        id: 5,
        subject_code: 'MA001',
        assessment_id: 5,
        date_created: '2022-10-24 09:46:36.860 +0200',
        occurences: 'pn 9:15-11:00 D-2 s.333',
        status: 'Active',
        schedule_accepted: true,
        reson_declined: null,
      },
    },
  ];

  useEffect(() => {
    setDrawerSelectedItem(link);
  }, []);
  return (
    <Box sx={{ flexGrow: 1, height: '100%' }}>
      <Grid container sx={{ height: '100%' }}>
        <Grid item xs={12}>
          <Box sx={{ mb: 2, display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignContent: 'center' }}>
            <Typography variant="h5">Assesments</Typography>
            <Button variant="contained" size="small" endIcon={<Add />}>
              New assesment
            </Button>
          </Box>
        </Grid>
        <Grid item xs={4} sx={{ height: '100%' }}>
          <Box sx={{ p: 0.7, display: 'flex', flexDirection: 'column', gap: 1, overflowY: 'scroll', height: '70vh', borderRadius: 1, backgroundColor: '#f4f5f7' }}>
            {fakeAssesments.map(() => (
              <AssesmentCard />
            ))}
          </Box>
        </Grid>
        <Grid item xs={8}>
          <Box sx={{ p: 2, ml: 2, borderRadius: 0.5, border: 'solid 1px rgba(235, 235, 235)', height: '70vh' }}>
            <Typography sx={{ pl: 2, mb: 1 }} variant="h6">
              Assesment details
            </Typography>
            <Divider variant="middle" />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
