import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Alert from '@mui/material/Alert';
import Slide from '@mui/material/Slide';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

export default function ConfirmDelitionDialog({ isConfirmationDialogOpen, onClose, onConfirm }) {
  return (
    <Dialog
      open={isConfirmationDialogOpen}
      TransitionComponent={Transition}
      keepMounted
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle>Are you sure you want to remove this member?</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-slide-description">
          Changes you made will not be saved.
        </DialogContentText>
        <Alert sx={{ mt: 1 }} severity="warning">If this member is a part of WZHZ group, after removing it, you will need to make sure there is at least one memebr of WZHZ group is present in the current evaluation team.</Alert>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => {
            onClose();
        }}>No</Button>
        <Button
          onClick={() => {
            onConfirm();
          }}>Yes</Button>
      </DialogActions>
    </Dialog>
  );
}
