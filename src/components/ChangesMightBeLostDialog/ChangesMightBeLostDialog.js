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

export default function AlertDialogSlide({ isChangesDialogOpen, onClose, onCloseParent, onChangesDicard }) {
  return (
    <Dialog
      open={isChangesDialogOpen}
      TransitionComponent={Transition}
      keepMounted
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle>Are you sure you want to close this window?</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-slide-description">
          Changes you made may not be saved.
        </DialogContentText>
        <Alert sx={{ mt: 1 }} severity="info">To save your changes, press NO and click SAVE in the top-right corner.</Alert>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>No</Button>
        <Button
          onClick={() => {
            onClose();
            onCloseParent();
            onChangesDicard();
          }}>Yes</Button>
      </DialogActions>
    </Dialog>
  );
}
