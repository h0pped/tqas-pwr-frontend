import { useEffect, useState } from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import dayjs from 'dayjs';

import Add from '@mui/icons-material/Add';

import { semesters } from '../../../constants.js';
import AssesmentCard from '../../../components/AssesmentCard/AssesmentCard.js';
import moment from 'moment';

export default function ClassesEvaluation({ setDrawerSelectedItem, link }) {
  const fakeAssesments = [
    {
      id: 1,
      start_date: '2022-10-24 09:46:36.860 +0200',
      semester: 'Winter 2022/2023',
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
      start_date: '2022-09-24 09:46:36.860 +0200',
      semester: 'Winter 2022/2023',
      end_date: '2022-11-24 09:46:36.860 +0200',
      status: 'Active',
      evaluation: {
        id: 2,
        subject_code: 'MA001',
        assessment_id: 1,
        date_created: '2022-09-24 09:46:36.860 +0200',
        occurences: 'pn 9:15-11:00 D-2 s.333',
        status: 'Active',
        schedule_accepted: true,
        reson_declined: null,
      },
    },
    {
      id: 3,
      start_date: '2022-02-27 09:46:36.860 +0200',
      semester: 'Winter 2022/2023',
      end_date: '2022-11-24 09:46:36.860 +0200',
      status: 'Active',
      evaluation: {
        id: 3,
        subject_code: 'MA001',
        assessment_id: 3,
        date_created: '2022-02-27 09:46:36.860 +0200',
        occurences: 'pn 9:15-11:00 D-2 s.333',
        status: 'Active',
        schedule_accepted: true,
        reson_declined: null,
      },
    },
    {
      id: 4,
      start_date: '2022-02-28 09:46:36.860 +0200',
      semester: 'Winter 2022/2023',
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
      start_date: '2022-10-01 09:46:36.860 +0200',
      semester: 'Winter 2022/2023',
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
  const [isCrateAssesmentDialogOpen, setCreateAssesmentDialogOpen] = useState(false);
  const [selectedAssesment, setSelectedAssesment] = useState(fakeAssesments[0].id);
  const [selectedSemesterValue, setSelectedSemesterValue] = useState(semesters.find((semester) => moment(new Date().toISOString().slice(0, 10)).isBetween(semester.dateFrom, semester.dateTo, undefined, '[]')));

  const handleOpenCreateAssesmentDialog = () => {
    setCreateAssesmentDialogOpen(true);
    const currSemester = semesters.find((semester) => moment('2024-02-28').isBetween(semester.dateFrom, semester.dateTo, undefined, '[]'));
    console.log(currSemester);
  };

  const handleCloseCreateAssesmentDialog = () => {
    setCreateAssesmentDialogOpen(false);
  };

  const handleCreateNewAssesment = () => {
    handleCloseCreateAssesmentDialog();
    alert('Creating new assesment...');
  };

  function setSetSelectedCardId(cardId) {
    setSelectedAssesment(cardId);
  }

  const handleDialogSemesterValueChange = (event) => {
    setSelectedSemesterValue(event.target.value);
  };

  useEffect(() => {
    setDrawerSelectedItem(link);
  }, [selectedAssesment]);
  return (
    <Box sx={{ flexGrow: 1, height: '100%' }}>
      <Grid container sx={{ height: '100%' }}>
        <Grid item xs={12}>
          <Box sx={{ mb: 2, display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignContent: 'center' }}>
            <Typography variant="h5">Assesments</Typography>
            <Button variant="contained" size="small" onClick={handleOpenCreateAssesmentDialog} endIcon={<Add />}>
              New assesment
            </Button>
          </Box>
        </Grid>
        <Grid item xs={4} sx={{ height: '100%' }}>
          <Box sx={{ p: 0.7, display: 'flex', flexDirection: 'column', gap: 1, overflowY: 'scroll', height: '70vh', borderRadius: 1, backgroundColor: '#f4f5f7' }}>
            {fakeAssesments.map((item) => (
              <AssesmentCard
                key={item.id}
                id={item.id}
                semester={item.semester}
                status={item.status}
                setId={setSetSelectedCardId}
              />
            ))}
          </Box>
        </Grid>
        <Grid item xs={8}>
          <Box sx={{ p: 2, ml: 2, borderRadius: 0.5, border: 'solid 1px rgba(235, 235, 235)', height: '70vh' }}>
            <Typography sx={{ mb: 1 }} variant="h6">
              Assesment details
            </Typography>
            <Divider sx={{ m: 0 }} variant="middle" />
            <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Typography sx={{ width: '10%' }}>
                  Status
                </Typography>
                <FormControl>
                  <Select
                    value="Active"
                    //onChange={handleChange}
                    displayEmpty
                    inputProps={{ 'aria-label': 'Without label' }}
                    size="small"
                  >
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    <MenuItem value="Active">Active</MenuItem>
                    <MenuItem value={20}>Twenty</MenuItem>
                    <MenuItem value={30}>Thirty</MenuItem>
                  </Select>

                </FormControl>
              </Box>
              <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Typography sx={{ width: '10%' }}>
                  Semester
                </Typography>
                <Typography variant="subtitle2">
                  Winter 2022/2023
                </Typography>
              </Box>
            </Box>

          </Box>
        </Grid>
      </Grid>
      <Dialog open={isCrateAssesmentDialogOpen} onClose={handleCloseCreateAssesmentDialog}>
        <DialogTitle>Create New Assesment</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Select semester of assemsent:
          </DialogContentText>
          <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
            <FormControl variant="standard" sx={{ mt: 1, width: '100%' }}>
              <InputLabel id="demo-simple-select-standard-label">Semester</InputLabel>
              <Select
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                value={selectedSemesterValue}
                onChange={handleDialogSemesterValueChange}
                size="small"
                label="Semester"
              >
                {semesters.map((item) => (
                  <MenuItem key={item} value={item}>{item.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCreateAssesmentDialog}>Cancel</Button>
          <Button onClick={handleCreateNewAssesment}>Create</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
