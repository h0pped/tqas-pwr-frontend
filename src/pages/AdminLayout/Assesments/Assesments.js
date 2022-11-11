import { useEffect, useState, useContext } from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import moment from 'moment';
import { LinearProgress } from '@mui/material';

import Add from '@mui/icons-material/Add';

import { semesters } from '../../../constants.js';
import AssesmentCard from '../../../components/AssesmentCard/AssesmentCard.js';
import AssesmentDetails from './AssesmentDetails/AssesmentDetails.js';

import config from '../../../config/index.config.js';
import UserContext from '../../../context/UserContext/UserContext.js';

export default function Assesments({ setDrawerSelectedItem, link }) {
  const { token } = useContext(UserContext);

  const [isCrateAssesmentDialogOpen, setCreateAssesmentDialogOpen] = useState(false);
  const [selectedAssesment, setSelectedAssesment] = useState(null);
  const [selectedSemesterValue, setSelectedSemesterValue] = useState(semesters.find((semester) => moment(new Date().toISOString().slice(0, 10)).isBetween(semester.dateFrom, semester.dateTo, undefined, '[]')));

  const [isAssesmentsLoading, setAssesmentsLoading] = useState(false);

  const [assesments, setAssessments] = useState([]);

  const handleOpenCreateAssesmentDialog = () => {
    setCreateAssesmentDialogOpen(true);
  };

  const handleCloseCreateAssesmentDialog = () => {
    setCreateAssesmentDialogOpen(false);
  };

  const handleCreateNewAssesment = () => {
    handleCloseCreateAssesmentDialog();
    alert('Creating new assesment...');
  };

  const handleDialogSemesterValueChange = (event) => {
    setSelectedSemesterValue(event.target.value);
  };

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
          setAssessments(
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
    setDrawerSelectedItem(link);
    getAssesments();
  }, []);
  return (
    <Box sx={{ flexGrow: 1, height: '75vh' }}>
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
          <Button variant="outlined" onClick={handleCloseCreateAssesmentDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleCreateNewAssesment}>Create</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
