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
import { ToastContainer, toast } from 'react-toastify';
import { LinearProgress } from '@mui/material';
import { useTranslation } from 'react-i18next';

import Add from '@mui/icons-material/Add';

import { semesters } from '../../../constants.js';

import AssesmentCard from '../../../components/AssesmentCard/AssesmentCard.js';
import AssesmentDetails from './AssessmentDetails/AssessmentDetails.js';

import config from '../../../config/index.config.js';
import UserContext from '../../../context/UserContext/UserContext.js';

export default function Assessments({ setDrawerSelectedItem, link }) {
  const { token } = useContext(UserContext);

  const { t } = useTranslation();

  const notifySuccess = (msg) => toast.success(`${t('success')} ${msg}`, {
    position: 'top-center',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: 'light',
  });

  const notifyError = (msg) => toast.error(`${t('error_dialog')} ${msg}`, {
    position: 'top-center',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: 'light',
  });

  const [isCrateAssesmentDialogOpen, setCreateAssesmentDialogOpen] = useState(false);
  const [selectedAssesment, setSelectedAssesment] = useState(null);
  const [selectedSemesterValue, setSelectedSemesterValue] = useState(
    semesters.find((semester) => moment(new Date().toISOString().slice(0, 10)).isBetween(semester.dateFrom, semester.dateTo, undefined, '[]')),
  );

  const [isAssesmentsLoading, setAssesmentsLoading] = useState(false);
  const [isAssesmentsUpdated, setIsAssesmentsUpdated] = useState(false);

  const [assesments, setAssements] = useState([]);

  const handleOpenCreateAssesmentDialog = () => {
    setCreateAssesmentDialogOpen(true);
  };

  const handleCloseCreateAssesmentDialog = () => {
    setCreateAssesmentDialogOpen(false);
  };

  const handleDialogSemesterValueChange = (event) => {
    setSelectedSemesterValue(event.target.value);
  };

  const handleCreateNewAssesment = () => {
    handleCloseCreateAssesmentDialog();
    setIsAssesmentsUpdated(false);
    try {
      fetch(
        `${config.server.url}/evaluationsManagement/createAssessment`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: selectedSemesterValue.label,
          }),
        },
      ).then((response) => {
        if (response.ok) {
          notifySuccess(t('success_user_created'));
          setIsAssesmentsUpdated(true);
        } else {
          notifyError(t('error_user_not_created'));
        }
      });
    } catch (error) {
      notifyError(t('error_server'));
    }
  };

  async function getAssesments() {
    setAssesmentsLoading(true);
    try {
      await fetch(
        `${config.server.url}/evaluationsManagement/getAssessments`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      ).then((response) => response.json())
        .then((data) => {
          setAssements(
            data.assessments.sort((a, b) => b.id - a.id),
          );
          setAssesmentsLoading(false);
        });
    } catch (error) {
      setAssesmentsLoading(false);
      notifyError(t('error_server'));
    }
  }

  useEffect(() => {
    setDrawerSelectedItem(link);
    getAssesments();
  }, [isAssesmentsUpdated]);

  return (
    <Box sx={{ flexGrow: 1, height: '75vh' }}>
      <ToastContainer />
      <Grid container sx={{ height: '100%' }}>
        <Grid item xs={12}>
          <Box sx={{ mb: 2, display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignContent: 'center' }}>
            <Typography variant="h5">{t('drawer_item_title_classes_eval')}</Typography>
            <Button variant="contained" size="small" onClick={handleOpenCreateAssesmentDialog} endIcon={<Add />}>
              {t('new_assesment')}
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
        <DialogTitle>{t('create_new_assesment')}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t('select_semester')}
          </DialogContentText>
          <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
            <FormControl variant="standard" sx={{ mt: 1, width: '100%' }}>
              <InputLabel id="semster-select">{t('semester')}</InputLabel>
              <Select
                labelId="semster-select"
                id="semster-select-standard"
                value={selectedSemesterValue}
                onChange={handleDialogSemesterValueChange}
                size="small"
                label="Semester"
              >
                {semesters.map((item) => (
                  <MenuItem key={item.label} value={item}>{item.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleCloseCreateAssesmentDialog}>{t('cancel')}</Button>
          <Button variant="contained" onClick={handleCreateNewAssesment}>{t('create')}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
