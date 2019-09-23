import React from 'react';

import {makeStyles} from '@material-ui/styles';
import {
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  Button,
  Typography,
  Link,
} from '@material-ui/core';

import {dialogLabels, pqSudoku } from '../../lang';
function AboutDialog({onCancel}) {
  const classes = useStyles();
  return (
    <Dialog
      classes={{paper: classes.paper}}
      onClose={onCancel}
      open
    >
    <DialogTitle disableTypography>
      <Typography variant="h5" align="center">
        {pqSudoku}
      </Typography>
      <Typography variant="body2" align="center">
        {`Version ${'0.1.1'}. ${'© 2019 Quang Phan'}`}
      </Typography>
    </DialogTitle>
      <DialogContent dividers>
        <Typography variant="body1" align="center">
          pqSudoku is an open source project, 
          a playground built by and for sudoku enthusiasts. 
          You are using an early version of pqSudoku; 
          more exciting features are being developed at the moment. 
        </Typography>
        <Typography variant="body1" align="center">
          Any feedback or feature request is much appreciated. 
          Consider getting involved in the project too. Thank you!
        </Typography>
      </DialogContent>
      <DialogActions>
        <Link
          color="inherit"
          href="https://github.com/vnphanquang/pq-sudoku"
          target="_blank"
          underline="none"
        >
          <Button>{dialogLabels.source}</Button>
        </Link>
        <Button onClick={onCancel}>{dialogLabels.close}</Button>
    </DialogActions>
    </Dialog>
  )
}

const useStyles = makeStyles(theme => ({
  paper: {
    minWidth: 250,
    // margin:  0
  },
}));

export default AboutDialog
