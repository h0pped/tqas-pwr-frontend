import React, { useContext, useEffect, useState } from 'react';
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarColumnsButton,
  GridToolbarDensitySelector,
  GridToolbarQuickFilter,
  GridToolbarFilterButton,
} from '@mui/x-data-grid';
import { Typography } from '@mui/material';
import LinearProgress from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { ToastContainer, toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import indexConfig from '../../../config/index.config.js';
import UserContext from '../../../context/UserContext/UserContext.js';
import DeleteAction from './DeleteActions.js';

import 'react-toastify/dist/ReactToastify.css';

function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
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

export default function ManageEvaluationGroup({ setDrawerSelectedItem, link }) {
  const [users, setUsers] = React.useState({ users: [] });
  const [isUsersTableLoading, setUsersTableLoading] = React.useState(false);
  const [lists, setLists] = React.useState({ lists: [] });
  const { token } = useContext(UserContext);
  const [activeRowId, setActiveRow] = useState(null);

  const [selectedUser, setSelectedUser] = useState(null);

  const { t } = useTranslation();

  useEffect(() => {
    getUsers();
    getLists();
  }, []);

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

  async function getLists() {
    try {
      await fetch(`${indexConfig.server.url}/wzhzData/getMembers`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          setLists(data);
          console.log(lists);
        });
    } catch (error) {
      console.log(error);
    }
  }

  async function getUsers() {
    try {
      console.log(localStorage.getItem('token'));
      await fetch(`${indexConfig.server.url}/userData/getUsers`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          setUsers(data);
          setUsersTableLoading(false);
          console.log(users);
        });
    } catch (error) {
      console.log(error);
    }
  }

  async function addMembers() {
    if (selectedUser) {
      console.log(`PARAMS: ${selectedUser}`);
      try {
        await fetch(`${indexConfig.server.url}/wzhzData/addMember`, {
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
          console.log(`ADDD RESPONSE >>> ${JSON.stringify(response)}`);
          if (response.ok) {
            notifySuccess('Member was addedd. Please reload your page');
          } else {
            notifyError(
              'There was an error while adding a new member. Please try again',
            );
          }
        });
      } catch (error) {
        console.log(error);
        notifyError('Please select a user!');
      }
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
      headerName: 'Academic title',
      minWidth: 150,
      flex: 0.5,
    },
    { field: 'first_name', headerName: 'First name', minWidth: 200, flex: 0.5 },
    { field: 'last_name', headerName: 'Last name', minWidth: 200, flex: 0.5 },
    {
      field: 'actions',
      headerName: '',
      type: 'actions',
      flex: 0.5,
      renderCell: (params) => (
        <DeleteAction {...{ params, activeRowId, setActiveRow }} />
      ),
    },
  ];

  useEffect(() => {
    setDrawerSelectedItem(link);
  }, []);

  const [pageSize, setPageSize] = React.useState(5);

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
        <Typography variant="h5">WZHZ Group</Typography>
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
            options={users}
            onChange={(event, value) => setSelectedUser(value.id)}
            getOptionLabel={(option) =>
              `${option.academic_title} ${option.first_name} ${option.last_name} <${option.email}>`
            }
            sx={{ width: 300, flex: 1 }}
            renderInput={(params) => <TextField {...params} label="User" />}
          />
          <Button
            size="24px"
            variant="contained"
            onClick={() => {
              addMembers();
            }}
            sx={{ width: 100 }}
          >
            Add
          </Button>
        </Box>
        <DataGrid
          rows={lists}
          columns={columns}
          rowsPerPageOptions={[5, 25, 50]}
          pageSize={pageSize}
          getRowId={(row) => row.id}
          loading={isUsersTableLoading}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          components={{
            Toolbar: CustomToolbar,
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
