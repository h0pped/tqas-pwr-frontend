import React, { useContext, useState } from 'react';

import Box from '@mui/material/Box';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import Tooltip from '@mui/material/Tooltip';
import CircularProgress from '@mui/material/CircularProgress';
import Fab from '@mui/material/Fab';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import Slide from '@mui/material/Slide';

import { useTranslation } from 'react-i18next';

import { toast } from 'react-toastify';

import config from '../../../config/index.config.js';

import UserContext from '../../../context/UserContext/UserContext.js';

const Transition = React.forwardRef((props, ref) => (
  <Slide direction="down" ref={ref} {...props} />
));

export default function UsersActions({
  params,
  activeRowId,
  setActiveRow,
  setUpdated,
}) {
  const { t } = useTranslation();

  const { token } = useContext(UserContext);

  const [isEditLoading, setEditLoading] = useState(false);
  const [isDeleteLoading, setDeleteLoading] = useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);

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

  const handleDeleteUser = () => {
    setDeleteLoading(true);
    setDeleteDialogOpen(true);
  };

  const handleDeleteDialogOptionNo = () => {
    setDeleteDialogOpen(false);
    setDeleteLoading(false);
  };

  const handleDeleteDialogOptionYes = async () => {
    setDeleteDialogOpen(false);
    try {
      await fetch(`${config.server.url}/userData/deleteUser`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: params.row.id,
        }),
      }).then((response) => {
        setDeleteLoading(false);
        if (response.ok) {
          notifySuccess(t('success_user_deleted'));
          setActiveRow(null);
          setUpdated(true);
        } else {
          notifyError(t('error_user_not_deleted'));
        }
      });
    } catch (error) {
      setDeleteLoading(false);
      notifyError(t('error_server'));
    }
  };

  const handleUpdateUser = async () => {
    setEditLoading(true);

    let lastEvalDateDDMMYYYY = null;

    if (params.row.evaluatee.last_evaluated_date) {
      const lastEvalDateYYYYMMDD = params.row.evaluatee.last_evaluated_date;
      const dateParts = lastEvalDateYYYYMMDD.split('-');
      lastEvalDateDDMMYYYY = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
    }

    try {
      await fetch(`${config.server.url}/userData/updateUser`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
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
      }).then((response) => {
        setEditLoading(false);
        setActiveRow(null);
        if (response.ok) {
          notifySuccess(t('success_user_updated'));
          setUpdated(true);
        } else {
          notifyError(t('error_user_not_updated'));
        }
      });
    } catch (error) {
      setEditLoading(false);
      notifyError(t('error_server'));
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1 }}>
      <Dialog
        open={isDeleteDialogOpen}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleDeleteDialogOptionNo}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{t('dialog_header')}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            {t('dialog_content')}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogOptionYes}>
            {t('button_yes')}
          </Button>
          <Button onClick={handleDeleteDialogOptionNo}>{t('button_no')}</Button>
        </DialogActions>
      </Dialog>
      <Box
        sx={{
          m: 1,
          position: 'relative',
        }}
      >
        <Tooltip title={t('tooltip_save_changes')} placement="top">
          <Fab
            size="small"
            color="primary"
            disabled={params.id !== activeRowId || isEditLoading}
            aria-label="save"
            sx={{
              backgroundColor: 'primary',
              color: 'white',
            }}
            onClick={handleUpdateUser}
          >
            <SaveIcon />
          </Fab>
        </Tooltip>
        {isEditLoading && (
          <CircularProgress
            sx={{
              position: 'absolute',
              top: -1,
              left: 0,
              zIndex: 1,
            }}
          />
        )}
      </Box>
      <Box
        sx={{
          m: 1,
          position: 'relative',
        }}
      >
        <Tooltip title={t('tooltip_delete_user')} placement="top">
          <Fab
            size="small"
            sx={{
              backgroundColor: '#fafafa',
              color: '#39e9e9e',
              '&:hover': { bgcolor: '#D9372A', color: '#FFFFFF' },
            }}
            disabled={isDeleteLoading}
            aria-label="delete"
            onClick={handleDeleteUser}
          >
            <DeleteIcon />
          </Fab>
        </Tooltip>
        {isDeleteLoading && (
          <CircularProgress
            sx={{
              position: 'absolute',
              top: -1,
              left: 0,
              zIndex: 1,
            }}
          />
        )}
      </Box>
    </Box>
  );
}
