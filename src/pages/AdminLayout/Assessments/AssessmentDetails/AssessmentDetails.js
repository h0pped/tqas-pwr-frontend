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
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { toast } from 'react-toastify';
import Autocomplete from '@mui/material/Autocomplete';
import { LinearProgress } from '@mui/material';
import Fab from '@mui/material/Fab';
import { useTranslation } from 'react-i18next';
import CircularProgress from '@mui/material/CircularProgress';

import config from '../../../../config/index.config.js';
import UserContext from '../../../../context/UserContext/UserContext.js';

import generateFileName from '../../../../utils/generateFileName.js';

const download = require('downloadjs');

export default function AssessmentDetails({
  assessmentDetails,
  onAddEvalueatee,
  onSendScheduleForApproval,
}) {
  const { t } = useTranslation();
  const [evaluatees, setEvaluatees] = useState([]);
  const [supervisors, setSupervisors] = useState([]);

  const [selectedSupervisor, setSelectedSupervisor] = useState('');

  const [isEvaluateesTableLoading, setEvaluateesTableLoading] = useState(false);
  const [isSendForApprovalDialogOpen, setSendForApprovalDialogOpen] = useState(
    false
  );

  const [isFileExportLoading, setFileExportLoading] = useState(false);
  const [isUpdated, setUpdated] = useState(false);
  const [isProtocolFileExportLoading, setProtocolFileExportLoading] = useState(
    false
  );

  const { token } = useContext(UserContext);

  const handleOpenSendForApprovalDialog = () => {
    setSendForApprovalDialogOpen(true);
  };

  const handleCloseSendForApprovalDialog = () => {
    setSendForApprovalDialogOpen(false);
  };

  const handleExportAssessmentSchedule = () => {
    setFileExportLoading(true);
    try {
      fetch(
        `${config.server.url}/assessmentManagement/exportAssessmentSchedule?id=${assessmentDetails.id}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
        .then((resp) => resp.blob())
        .then((blob) => {
          const filename = generateFileName(assessmentDetails.name, 'xlsx');
          download(blob, filename);
          setFileExportLoading(false);
          notifySuccess(t('file_successfully_exported'));
        });
    } catch (err) {
      notifyError(t('error_server'));
      setFileExportLoading(false);
    }
  };

  function isProtocolButtonEnabled(status) {
    return (
      status.toLowerCase() === 'in review' ||
      status.toLowerCase() === 'accepted' ||
      status.toLowerCase() === 'rejected'
    );
  }

  const handleProtocolDownload = (evaluatee, fullName) => {
    const idOfFileLoadToast = toast.loading(t('please_wait'));
    setProtocolFileExportLoading(true);
    const { id } = evaluatee.evaluations.find(({ status }) =>
      isProtocolButtonEnabled(status)
    );
    if (id) {
      try {
        fetch(
          `${config.server.url}/protocolManagement/getProtocolPDF?evaluation_id=${id}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
          .then((resp) => resp.blob())
          .then((blob) => {
            const filename = generateFileName(fullName, 'pdf');
            download(blob, filename);
            setProtocolFileExportLoading(false);
            toast.update(idOfFileLoadToast, {
              render: t('file_successfully_exported'),
              type: 'success',
              isLoading: false,
            });
          });
      } catch (err) {
        setProtocolFileExportLoading(false);
        toast.update(idOfFileLoadToast, {
          render: t('error_server'),
          type: 'error',
          isLoading: false,
        });
      }
    } else {
      toast.update(idOfFileLoadToast, {
        render: t('export_pdf_protocol_error'),
        type: 'error',
        isLoading: false,
      });
    }
  };

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

  function handleEvaluateeDeletion(evaluationsOfEvaluatee) {
    evaluationsOfEvaluatee.forEach(({ id }) => {
      deleteEvaluatee(id);
    });
  }

  function deleteEvaluatee(evaluationId) {
    try {
      fetch(`${config.server.url}/evaluationsManagement/deleteEvaluation`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          evaluation_id: evaluationId,
        }),
      }).then((response) => {
        if (response.ok) {
          notifySuccess(t('success_evaluatee_deleted'));
          setUpdated(true);
        } else {
          notifyError(t('error_evaluatee_not_deleted'));
        }
      });
    } catch (error) {
      notifyError(t('error_server'));
    }
  }

  const handleSendScheduleForApproval = () => {
    try {
      fetch(
        `${config.server.url}/assessmentManagement/setAssessmentSupervisor`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: selectedSupervisor,
            assessment_id: assessmentDetails.id,
          }),
        }
      ).then((response) => {
        setSendForApprovalDialogOpen(false);
        if (response.ok) {
          notifySuccess(t('assessment_successfully_sent_for_approval'));
          onSendScheduleForApproval();
        } else {
          notifyError(t('assessment_error_sending_for_approval'));
        }
      });
    } catch (error) {
      notifyError(t('error_server'));
    }
  };

  function getSupervisors() {
    const users = [];
    fetch(`${config.server.url}/userData/getUsers`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        data.sort((a, b) => a - b);
        data.forEach((user) => {
          users.push(
            `${user.academic_title} ${user.first_name} ${user.last_name}`
          );
        });
        setSupervisors(data);
      });
  }

  useEffect(() => {
    if (assessmentDetails !== undefined) {
      setEvaluateesTableLoading(true);
      try {
        fetch(
          `${config.server.url}/assessmentManagement/getEvaluateesByAssessment?id=${assessmentDetails.id}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
          }
        )
          .then((response) => response.json())
          .then(({ evaluatees }) => {
            evaluatees.sort((a, b) => (a.id > b.id ? 1 : -1));
            setEvaluatees(evaluatees);
            setEvaluateesTableLoading(false);
          });
      } catch (error) {
        setEvaluateesTableLoading(false);
        notifyError(t('error_server'));
      }
    }

    getSupervisors();
  }, [assessmentDetails, isUpdated]);

  const handleOpenAddEvaluateeDialog = () => {
    onAddEvalueatee();
  };

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
              {isTableRowOpen ? (
                <KeyboardArrowUpIcon />
              ) : (
                <KeyboardArrowDownIcon />
              )}
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
            {assessmentDetails.status.toLowerCase() !== 'ongoing' &&
              assessmentDetails.status.toLowerCase() !== 'done' && (
                <Tooltip title={t('remove_evaluatee')} placement="top">
                  <Fab
                    size="small"
                    sx={{
                      backgroundColor: '#fafafa',
                      color: '#39e9e9e',
                      '&:hover': { bgcolor: '#D9372A', color: '#FFFFFF' },
                    }}
                    disabled={
                      assessmentDetails.status.toLowerCase() !== 'draft' &&
                      assessmentDetails.status.toLowerCase() !==
                        'changes required'
                    }
                    onClick={() =>
                      handleEvaluateeDeletion(row.evaluatee.evaluations)
                    }
                    aria-label="delete"
                  >
                    <DeleteIcon />
                  </Fab>
                </Tooltip>
              )}

            {(assessmentDetails.status.toLowerCase() === 'ongoing' ||
              assessmentDetails.status.toLowerCase() === 'done') && (
              <Tooltip title={t('download_protocol')} placement="top">
                <Fab
                  size="small"
                  sx={{
                    backgroundColor: '#fafafa',
                    color: '#39e9e9e',
                    '&:hover': { bgcolor: '#D9372A', color: '#FFFFFF' },
                  }}
                  disabled={
                    isProtocolFileExportLoading ||
                    !row.evaluatee.evaluations.some(({ status }) =>
                      isProtocolButtonEnabled(status)
                    )
                  }
                  onClick={() =>
                    handleProtocolDownload(
                      row.evaluatee,
                      `${row.academic_title} ${row.first_name} ${row.last_name}`
                    )
                  }
                  aria-label="download-protocol"
                >
                  <InsertDriveFileIcon />
                </Fab>
              </Tooltip>
            )}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={isTableRowOpen} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1 }}>
                <Typography variant="h6" gutterBottom component="div">
                  {t('courses')}
                </Typography>
                <Table size="small" aria-label="purchases">
                  <TableHead>
                    <TableRow>
                      <TableCell>{t('course_code')}</TableCell>
                      <TableCell>{t('course_name')}</TableCell>
                      <TableCell>{t('enrolled_students')}</TableCell>
                      <TableCell>{t('details')}</TableCell>
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
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            gap: 1,
          }}
        >
          <Box sx={{ position: 'relative' }}>
            {(assessmentDetails.status.toLowerCase() === 'ongoing' ||
              assessmentDetails.status.toLowerCase() === 'done') && (
              <Button
                sx={{ mb: 1 }}
                variant="outlined"
                size="small"
                onClick={handleExportAssessmentSchedule}
                endIcon={<FileDownloadIcon />}
                disabled={isFileExportLoading}
              >
                {t('export_excel')}
              </Button>
            )}
            {isFileExportLoading && (
              <CircularProgress
                size={24}
                sx={{
                  color: 'primary',
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  marginTop: '-16px',
                  marginLeft: '-12px',
                }}
              />
            )}
          </Box>
          {(assessmentDetails.status.toLowerCase() === 'draft' ||
            assessmentDetails.status.toLowerCase() === 'changes required') && (
            <Button
              sx={{ mb: 1 }}
              variant="text"
              size="small"
              onClick={handleOpenSendForApprovalDialog}
              endIcon={<SendIcon />}
            >
              {t('send_for_approval')}
            </Button>
          )}
        </Box>
      </Box>
      <Divider sx={{ m: 0 }} variant="middle" />
      <Box
        sx={{
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
            flexDirection: 'row',
            gap: 2,
            width: '100%',
          }}
        >
          <Box
            sx={{
              width: '100%',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <Typography
                variant="subtitle2"
                sx={{ width: 75, fontWeight: 'bold' }}
              >
                Status
              </Typography>
              <Typography variant="subtitle2" sx={{ width: '40%' }}>
                {t(`${assessmentDetails.status.toLowerCase()}`)}
              </Typography>
            </Box>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <Typography
                variant="subtitle2"
                sx={{ width: 75, fontWeight: 'bold' }}
              >
                {t('semester')}
              </Typography>
              <Typography variant="subtitle2" sx={{ width: '40%' }}>
                {assessmentDetails.name}
              </Typography>
            </Box>
            {assessmentDetails.rejection_reason && (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{ width: 80, fontWeight: 'bold' }}
                >
                  {t('rejection_reason')}
                </Typography>
                <Typography variant="subtitle2" sx={{ width: '40%' }}>
                  {assessmentDetails.rejection_reason}
                </Typography>
              </Box>
            )}

            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <Typography
                variant="subtitle2"
                sx={{ width: 75, fontWeight: 'bold' }}
              >
                {t('department')}
              </Typography>
              <Typography
                variant="subtitle2"
                sx={{
                  width: 'auto',
                }}
              >
                {assessmentDetails.department}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          mt: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          height: '55%',
        }}
      >
        <Divider sx={{ m: 0 }} variant="middle" />
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6">{t('evaluatees')}</Typography>
          <Button
            variant="contained"
            disabled={
              assessmentDetails.status.toLowerCase() !== 'draft' &&
              assessmentDetails.status.toLowerCase() !== 'changes required'
            }
            size="small"
            endIcon={<Add />}
            onClick={handleOpenAddEvaluateeDialog}
          >
            {t('add_evaluatee')}
          </Button>
        </Box>
        <Box sx={{ height: '100%' }}>
          {isEvaluateesTableLoading && <LinearProgress />}
          <TableContainer
            style={{
              maxHeight: '100%',
              border: 'solid 2px rgba(235, 235, 235)',
              borderRadius: 2,
            }}
          >
            <Table aria-label="collapsible table">
              <TableHead>
                <TableRow>
                  <TableCell />
                  <TableCell>{t('evaluatee')}</TableCell>
                  <TableCell>{t('label_email')}</TableCell>
                  <TableCell>{t('number_of_courses')}</TableCell>
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
      <Dialog
        open={isSendForApprovalDialogOpen}
        onClose={handleCloseSendForApprovalDialog}
      >
        <DialogTitle>{t('send_schedule_for_approval')}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t('select_the_person_responsible_for_schedule')}
          </DialogContentText>
          <Box sx={{ display: 'flex', gap: 1, mt: 1, flexDirection: 'column' }}>
            <Autocomplete
              options={supervisors}
              onChange={(event, value) => setSelectedSupervisor(value.id)}
              getOptionLabel={(option) =>
                `${option.academic_title} ${option.first_name} ${option.last_name}`
              }
              id="combo-box-demo"
              sx={{ flex: 1 }}
              renderInput={(params) => (
                <TextField {...params} label={t('supervisor')} />
              )}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleCloseSendForApprovalDialog}>
            {t('cancel')}
          </Button>
          <Button variant="contained" onClick={handleSendScheduleForApproval}>
            {t('send')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
