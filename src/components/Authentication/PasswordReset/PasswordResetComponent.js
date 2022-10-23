import React, { useState } from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Alert from '@mui/material/Alert';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { useTranslation } from 'react-i18next';

import validate from './PasswordResetValidationRules.js';
import useForm from './useForm.js';

const Transition = React.forwardRef((props, ref) => (
  <Slide direction="down" ref={ref} {...props} />
));

export default function PasswordResetComponent({ handleFormClick }) {
  const { t } = useTranslation();

  const [state, setState] = useState(0);

  const { values, handleChange, errors, handleSubmit } = useForm(
    verify,
    validate,
  );

  const [isOpen, setOpen] = React.useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  function verify() {
    if (state < 3) {
      if (values.email && !errors.email) {
        setState(1);
      }

      if (values.code && !errors.code) {
        setState(2);
      }
      if (values.password && !errors.password) {
        setState(3);
        setOpen(true);
      }
    }
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          {t('reset_password_title')}
        </Typography>
        <Box component="form" noValidate sx={{ mt: 1 }}>
          <Tooltip
            title={state === 0 ? t('reset_psw_email_helper') : ''}
            placement="top"
            arrow
          >
            <TextField
              error={errors.email}
              helperText={t(errors.email)}
              margin="normal"
              required
              fullWidth
              id="email"
              label={t('label_email')}
              name="email"
              value={values.email || ''}
              onChange={handleChange}
              disabled={state !== 0}
              autoComplete="email"
              autoFocus
            />
          </Tooltip>
          <Tooltip
            title={state === 1 ? t('activate_acc_code_helper') : ''}
            placement="top"
            arrow
          >
            <TextField
              error={state === 1 && errors.code}
              helperText={state === 1 ? t(errors.code) : ''}
              margin="normal"
              required
              fullWidth
              id="code"
              label={t('label_code')}
              name="code"
              value={values.code || ''}
              onChange={handleChange}
              disabled={state !== 1}
              autoFocus
              focused={state === 1}
            />
          </Tooltip>
          <Tooltip
            title={state === 2 ? t('activate_acc_psw_helper') : ''}
            placement="top"
            arrow
          >
            <TextField
              error={state === 2 && errors.password}
              helperText={state === 2 ? t(errors.password) : ''}
              margin="normal"
              required
              fullWidth
              name="password"
              label={t('label_password')}
              value={values.password || ''}
              onChange={handleChange}
              disabled={state !== 2}
              type="password"
              id="password"
              autoComplete="current-password"
              focused={state === 2}
            />
          </Tooltip>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            onClick={handleSubmit}
            sx={{ mt: 3, mb: 2 }}
          >
            {state !== 2
              ? t('btn_act_acc_verify_email')
              : t('btn_reset_password')}
          </Button>
          <Button
            fullWidth
            variant="text"
            onClick={(event) => handleFormClick(event, 0)}
            sx={{ mt: 0, mb: 2 }}
          >
            {t('btn_act_acc_to_login')}
          </Button>
        </Box>
      </Box>
      <Dialog
        open={isOpen}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{t('success')}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            <Alert severity="success">{t('password_reset_success')}</Alert>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>OK</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
