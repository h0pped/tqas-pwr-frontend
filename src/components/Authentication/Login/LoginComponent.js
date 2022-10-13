import React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useTranslation } from 'react-i18next';

import validate from './LoginValidationRules.js';
import useForm from './useForm.js';

export default function Login({ handleFormClick }) {
  const { t } = useTranslation();

  const { values, handleChange, errors, handleSubmit } = useForm(
    login,
    validate,
  );

  function login() {
    // eslint-disable-next-line no-alert
    alert(
      JSON.stringify({
        email: values.email,
        password: values.password,
      }),
    );
  }

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
              error={errors.email}
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
              error={errors.password}
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
              onClick={handleSubmit}
              sx={{ mt: 3, mb: 2 }}
            >
              {t('btn_login')}
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
    </>
  );
}
