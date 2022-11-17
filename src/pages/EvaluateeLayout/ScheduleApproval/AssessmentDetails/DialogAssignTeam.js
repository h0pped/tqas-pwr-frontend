import { useEffect, useState, forwardRef, useContext } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { useTranslation } from 'react-i18next';
import { TextField } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import Autocomplete from '@mui/material/Autocomplete';
import { DataGrid } from '@mui/x-data-grid';
import config from '../../../../config/index.config.js';
import UserContext from '../../../../context/UserContext/UserContext.js';
import customDataGridToolbar from '../../../../components/CustomGridToolbar/CustomDataGridToolBar.js';
import DeleteAction from '../../../AdminLayout/ManageWZHZGroup/DeleteActions.js';
import { json } from 'react-router-dom';

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
  const [wzhzList, setWzhzList] = useState({ wzhzList: [] });
  const [outsideList, setOutsideList] = useState({ outsideList: [] });
  const { token } = useContext(UserContext);
  const { t } = useTranslation();
  const [selectedWzhzMember, setSelectedWzhzMember] = useState(null);
  const [selectedOutsideUser, setSelectedOutsideUser] = useState(null);

  const evaluationTeam = data.evaluation_team;

  const [currentEvaluationTeam, setCurrentEvaluationTeam] = useState(null);

  function getFullName(params) {
    return ` ${params.row.academic_title || ''} ${params.row.first_name || ''
      } ${params.row.last_name || ''}`;
  }

  const columns = [
    {
      field: 'member_user_id',
      headerName: 'Id',
      minWidth: 20,
      flex: 0.2,
    },
    {
      field: 'full_name',
      headerName: 'Full Name',
      minWidth: 180,
      flex: 0.8,
      valueGetter: getFullName,
    },
    {
      field: 'member_email',
      headerName: 'Email address',
      minWidth: 300,
      flex: 0.8,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      type: 'actions',
      flex: 0.5,
      renderCell: (params) => <DeleteAction {...{ params }} />,
    },
  ];

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

  function getWzhzList() {
    try {
      fetch(`${config.server.url}/wzhzData/getMembers`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setWzhzList(data);
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
        .then((data) => {
          setOutsideList(data);
        });
    } catch (error) {
      notifyError(t('error_server'));
    }
  }

  function addMember(user) {
    console.log(user);
    console.log(evaluationTeam);
  }

  useEffect(() => {
    getWzhzList();
    getOutsideList();

    console.log(data.evaluation_team);

    if (data.evaluation_team) {
      const evaluationsETResponsibleFor = data.evaluatee.evaluations.map(
        (e) => e.id
      );

      let newEvalObj = {};

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
    }
  }, [isOpen, setCurrentEvaluationTeam]);

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
            onClick={onClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            {t('team_of_evaluation')}
          </Typography>
          <Button autoFocus color="inherit" onClick={onClose}>
            {t('assign')}
          </Button>
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
              <Typography sx={{ mt: 2 }} variant="h6">
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
                    <Card sx={{ minWidth: 275, mb: 1 }}>
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
              <Typography variant="h6" align="center">
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
                    sx={{
                      flex: 1,
                    }}
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
                <DataGrid
                  rows={evaluationTeam}
                  getRowId={(row) => row.member_user_id}
                  columns={columns}
                  components={{
                    Toolbar: customDataGridToolbar,
                    LoadingOverlay: LinearProgress,
                  }}
                  componentsProps={{
                    toolbar: {
                      showQuickFilter: true,
                      quickFilterProps: { debounceMs: 500 },
                    },
                  }}
                />
              </Box>
            </Item>
          </Grid>
        </Grid>
      </Box>
    </Dialog>
  );
}
