import React, { useContext, useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import DeleteIcon from '@mui/icons-material/Delete';
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
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import indexConfig from '../../../config/index.config.js';
import UserContext from '../../../context/UserContext/UserContext.js';
import 'react-toastify/dist/ReactToastify.css';

const Transition = React.forwardRef((props, ref) => (
  <Slide direction="down" ref={ref} {...props} />
));

export default function DeleteAction({ params }) {
  const { t } = useTranslation();
  const [isDeleteLoading, setDeleteLoading] = useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { token } = useContext(UserContext);
  const [isUpdate, setUpdated] = useState(false);

  useEffect(() => {}, [isUpdate]);

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
    fetch(`${indexConfig.server.url}/wzhzData/removeMember`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: params.row.wzhz.id,
      }),
    }).then(async (response) => {
      setDeleteLoading(false);
      if (response.ok) {
        notifySuccess(t('success_remove_wzhz_member'));
        setUpdated(true);
      } else {
        notifyError(t('error_remove_wzhz_member'));
      }
    });
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
      ></Box>
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
