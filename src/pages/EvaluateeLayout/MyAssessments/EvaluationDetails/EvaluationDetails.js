import { useEffect, forwardRef, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import Slide from '@mui/material/Slide';
import { useTranslation } from 'react-i18next';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import DescriptionIcon from '@mui/icons-material/Description';
import CardActions from '@mui/material/CardActions';
import CardMedia from '@mui/material/CardMedia';

import ClearIcon from '@mui/icons-material/Clear';
import DoneIcon from '@mui/icons-material/Done';
import Divider from '@mui/material/Divider';
import c16Image from '../../../../assets/images/c-16-secondPict.jpeg';

const Transition = forwardRef((props, ref) => (
  <Slide direction="up" ref={ref} {...props} />
));

export default function EvaluationDetails({ assessmentDetails }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {}, [assessmentDetails]);

  if (assessmentDetails === undefined) {
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
              mt: 2,
            }}
          >
            <Typography sx={{ mb: 1 }} variant="h5">
              Evaluation Review
            </Typography>
          </Box>
          <Divider sx={{ mb: 3 }} variant="middle" />
          <Card
            sx={{
              minWidth: '100%',
              height: 'minContent',
              backgroundColor: '#fafafa',
            }}
          >
            <CardMedia
              component="img"
              height="180"
              image={c16Image}
              alt="green iguana"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                Result: 4.0
              </Typography>
              <Typography variant="body2" color="text.secondary">
                You have been evaluated on Thursday, October 21st 2022. You have
                14 days to accept or decline this results.
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                sx={{ mb: 1 }}
                size="small"
                onClick={handleClickOpen}
                endIcon={<ClearIcon />}
              >
                Decline Result
              </Button>
              <Dialog
                open={open}
                TransitionComponent={Transition}
                keepMounted
                onClose={handleClose}
                aria-describedby="alert-dialog-slide-description"
              >
                <DialogContent>
                  <DialogContentText
                    id="alert-dialog-slide-description"
                    sx={{ mb: 2 }}
                  >
                    Are you sure that you want to decline the result of
                    evaluation? if yes, please provide the reason:
                  </DialogContentText>
                  <TextareaAutosize
                    sx={{ mt: 3 }}
                    aria-label="minimum height"
                    minRows={5}
                    placeholder="Write your reason for declining"
                    style={{ width: '100%' }}
                  />
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleClose}>Yes</Button>
                  <Button onClick={handleClose}>Cancel</Button>
                </DialogActions>
              </Dialog>
              <Button sx={{ mb: 1 }} size="small" endIcon={<DoneIcon />}>
                Approve Result
              </Button>
            </CardActions>
            {/* <CardContent>
              <Typography
                sx={{ mt: 8 }}
                variant="h5"
                component="div"
                align="center"
              >
                You have been evaluated on Thursday, Ocotber 21st 2022. You have
                1
              </Typography>
              <Typography
                sx={{ mt: 5 }}
                variant="h5"
                component="div"
                align="center"
              >
                Your Result : 4.5
              </Typography>
            </CardContent> */}
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
              Open Protocol Form
            </Button>
          </Box>
        </Box>
      </Grid>
    </>
  );
}
