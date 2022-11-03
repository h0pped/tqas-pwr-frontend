import { useContext, useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Typography } from '@mui/material';
import LinearProgress from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { ToastContainer, toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import config from '../../../config/index.config.js';
import UserContext from '../../../context/UserContext/UserContext.js';
import DeleteAction from './DeleteActions.js';
import customDataGridToolbar from '../../../components/CustomGridToolbar/CustomDataGridToolBar.js';

import 'react-toastify/dist/ReactToastify.css';

export default function ManageEvaluationGroup({ setDrawerSelectedItem, link }) {
  const [usersList, setUsersList] = useState({ usersList: [] });
  const [isAddUserBtnLoading, setAddUserBtnLoading] = useState(false);
  const [isMembersTableLoading, setMembersTableLoading] = useState(false);
  const [members, setMembers] = useState({ members: [] });
  const { token } = useContext(UserContext);

  const [selectedUser, setSelectedUser] = useState(null);
  const [isUpdate, setUpdated] = useState(false);

  const { t } = useTranslation();

  useEffect(() => {
    getUsersList();
    getMembers();
  }, [isUpdate]);

  const notifySuccess = (msg) => toast.success(`${t('success')} ${msg}`, {
    position: 'top-center',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: 'light',
  });

  const notifyError = (msg) => toast.error(`${t('error_dialog')} ${msg}`, {
    position: 'top-center',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: 'light',
  });

  function getMembers() {
    setMembersTableLoading(true);
    try {
      fetch(`${config.server.url}/wzhzData/getMembers`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setMembers(data);
          setMembersTableLoading(false);
        });
    } catch (error) {
      notifyError(t('error_server;'));
    }
  }

  function getUsersList() {
    setMembersTableLoading(true);
    try {
      fetch(`${config.server.url}/userData/getUsers`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setUsersList(data);
          setMembersTableLoading(false);
        });
    } catch (error) {
      notifyError(t('error_server'));
    }
  }

  function addMembers() {
    setAddUserBtnLoading(true);
    if (selectedUser) {
      try {
        fetch(`${config.server.url}/wzhzData/addMember`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: selectedUser,
          }),
        }).then((response) => {
          if (response.ok) {
            notifySuccess(t('success_added_wzhz_member'));
            setUpdated(true);
          } else {
            notifyError(t('error_added_wzhz_member'));
          }
          setAddUserBtnLoading(false);
        });
      } catch (error) {
        setAddUserBtnLoading(false);
      }
    } else {
      setAddUserBtnLoading(false);
      notifyError(t('error_select_user'));
    }
  }

  const columns = [
    {
      field: 'wzhz',
      headerName: 'Id',
      minWidth: 50,
      flex: 0.3,
      valueFormatter: ({ value }) => value.id,
    },
    { field: 'email', headerName: 'Email address', minWidth: 300, flex: 1.5 },
    {
      field: 'academic_title',
      headerName: t('label_academic_title'),
      minWidth: 150,
      flex: 0.5,
    },
    {
      field: 'first_name',
      headerName: t('label_first_name'),
      minWidth: 200,
      flex: 0.5,
    },
    {
      field: 'last_name',
      headerName: t('label_last_name'),
      minWidth: 200,
      flex: 0.5,
    },
    {
      field: 'actions',
      headerName: '',
      type: 'actions',
      flex: 0.5,
      renderCell: (params) => <DeleteAction {...{ params, setUpdated }} />,
    },
  ];

  useEffect(() => {
    setDrawerSelectedItem(link);
  }, []);

  const [pageSize, setPageSize] = useState(5);

  return (
    <Box sx={{ m: 0, p: 0, height: 400 }}>
      <ToastContainer />
      <Box
        sx={{
          pt: 1,
          pb: 1,
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <Typography variant="h5">{t('WZHZ_group')}</Typography>
      </Box>
      <Box
        sx={{
          height: 400,
          width: '100%',
          justifyContent: 'space-between',
          alignContent: 'center',
          gap: 1,
        }}
      >
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
          <Autocomplete
            disablePortal
            id="combo-box-demo"
            size="small"
            options={usersList}
            onChange={(event, value) => setSelectedUser(value.id)}
            getOptionLabel={(option) => `${option.academic_title} ${option.first_name} ${option.last_name} <${option.email}>`}
            sx={{ width: 300, flex: 1 }}
            renderInput={(params) => <TextField {...params} label="User" />}
          />
          <Button
            size="24px"
            variant="contained"
            disabled={isAddUserBtnLoading}
            onClick={addMembers}
            sx={{ width: 100 }}
          >
            {t('button_add')}
          </Button>
        </Box>
        <DataGrid
          rows={members}
          columns={columns}
          rowsPerPageOptions={[5, 25, 50]}
          pageSize={pageSize}
          getRowId={(row) => row.id}
          loading={isMembersTableLoading}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
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
    </Box>
  );
}
