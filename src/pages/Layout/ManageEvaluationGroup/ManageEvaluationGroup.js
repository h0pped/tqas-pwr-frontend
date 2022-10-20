import React, { useEffect } from 'react';
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarColumnsButton,
  GridToolbarDensitySelector,
  GridToolbarQuickFilter,
  GridToolbarFilterButton,
} from '@mui/x-data-grid';
import { Tooltip, Typography } from '@mui/material';
import LinearProgress from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import { ToastContainer, toast } from 'react-toastify';
import useForm from './useForm.js';

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

  useEffect(() => {
    getUsers();
  }, []);

  async function getUsers() {
    try {
      await fetch('http://localhost:8000/userData/getUsers', {
        method: 'GET',
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          setUsers(
            data.map(
              (user) =>
                `${user.academic_title} ${user.first_name} ${user.last_name}`,
            ),
          );
          console.log(users);
        });
    } catch (error) {
      console.log(error);
    }
  }

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

  const columns = [
    { field: 'id', headerName: 'Id', minWidth: 50, flex: 0.3 },
    { field: 'email', headerName: 'Email address', minWidth: 300, flex: 1.5 },
    {
      field: 'academic_title',
      headerName: 'Academic title',
      valueOptions: academicTitles,
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
        <Box>
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
    {
      id: 1,
      email: 'Jhon.Miller@pwr.edu.pl',
      academic_title: 'DR',
      first_name: 'Jhon',
      last_name: 'Miller',
    },
    {
      id: 2,
      email: 'Jhon.Miller@pwr.edu.pl',
      academic_title: 'DR',
      first_name: 'Mike',
      last_name: 'Smith',
    },
    {
      id: 3,
      email: 'philip.stuart@pwr.edu.pl',
      academic_title: 'DR',
      first_name: 'Philip',
      last_name: 'Stuart',
    },
    {
      id: 4,
      email: 'alice.oliver@pwr.edu.pl',
      academic_title: 'DR.',
      first_name: 'Alice',
      last_name: 'Oliver',
    },
    {
      id: 5,
      email: 'Jhon.Miller@pwr.edu.pl',
      academic_title: 'DR.',
      first_name: 'Jhon',
      last_name: 'Miller',
    },
    {
      id: 6,
      email: 'kate.Cecil@pwr.edu.pl',
      academic_title: 'DR.',
      first_name: 'Kate',
      last_name: 'Cecil',
    },
  ];
  useEffect(() => {
    setDrawerSelectedItem(link);
  }, []);

  const [pageSize, setPageSize] = React.useState(5);

  const notifySuccess = (msg) =>
    toast.success(`Success! ${msg}`, {
      position: 'top-center',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'light',
    });

  // const { values, handleChange, errors, handleSubmitNewUser } = useForm(
  //   addUser,
  // );

  // function addUser() {
  //   // api call post user
  //   notifySuccess('New user created.');
  // }

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
            sx={{ width: 300, flex: 1 }}
            renderInput={(params) => <TextField {...params} label="User" />}
          />
          <Button
            size="small"
            variant="contained"
            // onClick={handleSubmitNewUser}
            sx={{ width: 100 }}
          >
            Add
          </Button>
        </Box>
        <DataGrid
          rows={rows}
          columns={columns}
          rowsPerPageOptions={[5, 25, 50]}
          pageSize={pageSize}
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
