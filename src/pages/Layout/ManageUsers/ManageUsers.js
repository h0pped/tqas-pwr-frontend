import { Tooltip, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import LinearProgress from '@mui/material/LinearProgress';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import { DataGrid, GridToolbarContainer, GridToolbarExport, GridToolbarColumnsButton, GridToolbarDensitySelector, GridToolbarQuickFilter, GridToolbarFilterButton } from '@mui/x-data-grid';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { ToastContainer, toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

import 'react-toastify/dist/ReactToastify.css';

import validate from './ManageUsersValidationRules.js';
import useForm from './useForm.js';

import UsersActions from './UsersActions.js';

function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <Box sx={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
        <Box>
          <GridToolbarQuickFilter />
        </Box>
        <Box>
          <GridToolbarExport />
          <GridToolbarColumnsButton />
          <GridToolbarDensitySelector />
          <GridToolbarFilterButton />
        </Box>
      </Box>
    </GridToolbarContainer>
  );
}

export default function ManageUsers({ setDrawerSelectedItem, link }) {
  const { t } = useTranslation();

  // const [users, setUsers] = React.useState([]);

  useEffect(() => {
    setDrawerSelectedItem(link);
    // axios.get('http://192.168.0.141:8080/get_users/all_users').then((response) => { setUsers(response.data); console.log(response.data); });
  }, []);

  const academicTitles = [
    'lic',
    'inz',
    'mgr',
    'mgr inz',
    'dr',
    'dr inz',
    'dr hab',
    'dr hab inz',
    'prof dr hab',
    'prof dr hab inz',
  ];

  const [pageSize, setPageSize] = React.useState(5);

  const columns = [
    { field: 'email', headerName: 'Email address', minWidth: 200, flex: 2 },
    { field: 'academic_title', headerName: 'Academic title', minWidth: 140, type: 'singleSelect', valueOptions: academicTitles, editable: true },
    { field: 'first_name', headerName: 'First name', minWidth: 120, flex: 0.8 },
    { field: 'last_name', headerName: 'Last name', minWidth: 120, flex: 0.8 },
    { field: 'user_type', headerName: 'User role', minWidth: 100, flex: 0.8, type: 'singleSelect', valueOptions: ['admin', 'evaluatee', 'HD', 'ET'], editable: true },
    { field: 'account_status', headerName: 'Account status', minWidth: 120 },
    { field: 'status_date', headerName: 'Date of activation', minWidth: 150 },
    {
      field: 'actions',
      headerName: 'Actions',
      type: 'actions',
      flex: 1,
      renderCell: (params) => (
        <Box>
          <Tooltip title="Save changes" placement="top">
            <IconButton aria-label="save">
              <SaveIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete user" placement="top">
            <IconButton aria-label="delete">
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  const rows = [
    { email: 'Myron.Oliver@pwr.edu.pl', academic_title: 'prof dr hab', first_name: 'Thomas', last_name: 'Darvin', user_type: 'evaluatee', account_status: 'Active', status_date: '10-10-2022', id: '1' },
    { email: 'Sandra.Ortiz@pwr.edu.pl', academic_title: 'dr', first_name: 'Sandra', last_name: 'Ortiz', user_type: 'HD', account_status: 'Inactive', status_date: '09-10-2022', id: '2' },
    { email: 'Donnie.Estrada@pwr.edu.pl', academic_title: 'prof dr hab', first_name: 'Donnie', last_name: 'Estrada', user_type: 'HD', account_status: 'Inactive', status_date: '09-10-2022', id: '3' },
    { email: 'Keith.Keith@pwr.edu.pl', academic_title: 'dr', first_name: 'Keith', last_name: 'Keith', user_type: 'HD', account_status: 'Inactive', status_date: '09-10-2022', id: '4' },
    { email: 'Lorenzo.Mathis@pwr.edu.pl', academic_title: 'dr', first_name: 'Lorenzo', last_name: 'Mathis', user_type: 'HD', account_status: 'Inactive', status_date: '09-10-2022', id: '17' },
    { email: 'Toby.Ortiz@pwr.edu.pl', academic_title: 'dr', first_name: 'Harvey', last_name: 'Harvey', user_type: 'HD', account_status: 'Inactive', status_date: '09-10-2022', id: '5' },
    { email: 'Becky.Sullivan@pwr.edu.pl', academic_title: 'dr', first_name: 'Becky', last_name: 'Sullivan', user_type: 'HD', account_status: 'Inactive', status_date: '09-10-2022', id: '6' },
    { email: 'Kenny.Becker@pwr.edu.pl', academic_title: 'inz', first_name: 'Kenny', last_name: 'Becker', user_type: 'HD', account_status: 'Inactive', status_date: '09-10-2022', id: '7' },
    { email: 'Jeremiah.Mcdonald@pwr.edu.pl', academic_title: 'prof dr hab', first_name: 'Jeremiah', last_name: 'Mcdonald', user_type: 'HD', account_status: 'Inactive', status_date: '09-10-2022', id: '8' },
    { email: 'Nicolas.Snyder@pwr.edu.pl', academic_title: 'prof dr hab', first_name: 'Nicolas', last_name: 'Snyder', user_type: 'HD', account_status: 'Inactive', status_date: '09-10-2022', id: '9' },
    { email: 'Charles.Dean@pwr.edu.pl', academic_title: 'prof dr hab', first_name: 'Charles', last_name: 'Dean', user_type: 'HD', account_status: 'Inactive', status_date: '09-10-2022', id: '10' },
    { email: 'Marcus.Alvarado@pwr.edu.pl', academic_title: 'prof dr hab', first_name: 'Marcus', last_name: 'Alvarado', user_type: 'HD', account_status: 'Inactive', status_date: '09-10-2022', id: '11' },
    { email: 'Clyde.Ortiz@pwr.edu.pl', academic_title: 'prof', first_name: 'Clyde', last_name: 'Boone', user_type: 'HD', account_status: 'Inactive', status_date: '09-10-2022', id: '12' },
    { email: 'Bryant.Fleming@pwr.edu.pl', academic_title: 'dr', first_name: 'Monique', last_name: 'Fleming', user_type: 'HD', account_status: 'Inactive', status_date: '09-10-2022', id: '13' },
    { email: 'Monique.Hale@pwr.edu.pl', academic_title: 'dr', first_name: 'Sandra', last_name: 'Hale', user_type: 'HD', account_status: 'Inactive', status_date: '09-10-2022', id: '14' },
    { email: 'Robin.Rowe@pwr.edu.pl', academic_title: 'dr', first_name: 'Robin', last_name: 'Rowe', user_type: 'HD', account_status: 'Inactive', status_date: '09-10-2022', id: '15' },
    { email: 'Gene.Arnold@pwr.edu.pl', academic_title: 'dr', first_name: 'Gene', last_name: 'Arnold', user_type: 'HD', account_status: 'Inactive', status_date: '09-10-2022', id: '16' },
  ];

  const [selectedFile, setSelectedFile] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const notifySuccess = (msg) => toast.success(`Success! ${msg}`, {
    position: 'top-center',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: 'light',
  });

  const notifyError = (msg) => toast.error(`Error! ${msg}`, {
    position: 'top-center',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: 'light',
  });

  const handleSubmit = async () => {
    if (selectedFile.type !== 'text/csv' && selectedFile.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      notifyError('File must be .csv or .xlsx!');
    } else {
      setIsLoading(true);
      const formData = new FormData();
      formData.append('files', selectedFile);

      try {
        await fetch(
          'http://192.168.0.141:8080/upload_users/append_users/',
          {
            method: 'POST',
            body: formData,
          },
        ).then((response) => {
          console.log(response);
          console.log(response.message);
          console.log(response.data);
          notifySuccess('File was successfully imported.');
          setIsLoading(false);
        });
      } catch (error) {
        notifyError('There was an error.');
        setIsLoading(false);
      }
    }
  };

  const handleFileSelect = (event) => {
    console.log(event.target.files[0]);
    setSelectedFile(event.target.files[0]);
  };

  const [role, setRole] = React.useState('evaluatee');

  const handleRoleChange = (event) => {
    setRole(event.target.value);
    console.log(users);
  };

  const [academic_title, setacademic_title] = React.useState('dr');

  const handleacademic_titleChange = (event) => {
    setacademic_title(event.target.value);
  };

  const { values, handleChange, errors, handleSubmitNewUser } = useForm(
    addUser,
    validate,
  );

  function addUser() {
    // api call post user
    notifySuccess('New user created.');
  }

  const [dateValue, setDateValue] = React.useState(dayjs('2014-08-18T21:11:54'));

  const handleDateChange = (newValue) => {
    setDateValue(newValue);
  };

  return (
    <Box sx={{ m: 0, p: 0, height: 400 }}>
      <ToastContainer />
      <Box sx={{ pt: 1, pb: 1, display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
        <Typography variant="h5">Manage users</Typography>
      </Box>
      <Box sx={{ mb: 2, display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignContent: 'center', gap: 1 }}>
        <TextField
          id="text-field-email"
          error={errors.email}
          helperText={t(errors.email)}
          name="email"
          size="small"
          label="Email address"
          variant="outlined"
          value={values.email || ''}
          onChange={handleChange}
          sx={{ minWidth: 200, flex: 1 }}
        />
        <TextField
          id="text-field-acad-title"
          select
          label="Academic title"
          value={academic_title}
          size="small"
          onChange={handleacademic_titleChange}
          sx={{ minWidth: 100, flex: 1 }}
        >
          { academicTitles.map((title) => (
            <MenuItem key={title} value={title}>{title}</MenuItem>
          ))}
        </TextField>
        <TextField
          id="text-field-fn"
          error={errors.fn}
          helperText={t(errors.fn)}
          name="fn"
          size="small"
          label="First name"
          variant="outlined"
          value={values.fn || ''}
          onChange={handleChange}
          sx={{ minWidth: 100, flex: 1 }}
        />
        <TextField
          id="text-field-ln"
          error={errors.ln}
          helperText={t(errors.ln)}
          name="ln"
          size="small"
          label="Last name"
          variant="outlined"
          value={values.ln || ''}
          onChange={handleChange}
          sx={{ minWidth: 100, flex: 1 }}
        />
        <TextField
          id="text-field-role"
          select
          label="User role"
          value={role}
          size="small"
          onChange={handleRoleChange}
          sx={{ minWidth: 100, flex: 1 }}
        >
          <MenuItem key="admin" value="admin">admin</MenuItem>
          <MenuItem key="dean" value="dean">dean</MenuItem>
          <MenuItem key="head" value="head">head of the department</MenuItem>
          <MenuItem key="head" value="head">evaluation team member</MenuItem>
          <MenuItem key="evaluatee" value="evaluatee">evaluatee</MenuItem>
        </TextField>
        <LocalizationProvider size="small" dateAdapter={AdapterDayjs}>
          <DesktopDatePicker
            label="Last date of evaluation"
            inputFormat="DD/MM/YYYY"
            value={dateValue}
            onChange={handleDateChange}
            renderInput={(params) => <TextField size="small" {...params} />}
          />
        </LocalizationProvider>
        <Button
          size="small"
          variant="contained"
          onClick={handleSubmitNewUser}
          sx={{ width: 100 }}
        >
          Add
        </Button>
      </Box>
      <DataGrid
        columns={columns}
        rows={rows}
        rowsPerPageOptions={[5, 25, 50]}
        pageSize={pageSize}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        components={{ Toolbar: CustomToolbar, LoadingOverlay: LinearProgress }}
      />
      <Box sx={{ pt: 1, pb: 1, display: 'flex', flexDirection: 'row' }}>
        <Box sx={{ p: 0.5, border: 'solid 1px #e0e0e0', borderRadius: '5px' }}>
          <input multiple name="files" type="file" onChange={handleFileSelect} />
          <Button size="small" onClick={handleSubmit}>Import</Button>
          {isLoading && <LinearProgress />}
        </Box>
      </Box>
    </Box>
  );
}
