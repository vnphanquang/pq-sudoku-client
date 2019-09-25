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

function ConfirmationDialog({open, onCancel, onSubmit, message}) {
  const classes = useStyles();

  return (
    <Dialog
      classes={{paper: classes.paper}}
      onClose={onCancel}
      disableBackdropClick
      open={open}
    >
    <DialogTitle>{dialogLabels.default}</DialogTitle>
      <DialogContent dividers>
        <Typography variant="body1" align="center">
          {message}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>{dialogLabels.cancel}</Button>
        <Button onClick={onSubmit}>{dialogLabels.proceed}</Button>
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

export default React.memo(ConfirmationDialog);
