import { useEffect, forwardRef, useState, useContext } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContentText from '@mui/material/DialogContentText';
import Slide from '@mui/material/Slide';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import DescriptionIcon from '@mui/icons-material/Description';
import CardActions from '@mui/material/CardActions';
import CardMedia from '@mui/material/CardMedia';

import ClearIcon from '@mui/icons-material/Clear';
import DoneIcon from '@mui/icons-material/Done';
import Divider from '@mui/material/Divider';
import UserContext from '../../../../context/UserContext/UserContext.js';
import config from '../../../../config/index.config.js';
import c16Image from '../../../../assets/images/c-16-pict.jpeg';

const Transition = forwardRef((props, ref) => (
  <Slide direction="up" ref={ref} {...props} />
));

export default function EvaluationDetails({ evaluationDetails }) {
  const { t } = useTranslation();
  const { token } = useContext(UserContext);
  const [isOpen, setIsOpen] = useState(false);
  const [rejectionReasonValue, setRejectionReasonValue] = useState('');
  const [rejectionReasonError, setRejecetionReasonValueError] = useState(false);

  const handleClickOpen = () => {
    setRejecetionReasonValueError(false);
    setRejectionReasonValue('');
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleResultChange = (event) => {
    setRejectionReasonValue(event.target.value);
  };

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
  const notifySuccess = (msg) =>
    toast.success(`${msg}`, {
      position: 'top-center',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'light',
    });

  useEffect(() => {}, [evaluationDetails]);

  const handleAcceptResult = async () => {
    const data = {
      evaluation_id: evaluationDetails.evaluations[0].id,
      status: 'Accepted',
    };
    fetch(
      `${config.server.url}/evaluationsManagement/evaluateeReviewEvaluation`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }
    ).then(notifySuccess(t('result_accepted')));
  };

  const handleRejectResult = async () => {
    const data = {
      evaluation_id: evaluationDetails.evaluations[0].id,
      status: 'Rejected',
      rejection_reason: rejectionReasonValue,
    };
    if (rejectionReasonValue.length > 0) {
      try {
        fetch(
          `${config.server.url}/evaluationsManagement/evaluateeReviewEvaluation`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          }
        ).then((response) => {
          if (response.ok) {
            notifySuccess(t('result_rejected'));
          } else {
            notifyError(t('result_rejected_error'));
          }
        });
      } catch (error) {
        notifyError(t('error_server'));
      }
    } else {
      notifyError(t('rejection_reason_required'));
      setRejecetionReasonValueError(true);
    }
  };

  if (evaluationDetails === undefined) {
    return (
      <Box
        sx={{
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Typography variant="subtitle2" sx={{ color: '#848884' }}>
          {t('select_assesment_on_left_to_see_details')}
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <Grid item xs={16} sx={{ height: '100%' }}>
        <Box
          sx={{
            p: 2,
            borderRadius: 1,
            backgroundColor: '#ffffff',
            boxShadow: 2,
            border: 'solid 1px rgba(235, 235, 235)',
            height: '100%',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <Typography sx={{ mb: 1 }} variant="h5">
              {t('assessment_result')}
            </Typography>
          </Box>
          <Divider sx={{ mb: 2 }} />
          <Card
            sx={{
              minWidth: '100%',
              height: 'minContent',
              backgroundColor: '#ffffff',
            }}
          >
            <CardMedia
              component="img"
              height="180"
              image={c16Image}
              alt="C-16 Building"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                {t('result')}: 4.0
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('congratulations')}
              </Typography>
              <Typography sx={{ mt: 1 }} variant="body2" color="text.secondary">
                {t('first_info')}. {t('second_info')}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('third_info')}
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                sx={{ mb: 1 }}
                size="small"
                onClick={handleClickOpen}
                endIcon={<ClearIcon />}
              >
                {t('decline_result')}
              </Button>
              <Dialog
                open={isOpen}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
              >
                <DialogTitle>{t('decline')}</DialogTitle>
                <DialogContent>
                  <DialogContentText
                    id="alert-dialog-slide-description"
                    sx={{ mb: 2 }}
                  >
                    {t('info_for_decline')}
                  </DialogContentText>
                  <TextareaAutosize
                    sx={{ mt: 3 }}
                    aria-label="minimum height"
                    minRows={5}
                    placeholder={t('reason_decline')}
                    style={{ width: '100%' }}
                    error={rejectionReasonError}
                    onChange={handleResultChange}
                    value={rejectionReasonValue}
                  />
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleRejectResult}>
                    {t('button_yes')}
                  </Button>
                  <Button onClick={handleClose}>{t('button_no')}</Button>
                </DialogActions>
              </Dialog>
              <Button
                sx={{ mb: 1 }}
                size="small"
                endIcon={<DoneIcon />}
                onClick={handleAcceptResult}
              >
                {t('approve_result')}
              </Button>
            </CardActions>
          </Card>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              mt: 2,
            }}
          >
            <Button
              size="medium"
              variant="outlined"
              endIcon={<DescriptionIcon />}
            >
              {t('open_protocol')}
            </Button>
          </Box>
        </Box>
      </Grid>
    </>
  );
}
