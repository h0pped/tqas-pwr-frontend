import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Alert from '@mui/material/Alert';
import Slide from '@mui/material/Slide';
import { useTranslation } from 'react-i18next';

const Transition = React.forwardRef((props, ref) => (
  <Slide direction="down" ref={ref} {...props} />
));

export default function AlertDialogSlide({
  isChangesDialogOpen,
  onClose,
  onCloseParent,
  onChangesDicard,
}) {
  const { t } = useTranslation();

  return (
    <Dialog
      open={isChangesDialogOpen}
      TransitionComponent={Transition}
      keepMounted
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle>
        {t('are_you_sure_you_want_to_close_this_window')}?
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-slide-description">
          {t('changes_you_made_may_not_be_saved')}
        </DialogContentText>
        <Alert sx={{ mt: 1 }} severity="info">
          {t(
            'to_save_your_changes_press_NO_and_click_SAVE_in_the_top_right_corner'
          )}
        </Alert>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t('button_no')}</Button>
        <Button
          onClick={() => {
            onClose();
            onCloseParent();
            onChangesDicard();
          }}
        >
          {t('button_yes')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
