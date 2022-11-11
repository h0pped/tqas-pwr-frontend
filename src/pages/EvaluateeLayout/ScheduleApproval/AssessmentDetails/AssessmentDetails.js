import { useEffect, useState, useContext } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
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
import Tooltip from '@mui/material/Tooltip';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Alert from '@mui/material/Alert';
import { LinearProgress } from '@mui/material';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import ClearIcon from '@mui/icons-material/Clear';
import DoneIcon from '@mui/icons-material/Done';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import config from '../../../../config/index.config.js';
import UserContext from '../../../../context/UserContext/UserContext.js';
import DialogAssignTeam from './DialogAssignTeam.js';

export default function AssessmentDetails({ assessmentDetails }) {
  const { t } = useTranslation();
  const { token } = useContext(UserContext);

  const [evaluatees, setEvaluatees] = useState([]);

  const [isEvaluateesTableLoading, setEvaluateesTableLoading] = useState(false);
  const [isRejectDialogOpen, setRejectDialogOpen] = useState(false);

  const handleOpenRejectDialog = () => {
    setRejectDialogOpen(true);
  };

  const handleCloseRejectDialog = () => {
    setRejectDialogOpen(false);
  };

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

  function getEvaluatees() {
    if (assessmentDetails !== undefined) {
      setEvaluateesTableLoading(true);
      try {
        fetch(
          `${config.server.url}/evaluationsManagement/getEvaluateesByAssessment?id=${assessmentDetails.id}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
          },
        )
          .then((response) => response.json())
          .then((data) => {
            setEvaluatees(data.evaluatees);
            setEvaluateesTableLoading(false);
          });
      } catch (error) {
        setEvaluateesTableLoading(false);
        notifyError(t('error_server'));
      }
    }
  }

  useEffect(() => {
    getEvaluatees();
  }, [assessmentDetails]);

  const StyledTableRow = styled(TableRow)(() => ({
    '&:nth-of-type(odd)': {
      backgroundColor: 'rgba(235, 235, 235, 0.53)',
    },
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));

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
          <TableCell width="18%" component="th" scope="row">
            {`${row.evaluation_team.length} ${t('member')}`}
          </TableCell>
          <TableCell width="18%" component="th" scope="row">
            <Tooltip title="Remove evaluatee" placement="top">
              <Button sx={{ width: '100%' }} size="small" variant="contained">
                <DialogAssignTeam />
                {t('assign_team')}
              </Button>
            </Tooltip>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1 }}>
                <Typography variant="h6" gutterBottom component="div">
                  {t('courses')}
                </Typography>
                <Table size="small" aria-label="purchases">
                  <TableHead>
                    <StyledTableRow>
                      <TableCell>{t('course_code')}</TableCell>
                      <TableCell>{t('course_name')}</TableCell>
                      <TableCell>{t('enrolled_students')}</TableCell>
                      <TableCell>{t('details')}</TableCell>
                    </StyledTableRow>
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
                          {course.enrolled_students && course.enrolled_students}
                          {!course.enrolled_students && '---'}
                        </TableCell>
                        <TableCell component="th" scope="row">
                          {course.details}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
              <Box sx={{ margin: 1 }}>
                <Typography variant="h6" gutterBottom component="div">
                  {t('evaluation_team')}
                </Typography>
                {row.evaluation_team.length > 0 && (
                  <Table size="small" aria-label="customized table">
                    <TableHead>
                      <StyledTableRow>
                        <TableCell>{t('label_academic_title')}</TableCell>
                        <TableCell>{t('label_first_name')}</TableCell>
                        <TableCell>{t('label_last_name')}</TableCell>
                        <TableCell>{t('label_email')}</TableCell>
                      </StyledTableRow>
                    </TableHead>
                    <TableBody>
                      {row.evaluation_team.map((member) => (
                        <TableRow key={member.member_email}>
                          <TableCell component="th" scope="row">
                            {member.academic_title}
                          </TableCell>
                          <TableCell component="th" scope="row">
                            {member.first_name}
                          </TableCell>
                          <TableCell component="th" scope="row">
                            {member.last_name}
                          </TableCell>
                          <TableCell component="th" scope="row">
                            {member.member_email}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
                {row.evaluation_team.length === 0 && (
                  <Alert severity="info">
                    <Typography>{t('info_no_et')}</Typography>
                  </Alert>
                )}
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </>
    );
  }

  if (assessmentDetails === undefined) {
    return (
      <Box
        sx={{
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Typography variant="subtitle2" sx={{ color: '#848884' }}>
          {t('select_assesment_on_left_to_see_details')}
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 0.5,
        backgroundColor: '#ffffff',
        boxShadow: 2,
        border: 'solid 1px rgba(235, 235, 235)',
        height: '100%',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <Typography sx={{ mb: 1 }} variant="h5">
          {t('assessment_details')}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexDirection: 'row' }}>
          <Button
            sx={{ mb: 1 }}
            variant="outlined"
            size="small"
            onClick={handleOpenRejectDialog}
            endIcon={<ClearIcon />}
          >
            {t('reject_schedule')}
          </Button>
          <Button
            sx={{ mb: 1 }}
            variant="contained"
            size="small"
            endIcon={<DoneIcon />}
          >
            {t('approve_schedule')}
          </Button>
        </Box>
      </Box>
      <Divider sx={{ m: 0 }} variant="middle" />
      <Box
        sx={{
          mt: 2,
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: '100%',
        }}
      >
        <Box
          sx={{
            mt: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            width: '100%',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
              width: '100%',
            }}
          >
            <Typography sx={{ width: '10%' }}>Status</Typography>
            <Typography sx={{ fontWeight: 'bold' }}>
              {assessmentDetails.status}
            </Typography>
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
              width: '100%',
            }}
          >
            <Typography sx={{ width: '10%' }}>{t('semester')}</Typography>
            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
              {assessmentDetails.name}
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          mt: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          height: '50%',
        }}
      >
        <Divider sx={{ m: 0 }} variant="middle" />
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6">{t('evaluatees')}</Typography>
        </Box>
        <Box sx={{ height: '100%' }}>
          {isEvaluateesTableLoading && <LinearProgress />}
          <TableContainer
            style={{
              border: 'solid 2px rgba(235, 235, 235)',
              borderRadius: 2,
              height: '100%',
            }}
          >
            <Table aria-label="collapsible table">
              <TableHead>
                <TableRow>
                  <TableCell />
                  <TableCell>{t('evaluatee')}</TableCell>
                  <TableCell>{t('label_email')}</TableCell>
                  <TableCell>{t('courses')}</TableCell>
                  <TableCell>{t('evaluation_team')}</TableCell>
                  <TableCell>{t('label_actions')}</TableCell>
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
      <Dialog open={isRejectDialogOpen} onClose={handleCloseRejectDialog}>
        <DialogTitle>{t('reject_schedule')}</DialogTitle>
        <DialogContent>
          <DialogContentText>{t('evaluation_team')}</DialogContentText>
          <Box sx={{ display: 'flex', gap: 1, mt: 1, flexDirection: 'column' }}>
            <TextareaAutosize
              aria-label="minimum height"
              minRows={3}
              style={{ width: '100%' }}
            />
          </Box>
          <Alert severity="info" sx={{ mt: 2 }}>
            {t('info_by_rejecting_this_assessment')}
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleCloseRejectDialog}>
            {t('cancel')}
          </Button>
          <Button variant="contained">{t('send')}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
