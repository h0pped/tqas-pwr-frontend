import { useEffect, useState, forwardRef, useContext, useReducer } from 'react';
import { styled } from '@mui/material/styles';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import Fab from '@mui/material/Fab';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import SaveIcon from '@mui/icons-material/Save';
import Tooltip from '@mui/material/Tooltip';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Alert from '@mui/material/Alert';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';

import config from '../../../../config/index.config.js';
import UserContext from '../../../../context/UserContext/UserContext.js';
import ChangesMightBeLostDialog from '../../../../components/ChangesMightBeLostDialog/ChangesMightBeLostDialog.js';

const Transition = forwardRef((props, ref) => (
  <Slide direction="up" ref={ref} {...props} />
));

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  [theme.breakpoints.up('md')]: {
    width: `calc (1000px)`,
  },
  border: 'solid 1px #f4f5f7',
}));

export default function DialogAssignTeam({ isOpen, onClose, data }) {
  // eslint-disable-next-line no-unused-vars
  const [ignored, forceUpdate] = useReducer((x) => x + 1, 0);

  const { token } = useContext(UserContext);
  const { t } = useTranslation();

  const [wzhzList, setWzhzList] = useState({ wzhzList: [] });
  const [outsideList, setOutsideList] = useState({ outsideList: [] });

  const [selectedWzhzMember, setSelectedWzhzMember] = useState(null);
  const [selectedOutsideUser, setSelectedOutsideUser] = useState(null);

  const [currentEvaluationTeam, setCurrentEvaluationTeam] = useState(null);
  const [evaluations, setEvaluations] = useState(null);

  const [isSaveLoading, setSaveLoading] = useState(false);
  const [isDeleteLoading, setDeleteLoading] = useState(false);

  const [virtualUsers, setVirtualUsers] = useState([]);

  const [teamLeader, setTeamLeader] = useState(null);

  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [memberForDeletion, setMemberForDeletion] = useState(null);
  const [
    isDeleteWZHZMemberDialogOpen,
    setDeleteWZHZMemberDialogOpen,
  ] = useState(false);

  const [
    isChangesMightBeLostDialogOpen,
    setChangesMightBeLostDialogOpen,
  ] = useState(false);

  const [isChangesMade, setChangesMade] = useState(false);

  const notifySuccess = (msg) =>
    toast.success(`${t('success')} ${msg}`, {
      position: 'top-center',
      autoClose: 8000,
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
      autoClose: 8000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'light',
    });

  const notifyInfo = (msg) =>
    toast.info(`${msg}`, {
      position: 'top-center',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'light',
    });

  const handleCloseDialog = () => {
    if (isChangesMade) {
      setChangesMightBeLostDialogOpen(true);
    } else {
      onClose();
    }
  };

  const handleRemoveMember = (userId) => {
    setMemberForDeletion(userId);
    setDeleteLoading(true);

    if (isWzhzMemeber(userId)) {
      setDeleteWZHZMemberDialogOpen(true);
    } else {
      setDeleteDialogOpen(true);
    }
  };

  const handleDeleteDialogOptionNo = () => {
    setDeleteDialogOpen(false);
    setDeleteLoading(false);
  };

  const handleDeleteWZHZMemberDialogOptionNo = () => {
    setDeleteWZHZMemberDialogOpen(false);
    setDeleteLoading(false);
  };

  const handleDeleteDialogOptionYes = async () => {
    setDeleteDialogOpen(false);
    removeMember();
  };

  const handleDeleteWZHZMemberDialogOptionYes = async () => {
    setDeleteWZHZMemberDialogOpen(false);
    removeMember();
  };

  function getWzhzList() {
    try {
      fetch(`${config.server.url}/wzhzData/getMembers`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((wzhzUsers) => {
          setWzhzList(wzhzUsers.filter((user) => user.id !== data.id));
        });
    } catch (error) {
      notifyError(t('error_server'));
    }
  }

  function getOutsideList() {
    try {
      fetch(`${config.server.url}/userData/getUsers`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((users) => {
          setOutsideList(users.filter((user) => user.id !== data.id));
        });
    } catch (error) {
      notifyError(t('error_server'));
    }
  }

  function addMember(user) {
    if (
      Object.values(currentEvaluationTeam)[0].some(
        (member) => Number(Object.keys(member)[0]) === Number(user)
      )
    ) {
      notifyError(t('user_already_selected'));
    } else {
      setVirtualUsers((oldArray) => [...oldArray, user]);
      setChangesMade(true);
      const updatedEvalTeam = currentEvaluationTeam;
      evaluations.forEach((evaluation) => {
        const newUser = {};
        newUser[user] = false;
        updatedEvalTeam[evaluation].push(newUser);
        setCurrentEvaluationTeam(updatedEvalTeam);
        forceUpdate();
      });
      notifyInfo(t('selection_added'));
    }
  }

  function saveEvaluationTeam() {
    if (isChangesMade) {
      if (isCurrentEvaluationTeamHasWZHZMember()) {
        setSaveLoading(true);
        try {
          fetch(
            `${config.server.url}/evaluationsManagement/createEvaluationTeams`,
            {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${token}`,
                Accept: 'application/json',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(currentEvaluationTeam),
            }
          ).then((response) => {
            if (response.ok) {
              notifySuccess(t('et_save_success'));
              setChangesMade(false);
              setSaveLoading(false);
              setLeader(null);
              onClose();
            } else {
              notifyError(t('et_save_error'));
              setChangesMade(false);
              setSaveLoading(false);
              setTeamLeader(null);
              onClose();
            }
          });
        } catch (error) {
          notifyError(t('server_error'));
        }
      } else {
        notifyError(t('error_at_least_one_wzhz_member'));
      }
    } else {
      notifyInfo(t('no_changes_to_save'));
    }
  }

  function removeMemberEntry(id) {
    evaluations.forEach((evaluation) => {
      const etForEvaluation = currentEvaluationTeam[evaluation];
      const index = etForEvaluation.findIndex(
        (member) => Number(Object.keys(member)[0]) === Number(id)
      );
      if (index > -1) {
        currentEvaluationTeam[evaluation].splice(index, 1);
      }
    });
    notifyInfo(t('selection_removed'));
    forceUpdate();
    setDeleteLoading(false);
    setChangesMade(true);
  }

  function removeMember() {
    if (memberForDeletion) {
      const id = memberForDeletion;

      if (virtualUsers.includes(Number(id))) {
        removeMemberEntry(id);
      } else {
        try {
          evaluations.forEach((evaluation, i) => {
            fetch(
              `${config.server.url}/evaluationsManagement/removeEvaluationTeamMember`,
              {
                method: 'POST',
                headers: {
                  Authorization: `Bearer ${token}`,
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId: id, evaluationId: evaluation }),
              }
            ).then((response) => {
              if (response.ok) {
                if (i === evaluations.length - 1) {
                  removeMemberEntry(id);
                }
              } else {
                if (i === evaluations.length - 1) {
                  notifyError(t('error_delete_et_member'));
                }
                setDeleteLoading(false);
              }
            });
          });
        } catch (error) {
          notifyError('error_server');
          setDeleteLoading(false);
        }
      }
    }
  }

  function isCurrentEvaluationTeamHasWZHZMember() {
    let isContains = false;
    evaluations.forEach((evaluation) => {
      currentEvaluationTeam[evaluation].forEach((member) => {
        const memberId = Object.keys(member)[0];
        if (isWzhzMemeber(memberId)) {
          isContains = true;
        }
      });
    });

    return isContains;
  }

  function isWzhzMemeber(userId) {
    return wzhzList.some((member) => member.id === Number(userId));
  }

  useEffect(() => {
    getWzhzList();
    getOutsideList();

    if (virtualUsers.length === 0) {
      if (data.evaluation_team) {
        const evaluationsETResponsibleFor = data.evaluatee.evaluations.map(
          (e) => e.id
        );

        setEvaluations(evaluationsETResponsibleFor);

        const currentEvaluationTeamApiFormat = {};
        // let fetchedLeader;
        evaluationsETResponsibleFor.forEach((evaluation) => {
          const evaluationTeams = [];
          const uniqueMemberIds = [];
          const uniqueMembersPerAllEvaluations = data.evaluation_team.filter(
            (member) => {
              const isDuplicate = uniqueMemberIds.includes(
                member.member_user_id
              );

              if (!isDuplicate) {
                uniqueMemberIds.push(member.member_user_id);

                return true;
              }

              return false;
            }
          );
          uniqueMembersPerAllEvaluations.forEach((member) => {
            const newMemberObjectApiFormat = {};
            newMemberObjectApiFormat[member.member_user_id] =
              member.is_head_of_team;
            if (member.is_head_of_team) {
              setTeamLeader(member.member_user_id.toString());
            }
            evaluationTeams.push(newMemberObjectApiFormat);
          });

          currentEvaluationTeamApiFormat[evaluation] = evaluationTeams;
        });

        setCurrentEvaluationTeam(currentEvaluationTeamApiFormat);
      }
    }
  }, [isOpen, virtualUsers]);

  const setLeader = (id) => {
    const updatedEvalTeam = currentEvaluationTeam;
    updatedEvalTeam[Object.keys(updatedEvalTeam)[0]].forEach((member) => {
      const memberId = Object.keys(member)[0];
      if (memberId === id) {
        member[memberId] = true;
      } else {
        member[memberId] = false;
      }
    });
    setCurrentEvaluationTeam(updatedEvalTeam);
    setChangesMade(true);
    setTeamLeader(id);
  };

  return (
    <Dialog
      fullScreen
      open={isOpen}
      onClose={onClose}
      TransitionComponent={Transition}
    >
      <AppBar sx={{ position: 'relative' }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleCloseDialog}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            {t('team_of_evaluation')}
          </Typography>
          <Box x={{ m: 1, width: '40rem', border: 'solid 1px #000000' }}>
            <Button
              autoFocus
              variant="contained"
              sx={{ boxShadow: 0 }}
              disabled={isSaveLoading}
              startIcon={<SaveIcon />}
              color="secondary"
              onClick={() => saveEvaluationTeam()}
            >
              {t('save')}
            </Button>
            {isSaveLoading && (
              <CircularProgress
                size={24}
                sx={{
                  color: '#FFFFFF',
                  position: 'absolute',
                  top: '1.3rem',
                  right: '3.5rem',
                }}
              />
            )}
          </Box>
        </Toolbar>
      </AppBar>
      <Box
        sx={{
          m: 0,
          p: 0,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={4} sx={{ ml: 1 }}>
            <Item>
              <Typography variant="h6">{t('evaluatee')}</Typography>
              <Box sx={{ borderRadius: 1, backgroundColor: '#f4f5f7', p: 1 }}>
                <Typography>
                  {`${data.academic_title} ${data.first_name} ${data.last_name}`}
                </Typography>
              </Box>
              <Typography sx={{ mt: 2 }} variant="h6">
                {t('courses')}
              </Typography>
              <Box
                sx={{
                  borderRadius: 1,
                  backgroundColor: '#f4f5f7',
                  p: 1,
                  height: '55vh',
                  overflowY: 'scroll',
                }}
              >
                {data.evaluatee &&
                  data.evaluatee.evaluations.map((evaluation) => (
                    <Card sx={{ mb: 1, boxShadow: 0 }}>
                      <CardContent>
                        <Typography
                          sx={{ fontSize: 14 }}
                          color="text.secondary"
                          gutterBottom
                        >
                          {evaluation.course.course_code}
                        </Typography>
                        <Typography variant="h5" component="div">
                          {evaluation.course.course_name}
                        </Typography>
                        <Typography sx={{ mb: 1.5 }} color="text.secondary">
                          {evaluation.enrolled_students}
                        </Typography>
                        <Typography variant="body2">
                          {evaluation.details}
                        </Typography>
                      </CardContent>
                    </Card>
                  ))}
              </Box>
            </Item>
          </Grid>
          <Grid item xs sx={{ mr: 1 }}>
            <Item>
              <Typography variant="h6">
                {t('assign_evaluation_team')}
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  width: '100%',
                  alignContent: 'center',
                  gap: 3,
                  mt: 4,
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: 1,
                    width: '50%',
                  }}
                >
                  <Autocomplete
                    disablePortal
                    id="wzhz"
                    sx={{ flex: 1 }}
                    size="small"
                    options={wzhzList}
                    onChange={(event, value) => setSelectedWzhzMember(value.id)}
                    getOptionLabel={(option) =>
                      `${option.academic_title} ${option.first_name} ${option.last_name} `
                    }
                    renderInput={(params) => (
                      <TextField {...params} label="WZHZ List" />
                    )}
                  />
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => addMember(selectedWzhzMember)}
                  >
                    {t('add')}
                  </Button>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: 1,
                    width: '50%',
                  }}
                >
                  <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    sx={{ flex: 1 }}
                    size="small"
                    options={outsideList}
                    onChange={(event, value) =>
                      setSelectedOutsideUser(value.id)
                    }
                    getOptionLabel={(option) =>
                      `${option.academic_title} ${option.first_name} ${option.last_name} `
                    }
                    renderInput={(params) => (
                      <TextField {...params} label="User" />
                    )}
                  />
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => addMember(selectedOutsideUser)}
                  >
                    {t('add')}
                  </Button>
                </Box>
              </Box>
              <Typography variant="h6" sx={{ mt: 4 }} align="left">
                {t('team_of_evaluation')}
              </Typography>
              <Box sx={{ height: '55vh', width: '100%' }}>
                <TableContainer
                  component={Paper}
                  sx={{
                    mt: 1,
                    boxShadow: 0,
                    border: 'solid 1px rgba(235, 235, 235)',
                    maxHeight: '100%',
                  }}
                >
                  <Table
                    sx={{ minWidth: 650 }}
                    size="small"
                    aria-label="a dense table"
                  >
                    <TableHead>
                      <TableRow sx={{ backgroundColor: '#f4f5f7' }}>
                        <TableCell>{t('user_id')}</TableCell>
                        <TableCell>{t('label_academic_title')}</TableCell>
                        <TableCell align="left">
                          {t('label_first_name')}
                        </TableCell>
                        <TableCell align="left">
                          {t('label_last_name')}
                        </TableCell>
                        <TableCell align="left">{t('label_email')}</TableCell>
                        <TableCell align="left">{t('group')}</TableCell>
                        <TableCell align="left">{t('label_actions')}</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {currentEvaluationTeam &&
                        outsideList &&
                        Object.values(currentEvaluationTeam)[0].map(
                          (member) => (
                            <TableRow
                              sx={{
                                '&:last-child td, &:last-child th': {
                                  border: 0,
                                },
                                backgroundColor:
                                  teamLeader === Object.keys(member)[0]
                                    ? '#D9372A'
                                    : 'white',
                              }}
                            >
                              <TableCell
                                component="th"
                                scope="row "
                                sx={{
                                  color:
                                    teamLeader === Object.keys(member)[0]
                                      ? 'white'
                                      : 'whblackite',
                                }}
                              >
                                {Object.keys(member)[0]}
                              </TableCell>
                              <TableCell
                                align="left"
                                component="th"
                                scope="row"
                                sx={{
                                  color:
                                    teamLeader === Object.keys(member)[0]
                                      ? 'white'
                                      : 'whblackite',
                                }}
                              >
                                {outsideList &&
                                  outsideList.find(
                                    (user) =>
                                      user.id === Number(Object.keys(member)[0])
                                  ).academic_title}
                              </TableCell>
                              <TableCell
                                align="left"
                                component="th"
                                scope="row"
                                sx={{
                                  color:
                                    teamLeader === Object.keys(member)[0]
                                      ? 'white'
                                      : 'whblackite',
                                }}
                              >
                                {outsideList &&
                                  outsideList.find(
                                    (user) =>
                                      user.id === Number(Object.keys(member)[0])
                                  ).first_name}
                              </TableCell>
                              <TableCell
                                align="left"
                                component="th"
                                scope="row"
                                sx={{
                                  color:
                                    teamLeader === Object.keys(member)[0]
                                      ? 'white'
                                      : 'whblackite',
                                }}
                              >
                                {outsideList &&
                                  outsideList.find(
                                    (user) =>
                                      user.id === Number(Object.keys(member)[0])
                                  ).last_name}
                              </TableCell>
                              <TableCell
                                align="left"
                                component="th"
                                scope="row"
                                sx={{
                                  color:
                                    teamLeader === Object.keys(member)[0]
                                      ? 'white'
                                      : 'whblackite',
                                }}
                              >
                                {outsideList &&
                                  outsideList.find(
                                    (user) =>
                                      user.id === Number(Object.keys(member)[0])
                                  ).email}
                              </TableCell>
                              <TableCell
                                align="left"
                                component="th"
                                scope="row"
                                sx={{
                                  color:
                                    teamLeader === Object.keys(member)[0]
                                      ? 'white'
                                      : 'whblackite',
                                }}
                              >
                                {isWzhzMemeber(Object.keys(member)[0])
                                  ? 'WZHZ'
                                  : t('other')}
                              </TableCell>
                              <TableCell component="th" scope="row">
                                <Box sx={{ m: 1, position: 'relative' }}>
                                  <Tooltip title="Remove" placement="top">
                                    <Fab
                                      aria-label="save"
                                      onClick={() =>
                                        handleRemoveMember(
                                          Object.keys(member)[0]
                                        )
                                      }
                                      sx={{
                                        backgroundColor: '#ffffff',
                                        color: '#D9372A',
                                        boxShadow: 1,
                                        border: 'solid 0.5px #f4f5f7',
                                        mr: 2,
                                      }}
                                      size="small"
                                    >
                                      <PersonRemoveIcon />
                                    </Fab>
                                  </Tooltip>
                                  {isDeleteLoading &&
                                    memberForDeletion ===
                                      Object.keys(member)[0] && (
                                      <CircularProgress
                                        size={44}
                                        sx={{
                                          position: 'absolute',
                                          top: -2,
                                          left: -1,
                                          zIndex: 1,
                                        }}
                                      />
                                    )}
                                  <Tooltip title="Make leader" placement="top">
                                    <Fab
                                      aria-label="save"
                                      onClick={() =>
                                        setLeader(Object.keys(member)[0])
                                      }
                                      sx={{
                                        backgroundColor: '#ffffff',
                                        color: '#D9372A',
                                        boxShadow: 1,
                                        border: 'solid 0.5px #f4f5f7',
                                      }}
                                      size="small"
                                    >
                                      <AssignmentIndIcon />
                                    </Fab>
                                  </Tooltip>
                                </Box>
                              </TableCell>
                            </TableRow>
                          )
                        )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </Item>
          </Grid>
        </Grid>
      </Box>
      <ChangesMightBeLostDialog
        isChangesDialogOpen={isChangesMightBeLostDialogOpen}
        onClose={() => setChangesMightBeLostDialogOpen(false)}
        onCloseParent={onClose}
        onChangesDicard={() => setChangesMade(false)}
      />
      <Dialog
        open={isDeleteDialogOpen}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleDeleteDialogOptionNo}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{t('remove_team_member')}?</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            {t('are_you_sure_you_want_to_remove_this_member')}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogOptionYes}>
            {t('button_yes')}
          </Button>
          <Button onClick={handleDeleteDialogOptionNo}>{t('button_no')}</Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={isDeleteWZHZMemberDialogOpen}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleDeleteWZHZMemberDialogOptionNo}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{t('remove_team_member')}?</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            {t('are_you_sure_you_want_to_remove_this_member')}?
          </DialogContentText>
          <Alert severity="warning" sx={{ mt: 1 }}>
            {t('member_you_are_trying_to_delete_is_a_member_of_WZHZ_group')}
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteWZHZMemberDialogOptionYes}>
            {t('button_yes')}
          </Button>
          <Button onClick={handleDeleteWZHZMemberDialogOptionNo}>
            {t('button_no')}
          </Button>
        </DialogActions>
      </Dialog>
    </Dialog>
  );
}
