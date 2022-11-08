import { useEffect, useState, useContext } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Add from '@mui/icons-material/Add.js';
import Tooltip from '@mui/material/Tooltip';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import { toast } from 'react-toastify';
import Autocomplete from '@mui/material/Autocomplete';
import { LinearProgress } from '@mui/material';
import Fab from '@mui/material/Fab';
import { useTranslation } from 'react-i18next';
import { assesmentStatuses } from '../../../../constants.js';

import config from '../../../../config/index.config.js';
import UserContext from '../../../../context/UserContext/UserContext.js';

export default function AssesmentDetails({ assesmentDetails }) {
  const { t } = useTranslation();

  const [evaluatees, setEvaluatees] = useState([]);
  const [supervisors, setSupervisors] = useState([]);

  const [selectedSupervisor, setSelectedSupervisor] = useState('');

  const [isEvaluateesTableLoading, setEvaluateesTableLoading] = useState(false);
  const [isSendForApprovalDialogOpen, setSendForApprovalDialogOpen] = useState(false);

  const { token } = useContext(UserContext);

  const handleOpenSendForApprovalDialog = () => {
    setSendForApprovalDialogOpen(true);
  };

  const handleCloseSendForApprovalDialog = () => {
    setSendForApprovalDialogOpen(false);
  };

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

  const handleSendScheduleForApproval = () => {
    try {
      fetch(`${config.server.url}/evaluationsManagement/setAssessmentSupervisor`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: selectedSupervisor,
            assessment_id: assesmentDetails.id,
          }),
        }).then((response) => {
        setSendForApprovalDialogOpen(false);
        if (response.ok) {
          notifySuccess('Assesment was successfully sent for approval.');
        } else {
          notifyError('There was an error while trying to send this schedule for approval.');
        }
      });
    } catch (error) {
      notifyError(t('error_server'));
    }
  };

  function getSupervisors() {
    const users = [];
    fetch(
      `${config.server.url}/userData/getUsers`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    ).then((response) => response.json())
      .then((data) => {
        data.sort((a, b) => a - b);
        data.forEach((user) => {
          users.push(`${user.academic_title} ${user.first_name} ${user.last_name}`);
        });
        setSupervisors(data);
      });
  }

  useEffect(() => {
    if (assesmentDetails !== undefined) {
      setEvaluateesTableLoading(true);
      try {
        fetch(`${config.server.url}/evaluationsManagement/getEvaluateesByAssesment`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              id: assesmentDetails.id,
            }),
          }).then((response) => response.json())
          .then((data) => {
            setEvaluatees(data);
            setEvaluateesTableLoading(false);
          });
      } catch (error) {
        setEvaluateesTableLoading(false);
        notifyError(t('error_server'));
      }
    }

    getSupervisors();
  }, [assesmentDetails]);

  function Row(props) {
    const { row } = props;
    const [isTableRowOpen, setTableRowOpen] = useState(false);

    return (
      <>
        <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
          <TableCell>
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setTableRowOpen(!isTableRowOpen)}
            >
              {isTableRowOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
          <TableCell component="th" scope="row">
            {`${row.academic_title} ${row.first_name} ${row.last_name}`}
          </TableCell>
          <TableCell component="th" scope="row">
            {row.email}
          </TableCell>
          <TableCell component="th" scope="row">
            {row.evaluatee.evaluations.length}
          </TableCell>
          <TableCell component="th" scope="row">
            <Tooltip title="Remove evaluatee" placement="top">
              <Fab
                size="small"
                sx={{
                  backgroundColor: '#fafafa',
                  color: '#39e9e9e',
                  '&:hover': { bgcolor: '#D9372A', color: '#FFFFFF' },
                }}
                disabled={assesmentDetails.status !== 'Draft'}
                aria-label="delete"
              >
                <DeleteIcon />
              </Fab>
            </Tooltip>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={isTableRowOpen} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1 }}>
                <Typography variant="h6" gutterBottom component="div">
                  Courses
                </Typography>
                <Table size="small" aria-label="purchases">
                  <TableHead>
                    <TableRow>
                      <TableCell>Course code</TableCell>
                      <TableCell>Course name</TableCell>
                      <TableCell>Enrolled students</TableCell>
                      <TableCell>Details</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {row.evaluatee.evaluations.map((evaluation) => (
                      <TableRow key={evaluation.course_code}>
                        <TableCell component="th" scope="row">
                          {evaluation.course_code}
                        </TableCell>
                        <TableCell component="th" scope="row">
                          {evaluation.course.course_name}
                        </TableCell>
                        <TableCell component="th" scope="row">
                          {evaluation.enrolled_students}
                        </TableCell>
                        <TableCell component="th" scope="row">
                          {evaluation.details}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </>
    );
  }

  if (assesmentDetails === undefined) {
    return (
      <Box sx={{
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
      >
        <Typography variant="subtitle2" sx={{ color: '#848884' }}>Select assesment on the left to see details</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2, borderRadius: 0.5, backgroundColor: '#ffffff', boxShadow: 2, border: 'solid 1px rgba(235, 235, 235)', height: '100%' }}>
      <Box sx={{ display: 'flex', width: '100%', flexDirection: 'row', justifyContent: 'space-between' }}>
        <Typography sx={{ mb: 1 }} variant="h5">
          Assesment details
        </Typography>
        <Button
          sx={{ mb: 1 }}
          disabled={assesmentDetails.status !== 'Draft'}
          variant="text"
          size="small"
          onClick={handleOpenSendForApprovalDialog}
          endIcon={<SendIcon />}
        >
          Send for approval
        </Button>
      </Box>
      <Divider sx={{ m: 0 }} variant="middle" />
      <Box sx={{ mt: 2, display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
        <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Typography sx={{ width: '10%' }}>
              Status
            </Typography>
            <FormControl>
              <Select
                value={assesmentDetails.status}
                displayEmpty
                inputProps={{ 'aria-label': 'Without label' }}
                size="small"
              >
                {assesmentStatuses.map((status) => (
                  <MenuItem value={status}>{status}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Typography sx={{ width: '10%' }}>
              Semester
            </Typography>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
              {assesmentDetails.name}
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2, height: '55%' }}>
        <Divider sx={{ m: 0 }} variant="middle" />
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6">
            Evaluatees
          </Typography>
          <Button
            variant="contained"
            disabled={assesmentDetails.status !== 'Draft'}
            size="small"
            endIcon={<Add />}
          >
            Add evaluatee
          </Button>
        </Box>
        <Box sx={{ height: '100%' }}>
          {isEvaluateesTableLoading && <LinearProgress />}
          <TableContainer style={{ maxHeight: '100%', border: 'solid 2px rgba(235, 235, 235)', borderRadius: 2 }}>
            <Table aria-label="collapsible table">
              <TableHead>
                <TableRow>
                  <TableCell />
                  <TableCell>Evaluatee</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Number of courses</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {evaluatees.map((row) => (
                  <Row key={row.id} row={row} />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
      <Dialog open={isSendForApprovalDialogOpen} onClose={handleCloseSendForApprovalDialog}>
        <DialogTitle>Send schedule for approval</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Select the person responsible for schedule:
          </DialogContentText>
          <Box sx={{ display: 'flex', gap: 1, mt: 1, flexDirection: 'column' }}>
            <Autocomplete
              options={supervisors}
              onChange={(event, value) => setSelectedSupervisor(value.id)}
              getOptionLabel={(option) => `${option.academic_title} ${option.first_name} ${option.last_name}`}
              id="combo-box-demo"
              sx={{ flex: 1 }}
              renderInput={(params) => <TextField {...params} label="Supervisor" />}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleCloseSendForApprovalDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleSendScheduleForApproval}>Send</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
