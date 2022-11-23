import { useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import { toast, ToastContainer } from 'react-toastify';

import AssessmentDetails from './AssessmentDetails/AssessmentDetails.js';

import AssessmentCard from '../../../components/AssessmentCard/AssessmentCard.js';

import UserContext from '../../../context/UserContext/UserContext.js';

import config from '../../../config/index.config.js';
import DialogAssignTeam from './AssessmentDetails/DialogAssignTeam.js';

export default function ScheduleApproval({ setSelectedPage, link }) {
  const { t } = useTranslation();
  const { token, id } = useContext(UserContext);

  const [isAssessmentsLoading, setAssessmentsLoading] = useState(false);

  const [assessments, setAssessments] = useState([]);
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [isAssignTeamDialogOpen, setAssignTeamDialogOpen] = useState(false);
  const [dialogData, setDialogData] = useState([]);

  const notifySuccess = (msg) =>
    toast.success(`${t('success')} ${msg}`, {
      position: 'top-center',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'light',
    });

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

  async function getAssessments() {
    setAssessmentsLoading(true);
    try {
      await fetch(
        `${config.server.url}/assessmentManagement/getAssessmentsBySupervisor?id=${id}`,
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
      <ToastContainer />
      <DialogAssignTeam
        isOpen={isAssignTeamDialogOpen}
        onClose={() => setAssignTeamDialogOpen(false)}
        notifySuccess={notifySuccess}
        notifyError={notifyError}
        assessment={selectedAssessment}
        data={dialogData}
      />
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
              backgroundColor: '#f4f5f7',
            }}
          >
            {isAssessmentsLoading && <LinearProgress />}
            {assessments.length === 0 && (
              <Typography variant="subtitle2" sx={{ color: '#848884' }}>
                {t('no_assessments_awaiting_your_approval')}
              </Typography>
            )}
            {!isAssessmentsLoading &&
              assessments.map((item) => (
                <AssessmentCard
                  key={item.id}
                  id={item.id}
                  semester={item.name}
                  department={item.department}
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
            <AssessmentDetails
              onAssignTeam={() => setAssignTeamDialogOpen(true)}
              assessmentDetails={assessments.find(
                (assessment) => assessment.id === selectedAssessment
              )}
              setEvaluateeDetails={setDialogData}
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
