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
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import CircularProgress from '@mui/material/CircularProgress';
import { useTranslation } from 'react-i18next';

import validate from './PasswordResetValidationRules.js';
import useForm from './useForm.js';

import config from '../../../config/index.config.js';

const Transition = React.forwardRef((props, ref) => (
  <Slide direction="down" ref={ref} {...props} />
));

export default function PasswordResetComponent({ handleFormClick }) {
  const { t } = useTranslation();

  const [state, setState] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const { values, handleChange, errors, handleSubmit } = useForm(
    verify,
    validate
  );

  const [dialogContent, setDialogContent] = useState({
    title: t('success'),
    severity: 'success',
    content: t('acc_recovery_success'),
  });

  const [isOpen, setIsOpen] = React.useState(false);

  const handleClose = () => {
    setIsOpen(false);
  };
  const handleRecoveryCodeSend = async () => {
    setIsLoading(true);
    const res = await fetch(
      `${config.server.url}/auth/sendRecoveryPasswordCode`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: values.email,
        }),
      }
    );
    setIsLoading(false);
    return res.status;
  };

  const verifyRecoveryCode = async () => {
    setIsLoading(true);
    const res = await fetch(`${config.server.url}/auth/verifyRecoveryCode`, {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: values.email,
        code: values.code,
      }),
    });
    setIsLoading(false);
    return res.status;
  };

  const passwordRecoveryHandler = async () => {
    setIsLoading(true);
    const res = await fetch(`${config.server.url}/auth/passwordRecovery`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: values.email,
        code: values.code,
        password: values.password,
      }),
    });
    setIsLoading(false);
    return res.status;
  };
  async function verify() {
    if (state === 0 && values.email && !errors.email) {
      const codeSendStatus = await handleRecoveryCodeSend();
      if (codeSendStatus === 404) {
        setDialogContent({
          title: t('error_dialog'),
          severity: 'error',
          content: t('email_not_found'),
        });
        setIsOpen(true);
      } else if (codeSendStatus === 500) {
        setDialogContent({
          title: t('error_dialog'),
          severity: 'error',
          content: t('server_error'),
        });
        setIsOpen(true);
      } else if (codeSendStatus === 405) {
        setDialogContent({
          title: t('error_dialog'),
          severity: 'error',
          content: t('recovery_code_blocked'),
        });
        setIsOpen(true);
      } else if (codeSendStatus === 200) {
        setState(1);
      }
    } else if (state === 1 && values.code && !errors.code) {
      const verifyCodeStatus = await verifyRecoveryCode();
      if (verifyCodeStatus === 200) {
        setState(2);
      } else if (verifyCodeStatus === 400) {
        setDialogContent({
          title: t('error_dialog'),
          severity: 'error',
          content: t('wrong_recovery_code'),
        });
        setIsOpen(true);
      } else if (verifyCodeStatus === 405) {
        setDialogContent({
          title: t('error_dialog'),
          severity: 'error',
          content: t('recovery_code_blocked'),
        });
        setIsOpen(true);
      }
    } else if (state === 2 && values.password && !errors.password) {
      const status = await passwordRecoveryHandler();
      if (status === 200) {
        setState(3);
        setDialogContent({
          title: t('success'),
          severity: 'success',
          content: t('acc_recovery_success'),
        });
      } else if (status === 404) {
        setDialogContent({
          title: t('error_dialog'),
          severity: 'error',
          content: t('acc_revovery_not_found'),
        });
      } else {
        setDialogContent({
          title: t('error_dialog'),
          severity: 'error',
          content: t('acc_revovery_error'),
        });
      }
      setIsOpen(true);
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
              error={!!errors.email}
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
              error={state === 1 && !!errors.code}
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
              error={state === 2 && !!errors.password}
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
            disabled={isLoading}
            onClick={handleSubmit}
            sx={{ mt: 3, mb: 2 }}
          >
            {isLoading && <CircularProgress size={24} />}
            {!isLoading && state !== 2 && t('btn_act_acc_verify_email')}
            {!isLoading && state === 2 && t('btn_reset_password')}
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
        <DialogTitle>{dialogContent.title}</DialogTitle>
        <DialogContent>
          <Alert severity={dialogContent.severity}>
            {dialogContent.content}
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>OK</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
