import React from 'react';

import Box from '@mui/material/Box';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import Tooltip from '@mui/material/Tooltip';
import { CircularProgress, Fab } from '@mui/material';
import { Check } from '@mui/icons-material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import Slide from '@mui/material/Slide';

const baseUrl = 'http://localhost:8080';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

export default function UsersActions({ params, activeRowId, setActiveRow }) {
  const [isEditLoading, setEditLoading] = React.useState(false);
  const [isEditSuccess, setEditSuccess] = React.useState(false);

  const [isDeleteLoading, setDeleteLoading] = React.useState(false);
  const [isDeleteSuccess, setDeleteSuccess] = React.useState(false);

  const [isDeleteConfirmed, setDeleteConfirmed] = React.useState(false);

  const handleUpdateUser = async () => {
    setEditLoading(true);

    const lastEvalDateYYYYMMDD = params.row.evaluatee.last_evaluated_date;
    const dateParts = lastEvalDateYYYYMMDD.split('-');
    const lastEvalDateDDMMYYYY = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;

    try {
      await fetch(
        `${baseUrl}/userData/updateUser`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: params.row.id,
            first_name: params.row.first_name,
            last_name: params.row.last_name,
            email: params.row.email,
            academic_title: params.row.academic_title,
            user_type: params.row.user_type,
            last_evaluated_date: lastEvalDateDDMMYYYY,
          }),
        },
      ).then((response) => {
        console.log(response);
        if (response.ok) {
          setEditLoading(false);
          setEditSuccess(true);
        } else {
          setEditLoading(false);
        }
      });
    } catch (error) {
      setEditLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    handleClickOpen();
    try {
      await fetch(
        `${baseUrl}/userData/deleteUser`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: params.row.id,
          }),
        },
      ).then((response) => {
        console.log(response);
        if (response.ok) {
          setDeleteLoading(false);
          setDeleteSuccess(true);
        } else {
          setDeleteLoading(false);
        }
      });
    } catch (error) {
      setDeleteLoading(false);
    }
  };

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDeleteConfirmation = () => {
    setDeleteConfirmed(true);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1 }}>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"Delete user?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Are you sure you want to delete this user?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Yes</Button>
          <Button onClick={handleClose}>No</Button>
        </DialogActions>
      </Dialog>
      <Box sx={{
        m: 1,
        position: 'relative',
      }}
      >
        {isEditSuccess ? (
          <Fab
            size="small"
            color="primary"
            sx={{ backgroundColor: 'green', color: 'white' }}
          >
            <Check />
          </Fab>
        ) : (
          <Tooltip title="Save changes" placement="top">
            <Fab
              size="small"
              color="primary"
              disabled={params.id !== activeRowId || isEditLoading}
              aria-label="save"
              sx={{ backgroundColor: 'primary', color: 'white' }}
              onClick={handleUpdateUser}
            >
              <SaveIcon />
            </Fab>
          </Tooltip>
        )}
        {isEditLoading && (
          <CircularProgress sx={{ position: 'absolute', top: -1, left: 0, zIndex: 1 }} />
        )}
      </Box>
      <Box sx={{
        m: 1,
        position: 'relative',
      }}
      >
        <Tooltip title="Delete user" placement="top">
          {isDeleteSuccess ? (
            <Fab
              size="small"
              sx={{ backgroundColor: 'green', color: 'white' }}
              aria-label="delete"
            >
              <Check />
            </Fab>
          ) : (
            <Fab
              size="small"
              sx={{ backgroundColor: '#fafafa', color: '#39e9e9e', '&:hover': { bgcolor: '#D9372A', color: '#FFFFFF' } }}
              disabled={isDeleteLoading}
              aria-label="delete"
              onClick={handleDeleteUser}
            >
              <DeleteIcon />
            </Fab>
          )}
        </Tooltip>
        {isDeleteLoading && (
          <CircularProgress />
        )}
      </Box>
    </Box>
  );
}
