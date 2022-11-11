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
import { toast } from 'react-toastify';
import Autocomplete from '@mui/material/Autocomplete';
import { DataGrid } from '@mui/x-data-grid';
import config from '../../../config/index.config.js';
import UserContext from '../../../context/UserContext/UserContext.js';
import customDataGridToolbar from '../../../components/CustomGridToolbar/CustomDataGridToolBar.js';
import DeleteAction from '../ManageWZHZGroup/DeleteActions.js';

const Transition = forwardRef((props, ref) => (
  <Slide direction="up" ref={ref} {...props} />
));

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  [theme.breakpoints.up('md')]: {
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  },
  color: theme.palette.text.secondary,
  height: 800,
}));

export default function AssignTeam({ setDrawerSelectedItem, link }) {
  const [open, setOpen] = useState(false);
  const [wzhzList, setWzhzList] = useState({ wzhzList: [] });
  const [outsideList, setOutsideList] = useState({ outsideList: [] });
  const { token } = useContext(UserContext);
  const { t } = useTranslation();
  const [setSelectedUser] = useState(null);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  function getFullName(params) {
    return ` ${params.row.academic_title || ''} ${
      params.row.first_name || ''
    } ${params.row.last_name || ''}`;
  }

  const columns = [
    {
      field: 'id',
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
    { field: 'email', headerName: 'Email address', minWidth: 300, flex: 0.8 },
    {
      field: 'from',
      headerName: 'From',
      minWidth: 80,
      flex: 0.5,
    },
    {
      field: 'actions',
      headerName: '',
      type: 'actions',
      flex: 0.5,
      renderCell: (params) => <DeleteAction {...{ params }} />,
    },
  ];

  const initialsRows = [
    {
      id: 1,
      academic_title: 'Prof dr hab inz',
      first_name: 'Kitkat',
      last_name: 'System',
      email: 'kitkat.system@pwr.edu.pl',
      from: 'WZHZ Group',
    },
    {
      id: 2,
      academic_title: 'dr inz',
      first_name: 'White',
      last_name: 'System',
      email: 'white.system@pwr.edu.pl',
      from: 'WZHZ Group',
    },
    {
      id: 3,
      academic_title: 'dr hab',
      first_name: 'Greg',
      last_name: 'System',
      email: 'greg.system@pwr.edu.pl',
      from: 'Outside Group',
    },
    {
      id: 4,
      academic_title: ' mgt inz',
      first_name: 'Oreo',
      last_name: 'System',
      email: 'oreo.system@pwr.edu.pl',
      from: 'Outside Group',
    },
  ];

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
      notfyError(t('error_server'));
    }
  }

  useEffect(() => {
    setDrawerSelectedItem(link);
    getWzhzList();
    getOutsideList();
  }, []);
  return (
    <Item>
      <Button variant="outlined" onClick={handleClickOpen}>
        Open fullScreen Dialog
      </Button>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Evaluation Team
            </Typography>
            <Button autoFocus color="inherit" onClick={handleClose}>
              Assign
            </Button>
          </Toolbar>
        </AppBar>
        <Box
          sx={{
            m: 0,
            p: 0,
            height: 400,
          }}
        >
          <Grid container spacing={6}>
            <Grid item xs={3.7} sx={{ height: 400 }}>
              <Item>
                <Typography variant="h6" align="center">
                  Course Details
                </Typography>
                <Card sx={{ minWidth: 275 }}>
                  <CardContent>
                    <Typography
                      sx={{ fontSize: 14 }}
                      color="text.secondary"
                      gutterBottom
                    >
                      MA0293029
                    </Typography>
                    <Typography variant="h5" component="div">
                      Math Analysis I
                    </Typography>
                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                      Enrolled: 14/15/15/13
                    </Typography>
                    <Typography variant="body2">
                      pn.9:15-11:00 D-2.s333 <br />
                      pn.9:15-11:00 D-2.s333 <br />
                      pn.9:15-11:00 D-2.s333 <br />
                      pn.9:15-11:00 D-2.s333 <br />
                    </Typography>
                  </CardContent>
                </Card>
                <Card sx={{ mt: 5, minWidth: 275 }}>
                  <CardContent>
                    <Typography
                      sx={{ fontSize: 14 }}
                      color="text.secondary"
                      gutterBottom
                    >
                      OP0293029
                    </Typography>
                    <Typography variant="h5" component="div">
                      Operating System
                    </Typography>
                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                      Enrolled: 14/15/15/13
                    </Typography>
                    <Typography variant="body2">
                      pn.13:15-15:00 D-2.s333 <br />
                      pn.13:15-15:00 D-2.s333 <br />
                      pn.13:15-15:00 D-2.s333 <br />
                      pn.13:15-15:00 D-2.s333 <br />
                    </Typography>
                  </CardContent>
                </Card>
              </Item>
            </Grid>
            <Grid item xs={8.3}>
              <Item>
                <Typography variant="h6" align="center">
                  Assign Evaluation Team
                </Typography>
                <Box
                  sx={{
                    mt: 7,
                    ml: 4,
                    mb: 2,
                    width: {
                      xs: '200px',
                      sm: '300px',
                      md: '500px',
                      lg: '800px',
                      xl: '980px',
                    },
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignContent: 'center',
                    gap: 1,
                  }}
                >
                  <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    size="small"
                    options={wzhzList}
                    onChange={(event, value) => setSelectedUser(value.id)}
                    getOptionLabel={(option) =>
                      `${option.academic_title} ${option.first_name} ${option.last_name} `
                    }
                    sx={{
                      flex: 1,
                    }}
                    renderInput={(params) => (
                      <TextField {...params} label="WZHZ List" />
                    )}
                  />
                  <Button
                    size="24px"
                    variant="contained"
                    sx={{
                      width: {
                        xs: '10px',
                        sm: '20px',
                        md: '30px',
                        lg: '50px',
                        xl: '60px',
                      },
                      mr: 5,
                    }}
                  >
                    ADD
                  </Button>
                  <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    size="small"
                    options={outsideList}
                    onChange={(event, value) => setSelectedUser(value.id)}
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
                    size="24px"
                    variant="contained"
                    sx={{
                      width: {
                        xs: '10px',
                        sm: '20px',
                        md: '30px',
                        lg: '50px',
                        xl: '60px',
                      },
                    }}
                  >
                    ADD
                  </Button>
                </Box>
                <Typography variant="h6" sx={{ mt: 10, ml: 1 }} align="left">
                  Evaluation Team
                </Typography>
                <Box sx={{ height: 400, width: '100%' }}>
                  <DataGrid
                    rows={initialsRows}
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
    </Item>
  );
}
