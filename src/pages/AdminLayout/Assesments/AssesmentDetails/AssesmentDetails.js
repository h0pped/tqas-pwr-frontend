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
import Alert from '@mui/material/Alert';
import Autocomplete from '@mui/material/Autocomplete';
import { LinearProgress } from '@mui/material';
import Fab from '@mui/material/Fab';
import Link from '@mui/material/Link';
import { Navigate } from 'react-router-dom';
import { assesmentStatuses } from '../../../../constants.js';

import config from '../../../../config/index.config.js';
import UserContext from '../../../../context/UserContext/UserContext.js';

export default function AssesmentDetails({ assesmentDetails }) {
  const [evaluatees, setEvaluatees] = useState([]);
  const [isEvaluateesTableLoading, setEvaluateesTableLoading] = useState(false);
  const [isSendForApprovalDialogOpen, setSendForApprovalDialogOpen] = useState(false);
  const [selectedSupervisor, setSelectedSuprevisor] = useState(null);
  const [supervisors, setSupervisors] = useState([]);

  const { token } = useContext(UserContext);

  const handleOpenSendForApprovalDialog = () => {
    setSendForApprovalDialogOpen(true);
  };

  const handleCloseSendForApprovalDialog = () => {
    setSendForApprovalDialogOpen(false);
  };

  const handleSendScheduleForApproval = () => {
    alert('Sending....');
  };

  function getSupervisors() {
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

        var users = [];

        data.forEach((user) => {
          if (user.user_type === 'head' || user.user_type === 'dean') {
            users.push(`${user.academic_title} ${user.first_name} ${user.last_name}`);
          }
        });
        setSupervisors(users);
      });
  }

  useEffect(() => {
    if (assesmentDetails !== undefined) {
      setEvaluateesTableLoading(true);
      fetch(`${config.server.url}/assesmentData/getEvaluateesByAssesment`,
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
    }
    getSupervisors();
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
                //disabled={isDeleteLoading}
                aria-label="delete"
              // onClick={handleDeleteUser}
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
                    {row.evaluatee.evaluations.map((course) => (
                      <TableRow key={course.course_code}>
                        <TableCell component="th" scope="row">
                          {course.course_code}
                        </TableCell>
                        <TableCell component="th" scope="row">
                          {course.course.course_name}
                        </TableCell>
                        <TableCell component="th" scope="row">
                          TBA
                        </TableCell>
                        <TableCell component="th" scope="row">
                          {course.details}
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
        <Button sx={{ mb: 1 }} variant="text" size="small" onClick={handleOpenSendForApprovalDialog} endIcon={<SendIcon />}>
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
          <Button variant="contained" size="small" endIcon={<Add />}>
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
              disablePortal
              id="combo-box-demo"
              options={supervisors}
              sx={{ flex: 1 }}
              renderInput={(params) => <TextField {...params} label="Supervisor" />}
            />
            {
              supervisors.length === 0 && (
                <Alert severity="warning">
                  No users with role supervisor was found in the system!
                  <br />
                  Go to <Link href="#" onClick={<Navigate to="/users" />}>Manage users</Link> to manage user roles.
                </Alert>
              )
            }
            {
              supervisors.length > 0 && (
                <Alert severity="info">
                  Only the users with role suprvisor are displayed!
                  <br />
                  Go to <Link href="#" onClick={<Navigate to="/users" />}>Manage users</Link> to manage user roles.
                </Alert>
              )
            }
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
