import { useEffect, forwardRef, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import Slide from '@mui/material/Slide';

const Transition = forwardRef((props, ref) => (
  <Slide direction="up" ref={ref} {...props} />
));

export default function EvaluationDetails({ evaluationDetails }) {
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {}, [evaluationDetails]);

  return (
    <Grid item xs={15} sx={{ height: '100%' }}>
      <Box
        sx={{
          p: 0.7,
          borderRadius: 1,
          backgroundColor: '#f4f5f7',
          height: '100%',
        }}
      >
        <Card sx={{ minWidth: '100%', height: 350 }}>
          <CardContent>
            <Typography
              sx={{ mt: 5 }}
              variant="h5"
              component="div"
              align="center"
            >
              You have been evaluated on Thursday, Ocotber 21 2022
            </Typography>
            <Typography
              sx={{ mt: 5 }}
              variant="h5"
              component="div"
              align="center"
            >
              Your Result : 4.5
            </Typography>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-start',
                mt: 20,
              }}
            >
              <Button size="small">Open Protocol Form</Button>
            </Box>
          </CardContent>
        </Card>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            borderRadius: '3',
            p: 1,
            m: 1,
          }}
        >
          <Button sx={{ ml: 120 }} variant="contained">
            Accept
          </Button>
          <Button variant="contained" onClick={handleClickOpen}>
            Decline
          </Button>
          <Dialog
            open={open}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleClose}
            aria-describedby="alert-dialog-slide-description"
          >
            <DialogContent>
              <DialogContentText id="alert-dialog-slide-description">
                Are you sure that you want to decline the assessment? if yes,
                please provide the reason
              </DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                label="Reason"
                fullWidth
                variant="standard"
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Yes</Button>
              <Button onClick={handleClose}>Cancel</Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Box>
    </Grid>
  );
}
