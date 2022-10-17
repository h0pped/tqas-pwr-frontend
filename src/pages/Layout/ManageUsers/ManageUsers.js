import { Typography } from '@mui/material';
import React, { useEffect } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import LinearProgress from '@mui/material/LinearProgress';
import MenuItem from '@mui/material/MenuItem';
import { DataGrid, GridToolbarContainer, GridToolbarExport, GridToolbarColumnsButton, GridToolbarDensitySelector, GridToolbarQuickFilter, GridToolbarFilterButton } from '@mui/x-data-grid';
import { ToastContainer, toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

import 'react-toastify/dist/ReactToastify.css';

import validate from './ManageUsersValidationRules.js';
import useForm from './useForm.js';

const baseUrl = 'http://192.168.0.141:8080';

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

  useEffect(() => {
    setDrawerSelectedItem(link);
  }, []);

  const [pageSize, setPageSize] = React.useState(5);

  const columns = [
    { field: 'email', headerName: 'Email address', minWidth: 200, flex: 2 },
    { field: 'acadTitle', headerName: 'Academic title', minWidth: 140 },
    { field: 'firstName', headerName: 'First name', minWidth: 120, flex: 0.8 },
    { field: 'lastName', headerName: 'Last name', minWidth: 120, flex: 0.8 },
    { field: 'userRole', headerName: 'User role', minWidth: 100, flex: 0.8, type: 'singleSelect', valueOptions: ['admin', 'evaluatee', 'HD', 'ET'], editable: true },
    { field: 'isActiveAccount', headerName: 'Account status', minWidth: 120 },
    { field: 'activationDate', headerName: 'Date of activation', minWidth: 150 },
  ];

  const rows = [
    { email: 'Myron.Oliver@pwr.edu.pl', acadTitle: 'Prof.', firstName: 'Thomas', lastName: 'Darvin', userRole: 'evaluatee', isActiveAccount: 'Active', activationDate: '10-10-2022', id: '1' },
    { email: 'Sandra.Ortiz@pwr.edu.pl', acadTitle: 'Dr.', firstName: 'Sandra', lastName: 'Ortiz', userRole: 'HD', isActiveAccount: 'Inactive', activationDate: '09-10-2022', id: '2' },
    { email: 'Donnie.Estrada@pwr.edu.pl', acadTitle: 'Dr.', firstName: 'Donnie', lastName: 'Estrada', userRole: 'HD', isActiveAccount: 'Inactive', activationDate: '09-10-2022', id: '3' },
    { email: 'Keith.Keith@pwr.edu.pl', acadTitle: 'Dr.', firstName: 'Keith', lastName: 'Keith', userRole: 'HD', isActiveAccount: 'Inactive', activationDate: '09-10-2022', id: '4' },
    { email: 'Lorenzo.Mathis@pwr.edu.pl', acadTitle: 'Dr.', firstName: 'Lorenzo', lastName: 'Mathis', userRole: 'HD', isActiveAccount: 'Inactive', activationDate: '09-10-2022', id: '17' },
    { email: 'Toby.Ortiz@pwr.edu.pl', acadTitle: 'Dr.', firstName: 'Harvey', lastName: 'Harvey', userRole: 'HD', isActiveAccount: 'Inactive', activationDate: '09-10-2022', id: '5' },
    { email: 'Becky.Sullivan@pwr.edu.pl', acadTitle: 'Dr.', firstName: 'Becky', lastName: 'Sullivan', userRole: 'HD', isActiveAccount: 'Inactive', activationDate: '09-10-2022', id: '6' },
    { email: 'Kenny.Becker@pwr.edu.pl', acadTitle: 'Dr.', firstName: 'Kenny', lastName: 'Becker', userRole: 'HD', isActiveAccount: 'Inactive', activationDate: '09-10-2022', id: '7' },
    { email: 'Jeremiah.Mcdonald@pwr.edu.pl', acadTitle: 'Dr.', firstName: 'Jeremiah', lastName: 'Mcdonald', userRole: 'HD', isActiveAccount: 'Inactive', activationDate: '09-10-2022', id: '8' },
    { email: 'Nicolas.Snyder@pwr.edu.pl', acadTitle: 'Dr.', firstName: 'Nicolas', lastName: 'Snyder', userRole: 'HD', isActiveAccount: 'Inactive', activationDate: '09-10-2022', id: '9' },
    { email: 'Charles.Dean@pwr.edu.pl', acadTitle: 'Dr.', firstName: 'Charles', lastName: 'Dean', userRole: 'HD', isActiveAccount: 'Inactive', activationDate: '09-10-2022', id: '10' },
    { email: 'Marcus.Alvarado@pwr.edu.pl', acadTitle: 'Dr.', firstName: 'Marcus', lastName: 'Alvarado', userRole: 'HD', isActiveAccount: 'Inactive', activationDate: '09-10-2022', id: '11' },
    { email: 'Clyde.Ortiz@pwr.edu.pl', acadTitle: 'Dr.', firstName: 'Clyde', lastName: 'Boone', userRole: 'HD', isActiveAccount: 'Inactive', activationDate: '09-10-2022', id: '12' },
    { email: 'Bryant.Fleming@pwr.edu.pl', acadTitle: 'Dr.', firstName: 'Monique', lastName: 'Fleming', userRole: 'HD', isActiveAccount: 'Inactive', activationDate: '09-10-2022', id: '13' },
    { email: 'Monique.Hale@pwr.edu.pl', acadTitle: 'Dr.', firstName: 'Sandra', lastName: 'Hale', userRole: 'HD', isActiveAccount: 'Inactive', activationDate: '09-10-2022', id: '14' },
    { email: 'Robin.Rowe@pwr.edu.pl', acadTitle: 'Dr.', firstName: 'Robin', lastName: 'Rowe', userRole: 'HD', isActiveAccount: 'Inactive', activationDate: '09-10-2022', id: '15' },
    { email: 'Gene.Arnold@pwr.edu.pl', acadTitle: 'Dr.', firstName: 'Gene', lastName: 'Arnold', userRole: 'HD', isActiveAccount: 'Inactive', activationDate: '09-10-2022', id: '16' },
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
        await axios({
          method: 'post',
          url: `${baseUrl}/upload_users/append_users/`,
          data: formData,
        }).then(() => {
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
    setSelectedFile(event.target.files[0]);
  };

  const [role, setAcademicTitle] = React.useState('evaluatee');

  const handleRoleChange = (event) => {
    setAcademicTitle(event.target.value);
  };

  const { values, handleChange, errors, handleSubmitNewUser } = useForm(
    addUser,
    validate,
  );

  function addUser() {
    // api call post user
    notifySuccess('New user created.');
  }

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
          <MenuItem key="head" value="head">head</MenuItem>
          <MenuItem key="evaluatee" value="evaluatee">evaluatee</MenuItem>
        </TextField>
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
          <input accept=".csv,.xslx" multiple type="file" onChange={handleFileSelect} />
          <Button size="small" onClick={handleSubmit}>Import</Button>
          {isLoading && <LinearProgress />}
        </Box>
      </Box>
    </Box>
  );
}
