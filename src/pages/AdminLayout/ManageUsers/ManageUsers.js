import { Typography } from '@mui/material';
import React, { useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import LinearProgress from '@mui/material/LinearProgress';
import MenuItem from '@mui/material/MenuItem';
import { DataGrid } from '@mui/x-data-grid';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import CircularProgress from '@mui/material/CircularProgress';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';

import { ToastContainer, toast } from 'react-toastify';

import { useTranslation } from 'react-i18next';

import 'react-toastify/dist/ReactToastify.css';
import customDataGridToolbar from './CustomDataGridToolBar.js';
import validate from './ManageUsersValidationRules.js';
import useForm from './useForm.js';
import UsersActions from './UsersActions.js';

const baseUrl = 'http://localhost:8080';

export default function ManageUsers({ setDrawerSelectedItem, link }) {
  const { t } = useTranslation();

  const academicTitlesList = [
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

  const userRolesList = [
    { key: 'admin', title: 'admin' },
    { key: 'dean', title: 'dean' },
    { key: 'head', title: 'head of department' },
    { key: 'et', title: 'evaluation team member' },
    { key: 'evaluatee', title: 'evaluatee' },
  ];

  const [isUpdated, setUpdated] = React.useState(false);

  const [users, setUsers] = React.useState({ users: [] });

  const [isFileUploadLoading, setFileUploadIsLoading] = React.useState(false);
  const [isAddUserBtnLoading, setAddUserBtnLoading] = React.useState(false);
  const [isUsersTableLoading, setUsersTableLoading] = React.useState(false);

  const [tablePageSize, setTablePageSize] = React.useState(5);

  const [selectedFileToImport, setSelectedFileToImport] = React.useState(null);
  const [roleInputValue, setRoleInputValue] = React.useState('evaluatee');
  const [academicTitleInputValue, setAcademicTitleInputValue] = React.useState('dr');
  const [lastDateOfEvalInputValue, setLastDateOfEvalInputValue] = React.useState(null);

  const [activeRowId, setActiveRow] = React.useState(null);

  const handleFileSelect = (event) => {
    setSelectedFileToImport(event.target.files[0]);
  };

  const handleRoleInputValueChange = (event) => {
    setRoleInputValue(event.target.value);
  };

  const handleAcademicTitleInputValueChange = (event) => {
    setAcademicTitleInputValue(event.target.value);
  };

  const handleLastDateOfEvalInputValueChange = (newValue) => {
    setLastDateOfEvalInputValue(newValue);
  };

  const { values, handleChange, errors, handleSubmitNewUser } = useForm(
    addUser,
    validate,
  );

  async function addUser() {
    setAddUserBtnLoading(true);
    try {
      await fetch(
        `${baseUrl}/userData/createUser`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            first_name: values.fn,
            last_name: values.ln,
            academic_title: academicTitleInputValue,
            email: values.email,
            user_type: roleInputValue,
            last_evaluated_date: lastDateOfEvalInputValue,
          }),
        },
      ).then((response) => {
        console.log(response);
        if (response.ok) {
          notifySuccess('User has been added.');
          setUpdated(true);
        } else {
          notifyError('Network error.');
        }

        setAddUserBtnLoading(false);
      });
    } catch (error) {
      setAddUserBtnLoading(false);
      notifyError('There was an error while creating new user.');
    }
  }

  useEffect(() => {
    setDrawerSelectedItem(link);
    getUsers();
    setUpdated(false);
  }, [link, setDrawerSelectedItem, isUpdated]);

  async function getUsers() {
    setUsersTableLoading(true);
    try {
      await fetch(
        `${baseUrl}/userData/getUsers`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        },
      ).then((response) => response.json())
        .then((data) => {
          setUsers(
            data.sort((a, b) => (a.id > b.id) ? 1 : -1)
          );
          setUsersTableLoading(false);
        });
    } catch (error) {
      setUsersTableLoading(false);
    }
  }

  const columns = [
    { field: 'id', headerName: 'Id' },
    { field: 'email', headerName: 'Email address', minWidth: 200, flex: 2 },
    { field: 'academic_title', headerName: 'Academic title', minWidth: 140, type: 'singleSelect', valueOptions: academicTitlesList, editable: true },
    { field: 'first_name', headerName: 'First name', minWidth: 120, flex: 0.8 },
    { field: 'last_name', headerName: 'Last name', minWidth: 120, flex: 0.8 },
    { field: 'user_type', headerName: 'User role', minWidth: 100, flex: 0.8, type: 'singleSelect', valueOptions: userRolesList.map((role) => role.title), editable: true },
    { field: 'account_status', headerName: 'Account status', minWidth: 120 },
    {
      field: 'actions',
      headerName: 'Actions',
      type: 'actions',
      flex: 1,
      renderCell: (params) => (
        <UsersActions {...{ params, activeRowId, setActiveRow }} />
      ),
    },
  ];

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

  const importFile = async () => {
    if (selectedFileToImport.type !== 'text/csv'
      && selectedFileToImport.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      notifyError('File must be .csv or .xlsx!');
    } else {
      setFileUploadIsLoading(true);
      const formData = new FormData();
      formData.append('files', selectedFileToImport);

      try {
        await fetch(
          ' http://192.168.0.141:8080/uploadUsers/appendUsers/',
          {
            method: 'POST',
            body: formData,
          },
        ).then((response) => {
          setFileUploadIsLoading(false);
          if (response.ok) {
            notifySuccess('File was successfully imported.');
            setUpdated(true);
          } else {
            notifyError('Network error.');
          }
        });
      } catch (error) {
        notifyError('There was a problem with uploading your file.');
        setFileUploadIsLoading(false);
      }
    }
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
          value={academicTitleInputValue}
          size="small"
          onChange={handleAcademicTitleInputValueChange}
          sx={{ minWidth: 100, flex: 1 }}
        >
          {academicTitlesList.map((title) => (
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
          value={roleInputValue}
          size="small"
          onChange={handleRoleInputValueChange}
          sx={{ minWidth: 100, flex: 1 }}
        >
          {userRolesList.map((role) => (
            <MenuItem key={role.key} value={role.key}>{role.title}</MenuItem>
          ))}
        </TextField>
        <LocalizationProvider size="small" dateAdapter={AdapterDayjs}>
          <DesktopDatePicker
            label="Last date of evaluation"
            inputFormat="DD/MM/YYYY"
            value={lastDateOfEvalInputValue}
            onChange={handleLastDateOfEvalInputValueChange}
            renderInput={(params) => <TextField type="date" size="small" {...params} />}
          />
        </LocalizationProvider>
        <Box sx={{ position: 'relative' }}>
          <Button
            size="24px"
            variant="contained"
            disabled={isAddUserBtnLoading}
            onClick={handleSubmitNewUser}
            sx={{ width: 100 }}
          >
            Add
          </Button>
          {isAddUserBtnLoading && (
            <CircularProgress
              size="24px"
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                marginTop: '-12px',
                marginLeft: '-12px',
              }}
            />
          )}
        </Box>
      </Box>
      <DataGrid
        columns={columns}
        rows={users}
        getRowId={(row) => row.id}
        rowsPerPageOptions={[5, 25, 50]}
        pageSize={tablePageSize}
        loading={isUsersTableLoading}
        onPageSizeChange={(newPageSize) => setTablePageSize(newPageSize)}
        components={{ Toolbar: customDataGridToolbar, LoadingOverlay: LinearProgress }}
        onCellEditCommit={(params) => setActiveRow(params.id)}
      />
      <Box sx={{ pt: 1, pb: 1, display: 'flex', flexDirection: 'row' }}>
        <Box sx={{ p: 0.5, border: 'solid 1px #e0e0e0', borderRadius: '5px' }}>
          <input multiple name="files" type="file" onChange={handleFileSelect} />
          <Button size="small" onClick={importFile}>Import</Button>
          {isFileUploadLoading && <LinearProgress />}
        </Box>
      </Box>
    </Box>
  );
}
