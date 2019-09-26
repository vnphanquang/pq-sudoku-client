import React from 'react';

import {
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  Button,
  Typography,
} from '@material-ui/core';

import {dialogLabels } from '../../lang';
function AlreadyOpenDialog({onClose}) {
  const [open, setOpen] = React.useState(true);
  return (
    <Dialog
      disableBackdropClick
      onClose={onClose}
      open={open}
    >
    <DialogTitle>{dialogLabels.alreadyOpen}</DialogTitle>
      <DialogContent dividers>
        <Typography variant="body1" align="center">
          {dialogLabels.alreadyOpenMessage}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen(false)}>{dialogLabels.close}</Button>
      </DialogActions>
    </Dialog>
  )
}

export default React.memo(AlreadyOpenDialog);
