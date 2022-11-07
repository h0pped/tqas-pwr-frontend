import { useEffect, useState, useContext } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Tooltip from '@mui/material/Tooltip';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import DeleteIcon from '@mui/icons-material/Delete';
import Alert from '@mui/material/Alert';
import Autocomplete from '@mui/material/Autocomplete';
import { LinearProgress } from '@mui/material';
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';

import Fab from '@mui/material/Fab';
import { assesmentStatuses } from '../../../../constants.js';

import config from '../../../../config/index.config.js';
import UserContext from '../../../../context/UserContext/UserContext.js';

export default function AssesmentDetails({ assesmentDetails }) {
  const [evaluatees, setEvaluatees] = useState([]);
  const [isEvaluateesTableLoading, setEvaluateesTableLoading] = useState(false);
  const [isSendForApprovalDialogOpen, setSendForApprovalDialogOpen] = useState(false);

  const { token } = useContext(UserContext);

  const handleOpenSendForApprovalDialog = () => {
    setSendForApprovalDialogOpen(true);
  };

  const handleCloseSendForApprovalDialog = () => {
    setSendForApprovalDialogOpen(false);
  };

  const handleSendScheduleForApproval = () => {
    alert('Sending....');
  }

  useEffect(() => {
    if (assesmentDetails !== undefined) {
      console.log(assesmentDetails.id);
      setEvaluateesTableLoading(true);
      fetch(`${config.server.url}/assesmentData/getEvaluatees`,
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
          console.log(data);
        });
    }
  }, [assesmentDetails]);

  function Row(props) {
    const { row } = props;
    const [open, setOpen] = useState(false);

    return (
      <>
        <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
          <TableCell>
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpen(!open)}
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
          <TableCell component="th" scope="row">
            {`${row.academic_title} ${row.first_name} ${row.last_name}`}
          </TableCell>
          <TableCell component="th" scope="row">
            {row.email}
          </TableCell>
          <TableCell component="th" scope="row">
            {row.evaluatee.evaluated_classes.length}
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
                aria-label="delete"
              >
                <DeleteIcon />
              </Fab>
            </Tooltip>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={open} timeout="auto" unmountOnExit>
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
                    {row.evaluatee.evaluated_classes.map((course) => (
                      <TableRow key={course.subject_code}>
                        <TableCell component="th" scope="row">
                          {course.subject_code}
                        </TableCell>
                        <TableCell component="th" scope="row">
                          {course.course_name}
                        </TableCell>
                        <TableCell component="th" scope="row">
                          TBA
                        </TableCell>
                        <TableCell component="th" scope="row">
                          {course.evaluations.map((occurence) => (`${occurence.details}\n`))}
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
      <Box sx={{ pt: 1, pb: 1, display: 'flex', width: '100%', flexDirection: 'row', justifyContent: 'space-between' }}>
        <Typography variant="h5">
          Assesment details
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1 }}>
          <Button variant="outlined" size="small" endIcon={<CloseIcon />}>
            Decline schedule
          </Button>
          <Button variant="contained" size="small" endIcon={<DoneIcon />}>
            Approve schedule
          </Button>
        </Box>
      </Box>
      <Divider sx={{ m: 0 }} variant="middle" />
      <Box sx={{ mt: 2, display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
        <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Typography sx={{ width: '10%' }}>
              Status
            </Typography>
            <Typography sx={{ fontWeight: 'bold' }}>
              {assesmentDetails.status}
            </Typography>
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
      <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Divider sx={{ m: 0 }} variant="middle" />
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6">
            Evaluatees
          </Typography>
        </Box>
        <Box>
          {isEvaluateesTableLoading && <LinearProgress />}
          <TableContainer component={Paper}>
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
              disablePortal
              id="combo-box-demo"
              options={'Dr. hab. Bob Bob'}
              sx={{ flex: 1 }}
              renderInput={(params) => <TextField {...params} label="Supervisor" />}
            />
            <Alert severity="warning">No users with role supervisor was found in the system! <br /> Go to &apos;Manage users&apos; to manage user roles.</Alert>
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
