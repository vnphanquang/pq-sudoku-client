import React from 'react';
import {makeStyles} from '@material-ui/styles';
import {
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  Button,
  Typography,
} from '@material-ui/core';

import {dialogLabels} from '../../lang';

function SaveAsOnTabCloseDialog({onSave, onCancel, onClose, onToggleShowAgain}) {
  const classes = useStyles();

  return (
    <Dialog
      classes={{paper: classes.paper}}
      onClose={onCancel}
      open
      disableBackdropClick
    >
    <DialogTitle>{dialogLabels.saveYourWork}</DialogTitle>
      <DialogContent dividers>
        <Typography variant="body1" align="center">
          {dialogLabels.saveAsOnTabClosePrompt}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onToggleShowAgain}>{dialogLabels.doNotShowAgain}</Button>
        <Button onClick={onCancel}>{dialogLabels.cancel}</Button>
        <Button onClick={onClose}>{dialogLabels.close}</Button>
        <Button onClick={onSave}>{dialogLabels.save}</Button>
      </DialogActions>
    </Dialog>
  )
}

const useStyles = makeStyles(theme => ({
  paper: {
    // minWidth: 300,
    // minHeight: 15,
  },
}))

export default React.memo(SaveAsOnTabCloseDialog);
