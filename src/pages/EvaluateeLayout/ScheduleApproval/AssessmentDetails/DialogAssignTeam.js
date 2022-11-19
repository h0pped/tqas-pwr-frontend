import { useEffect, useState, forwardRef, useContext, useReducer } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { useTranslation } from 'react-i18next';
import { TextField } from '@mui/material';
import { toast } from 'react-toastify';
import Autocomplete from '@mui/material/Autocomplete';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import SaveIcon from '@mui/icons-material/Save';
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
    toast.info(`${t('info')} ${msg}`, {
      position: 'top-center',
      autoClose: 8000,
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

  function getWzhzList() {
    try {
      fetch(`${config.server.url}/wzhzData/getMembers`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((d) => {
          console.log(d);
          console.log(data);
          //setWzhzList(d.filter((user) => user.id !== data.id));
          setWzhzList(d);
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
        .then((d) => {
          //setOutsideList(d.filter((user) => user.id !== data.id));
          setOutsideList(d);
        });
    } catch (error) {
      notifyError(t('error_server'));
    }
  }

  function addMember(user) {
    console.log(currentEvaluationTeam);

    if (
      Object.values(currentEvaluationTeam)[0].some(
        (member) => Number(Object.keys(member)[0]) === Number(user)
      )
    ) {
      notifyError('Selected user is already a member of this evaluation team.');
    } else {
      setChangesMade(true);
      const updatedEvalTeam = currentEvaluationTeam;
      evaluations.forEach((evaluation) => {
        const newUser = {};
        newUser[user] = false;
        updatedEvalTeam[evaluation].push(newUser);
        setCurrentEvaluationTeam(updatedEvalTeam);
        forceUpdate();
      });
    }
    console.log(currentEvaluationTeam);
  }

  function saveEvaluationTeam() {
    if (isChangesMade) {
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
            notifySuccess('Evaluation team was successfully saved.');
            setChangesMade(false);
            setSaveLoading(false);
            onClose();
          } else {
            notifyError('There was a problem while assigning a team.');
            setChangesMade(false);
            setSaveLoading(false);
            onClose();
          }
        });
      } catch (error) {
        notifyError(t('server_error'));
      }
    } else {
      notifyInfo('No changes to be saved.');
    }
  }

  function isWzhzMemeber(userId) {
    return wzhzList.some((member) => member.id === Number(userId));
  }

  useEffect(() => {
    getWzhzList();
    getOutsideList();

    console.log(data.evaluation_team);

    if (data.evaluation_team) {
      const evaluationsETResponsibleFor = data.evaluatee.evaluations.map(
        (e) => e.id
      );

      setEvaluations(evaluationsETResponsibleFor);

      const newEvalObj = {};

      evaluationsETResponsibleFor.forEach((ev) => {
        const evalTeam = [];
        data.evaluation_team.forEach((member) => {
          const memberObj = {};
          memberObj[member.member_user_id] = false;
          evalTeam.push(memberObj);
        });

        newEvalObj[ev] = evalTeam;
      });

      console.log(`OBJ: ${JSON.stringify(newEvalObj)}`);
      setCurrentEvaluationTeam(newEvalObj);

      console.log(currentEvaluationTeam);
      console.log(console.log(evaluationsETResponsibleFor));

      console.log(wzhzList);
    }
  }, [isOpen]);

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
          <Box x={{ m: 1, position: 'relative' }}>
            <Button
              autoFocus
              variant="contained"
              sx={{ boxShadow: 0 }}
              disabled={isSaveLoading}
              startIcon={<SaveIcon />}
              style={{ backgroundColor: '#fdf0ef', color: '#D9372A' }}
              onClick={saveEvaluationTeam}
            >
              Save
            </Button>
            {isSaveLoading && (
              <CircularProgress
                size={24}
                sx={{
                  color: '#D9372A',
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  marginTop: '-12px',
                  marginLeft: '-12px',
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
              <Typography variant="h6">
                {console.log(data)}
                Evaluatee
              </Typography>
              <Box sx={{ borderRadius: 1, backgroundColor: '#f4f5f7', p: 1 }}>
                <Typography>
                  {`${data.academic_title} ${data.first_name} ${data.last_name}`}
                </Typography>
              </Box>
              <Typography sx={{ mt: 2 }} variant="h6">
                {t('course_details')}
              </Typography>
              <Box sx={{ borderRadius: 1, backgroundColor: '#f4f5f7', p: 1 }}>
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
                    {t('button_add')}
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
                    {t('button_add')}
                  </Button>
                </Box>
              </Box>
              <Typography variant="h6" sx={{ mt: 4 }} align="left">
                {t('team_of_evaluation')}
              </Typography>
              <Box sx={{ height: 400, width: '100%' }}>
                <TableContainer
                  component={Paper}
                  sx={{
                    mt: 1,
                    boxShadow: 0,
                    border: 'solid 1px rgba(235, 235, 235)',
                  }}
                >
                  <Table
                    sx={{ minWidth: 650 }}
                    size="small"
                    aria-label="a dense table"
                  >
                    <TableHead>
                      <TableRow sx={{ backgroundColor: '#f4f5f7' }}>
                        <TableCell>User ID</TableCell>
                        <TableCell>Academic Title</TableCell>
                        <TableCell align="left">First name</TableCell>
                        <TableCell align="left">Last name</TableCell>
                        <TableCell align="left">Email</TableCell>
                        <TableCell align="left">Group</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {currentEvaluationTeam &&
                        Object.values(currentEvaluationTeam)[0].map(
                          (member) => (
                            <TableRow
                              key={Object.keys(member)[0]}
                              sx={{
                                '&:last-child td, &:last-child th': {
                                  border: 0,
                                },
                              }}
                            >
                              <TableCell
                                key={Object.keys(member)[0]}
                                component="th"
                                scope="row"
                              >
                                {Object.keys(member)[0]}
                              </TableCell>
                              <TableCell
                                key={Object.keys(member)[0]}
                                align="left"
                                component="th"
                                scope="row"
                              >
                                {
                                  outsideList.find(
                                    (user) =>
                                      user.id === Number(Object.keys(member)[0])
                                  ).academic_title
                                }
                              </TableCell>
                              <TableCell
                                key={Object.keys(member)[0]}
                                align="left"
                                component="th"
                                scope="row"
                              >
                                {
                                  outsideList.find(
                                    (user) =>
                                      user.id === Number(Object.keys(member)[0])
                                  ).first_name
                                }
                              </TableCell>
                              <TableCell
                                key={Object.keys(member)[0]}
                                align="left"
                                component="th"
                                scope="row"
                              >
                                {
                                  outsideList.find(
                                    (user) =>
                                      user.id === Number(Object.keys(member)[0])
                                  ).last_name
                                }
                              </TableCell>
                              <TableCell
                                key={Object.keys(member)[0]}
                                align="left"
                                component="th"
                                scope="row"
                              >
                                {
                                  outsideList.find(
                                    (user) =>
                                      user.id === Number(Object.keys(member)[0])
                                  ).email
                                }
                              </TableCell>
                              <TableCell
                                key={Object.keys(member)[0]}
                                align="left"
                                component="th"
                                scope="row"
                              >
                                {isWzhzMemeber(Object.keys(member)[0])
                                  ? 'WZHZ'
                                  : 'Other'}
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
    </Dialog>
  );
}
