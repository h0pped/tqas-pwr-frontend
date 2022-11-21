import { Typography } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
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
import customDataGridToolbar from '../../../components/CustomGridToolbar/CustomDataGridToolBar.js';
import validate from './ManageUsersValidationRules.js';
import useForm from './useForm.js';
import UsersActions from './UsersActions.js';

import config from '../../../config/index.config.js';

import { academicTitlesList, userRolesList } from '../../../constants.js';
import UserContext from '../../../context/UserContext/UserContext.js';

export default function ManageUsers({ setDrawerSelectedItem, link }) {
  const { t } = useTranslation();

  const { token } = useContext(UserContext);

  const [isUpdated, setUpdated] = useState(false);

  const [users, setUsers] = useState({ users: [] });

  const [isFileUploadLoading, setFileUploadIsLoading] = useState(false);
  const [isAddUserBtnLoading, setAddUserBtnLoading] = useState(false);
  const [isUsersTableLoading, setUsersTableLoading] = useState(false);

  const [tablePageSize, setTablePageSize] = useState(5);

  const [selectedFileToImport, setSelectedFileToImport] = useState(null);
  const [roleInputValue, setRoleInputValue] = useState('evaluatee');
  const [academicTitleInputValue, setAcademicTitleInputValue] = useState('dr');
  const [lastDateOfEvalInputValue, setLastDateOfEvalInputValue] = useState(
    null
  );

  const [activeRowId, setActiveRow] = useState(null);

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
    validate
  );

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

  const usersTableColumnsDef = [
    {
      field: 'id',
      headerName: 'Id',
    },
    {
      field: 'email',
      headerName: t('label_email'),
      minWidth: 200,
      flex: 2,
    },
    {
      field: 'academic_title',
      headerName: t('label_academic_title'),
      minWidth: 140,
      type: 'singleSelect',
      valueOptions: academicTitlesList,
      editable: true,
    },
    {
      field: 'first_name',
      headerName: t('label_first_name'),
      minWidth: 120,
      flex: 0.8,
    },
    {
      field: 'last_name',
      headerName: t('label_last_name'),
      minWidth: 120,
      flex: 0.8,
    },
    {
      field: 'department',
      headerName: t('department'),
      minWidth: 120,
      flex: 1.5,
    },
    {
      field: 'user_type',
      headerName: t('label_user_role'),
      minWidth: 100,
      flex: 0.8,
      type: 'singleSelect',
      valueOptions: userRolesList.map((role) => role.title),
      editable: true,
    },
    {
      field: 'account_status',
      headerName: t('label_account_status'),
      minWidth: 120,
    },
    {
      field: 'actions',
      headerName: t('label_actions'),
      type: 'actions',
      minWidth: '120',
      renderCell: (params) => (
        <UsersActions {...{ params, activeRowId, setActiveRow, setUpdated }} />
      ),
    },
  ];

  useEffect(() => {
    setDrawerSelectedItem(link);
    getUsers();
    setUpdated(false);
  }, [link, setDrawerSelectedItem, isUpdated]);

  async function addUser() {
    setAddUserBtnLoading(true);
    try {
      await fetch(`${config.server.url}/userData/createUser`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          first_name: values.firstName,
          last_name: values.lastName,
          department: values.department,
          academic_title: academicTitleInputValue,
          email: values.email.toLowerCase(),
          user_type: roleInputValue,
          last_evaluated_date: lastDateOfEvalInputValue,
        }),
      }).then((response) => {
        if (response.ok) {
          notifySuccess(t('success_user_created'));
          setUpdated(true);
        } else {
          notifyError(t('error_user_not_created'));
        }
        setAddUserBtnLoading(false);
      });
    } catch (error) {
      setAddUserBtnLoading(false);
      notifyError(t('error_server'));
    }
  }

  async function getUsers() {
    setUsersTableLoading(true);
    try {
      await fetch(`${config.server.url}/userData/getUsers`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setUsers(data.sort((a, b) => a - b));
          setUsersTableLoading(false);
        });
    } catch (error) {
      setUsersTableLoading(false);
    }
  }

  const importFile = async () => {
    if (
      selectedFileToImport.type !== 'text/csv' &&
      selectedFileToImport.type !==
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ) {
      notifyError(t('error_filetype_csv_or_xlsx'));
    } else {
      setFileUploadIsLoading(true);
      const formData = new FormData();
      formData.append('files', selectedFileToImport);

      try {
        await fetch(`${config.server.url}/uploadUsers/appendUsers/`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }).then((response) => {
          setFileUploadIsLoading(false);
          if (response.ok) {
            notifySuccess(t('success_file_uploaded'));
          } else {
            notifyError(t('error_file_not_uploaded'));
          }
        });
      } catch (error) {
        setFileUploadIsLoading(false);
        notifyError(t('server_error'));
      }
    }
  };

  return (
    <Box sx={{ m: 0, p: 0 }}>
      <ToastContainer />
      <Box
        sx={{
          pb: 3,
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <Typography variant="h5">{t('admin_manage_users_title')}</Typography>
      </Box>
      <Box
        sx={{
          mb: 2,
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignContent: 'center',
          gap: 1,
        }}
      >
        <TextField
          id="text-field-email"
          error={errors.email}
          helperText={t(errors.email)}
          name="email"
          size="small"
          label={t('label_email')}
          variant="outlined"
          value={values.email || ''}
          onChange={handleChange}
          sx={{ minWidth: 200, flex: 1 }}
        />
        <TextField
          id="text-field-acad-title"
          select
          label={t('label_academic_title')}
          value={academicTitleInputValue}
          size="small"
          onChange={handleAcademicTitleInputValueChange}
          sx={{ minWidth: 100, flex: 1 }}
        >
          {academicTitlesList.map((title) => (
            <MenuItem key={title} value={title}>
              {title}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          id="text-field-fn"
          error={errors.firstName}
          helperText={t(errors.firstName)}
          name="firstName"
          size="small"
          label={t('label_first_name')}
          variant="outlined"
          value={values.firstName || ''}
          onChange={handleChange}
          sx={{ minWidth: 100, flex: 1 }}
        />
        <TextField
          id="text-field-ln"
          error={errors.lastName}
          helperText={t(errors.lastName)}
          name="lastName"
          size="small"
          label={t('label_last_name')}
          variant="outlined"
          value={values.lastName || ''}
          onChange={handleChange}
          sx={{ minWidth: 100, flex: 1 }}
        />
        <TextField
          id="text-field-department"
          error={errors.department}
          helperText={t(errors.department)}
          name="department"
          size="small"
          label={t('department')}
          variant="outlined"
          value={values.department || ''}
          onChange={handleChange}
          sx={{ minWidth: 100, flex: 1 }}
        />
        <TextField
          id="text-field-role"
          select
          label={t('label_user_role')}
          value={roleInputValue}
          size="small"
          onChange={handleRoleInputValueChange}
          sx={{ minWidth: 100, flex: 1 }}
        >
          {userRolesList.map((role) => (
            <MenuItem key={role.key} value={role.key}>
              {role.title}
            </MenuItem>
          ))}
        </TextField>
        <LocalizationProvider size="small" dateAdapter={AdapterDayjs}>
          <DesktopDatePicker
            label={t('label_last_date_of_evaluation')}
            inputFormat="DD/MM/YYYY"
            value={lastDateOfEvalInputValue}
            onChange={handleLastDateOfEvalInputValueChange}
            renderInput={(params) => (
              <TextField type="date" size="small" {...params} />
            )}
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
            {t('button_add')}
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
        columns={usersTableColumnsDef}
        rows={users}
        getRowId={(row) => row.id}
        rowsPerPageOptions={[5, 25, 50]}
        pageSize={tablePageSize}
        loading={isUsersTableLoading}
        autoHeight
        onPageSizeChange={(newPageSize) => setTablePageSize(newPageSize)}
        components={{
          Toolbar: customDataGridToolbar,
          LoadingOverlay: LinearProgress,
        }}
        onCellEditCommit={(params) => setActiveRow(params.id)}
      />
      <Box sx={{ pt: 1, pb: 1, display: 'flex', flexDirection: 'row' }}>
        <Box sx={{ p: 0.5, border: 'solid 1px #e0e0e0', borderRadius: '5px' }}>
          <input
            multiple
            name="files"
            type="file"
            onChange={handleFileSelect}
          />
          <Button size="small" onClick={importFile}>
            {t('button_import')}
          </Button>
          {isFileUploadLoading && <LinearProgress />}
        </Box>
      </Box>
    </Box>
  );
}
