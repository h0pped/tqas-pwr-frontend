import React, { useContext, useState } from 'react';

import { useTranslation } from 'react-i18next';

import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Slide from '@mui/material/Slide';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Alert from '@mui/material/Alert';

import UserContext from '../../../context/UserContext/UserContext.js';

import validate from './LoginValidationRules.js';
import useForm from './useForm.js';

import config from '../../../config/index.config.js';

const Transition = React.forwardRef((props, ref) => (
  <Slide direction="down" ref={ref} {...props} />
));

export default function Login({ handleFormClick }) {
  const { t } = useTranslation();

  const { values, handleChange, errors, handleSubmit } = useForm(
    loginHandler,
    validate,
  );

  const [isLoginError, setIsLoginError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useContext(UserContext);

  async function loginHandler() {
    setIsLoading(true);
    try {
      const result = await fetch(`${config.server.url}/auth/signIn`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
      if (result.status !== 200) {
        setIsLoginError(true);
      } else {
        const { token } = await result.json();
        login(token);
      }
    } catch (err) {
      setIsLoginError(true);
    } finally {
      setIsLoading(false);
    }
  }
  const handleClose = () => setIsLoginError(false);

  return (
    <>
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
            {t('login_title')}
          </Typography>
          <Box component="form" noValidate sx={{ mt: 1 }}>
            <TextField
              error={!!errors.email}
              helperText={t(errors.email)}
              margin="normal"
              required
              fullWidth
              id="email"
              label={t('label_email')}
              name="email"
              autoComplete="email"
              value={values.email || ''}
              onChange={handleChange}
              autoFocus
            />
            <TextField
              error={!!errors.password}
              helperText={t(errors.password)}
              margin="normal"
              required
              fullWidth
              name="password"
              label={t('label_password')}
              type="password"
              id="password"
              autoComplete="current-password"
              value={values.password || ''}
              onChange={handleChange}
            />
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'end',
              }}
            >
              <Button
                variant="text"
                onClick={(event) => handleFormClick(event, 2)}
              >
                {t('act_link_reset_psw')}
              </Button>
            </Box>
            <Button
              fullWidth
              variant="contained"
              disabled={isLoading}
              onClick={handleSubmit}
              sx={{ mt: 3, mb: 2 }}
            >
              {!isLoading ? t('btn_login') : t('btn_loading')}
            </Button>
            <Button
              fullWidth
              variant="text"
              onClick={(event) => handleFormClick(event, 1)}
              sx={{ mt: 0, mb: 2 }}
            >
              {t('act_link_activate_acc')}
            </Button>
          </Box>
        </Box>
      </Container>
      <Dialog
        open={isLoginError}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{t('error_dialog')}</DialogTitle>
        <DialogContent>
          <Alert severity="error">{t('acc_login_error')}</Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>OK</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
