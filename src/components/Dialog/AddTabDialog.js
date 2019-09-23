import React from 'react';

import {makeStyles} from '@material-ui/styles';
import {
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  TextField,
  Button,
} from '@material-ui/core';

import {dialogLabels} from '../../lang';

function TabAdditionDialog({onSubmit, onCancel}) {
  const classes = useStyles();
  const [name, setName] = React.useState('');

  function submit(e) {
    e.preventDefault();
    onSubmit({name});
    //TODO: add size parameter & value mapping option
  }

  return (
    <Dialog
      classes={{paper: classes.paper}}
      onClose={onCancel}
      open
    >
      <DialogTitle>{dialogLabels.newTab}</DialogTitle>
      <form 
        action="" 
        onSubmit={submit}
      >
        <DialogContent className={classes.content} dividers>
          <TextField
            error={name.length === 0}
            required
            fullWidth
            autoFocus
            label={dialogLabels.sudokuName.label}
            type="text"
            variant="outlined"
            placeholder={dialogLabels.sudokuName.placeholder}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onCancel}>{dialogLabels.cancel}</Button>
          <Button type="submit">{dialogLabels.create}</Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

const useStyles = makeStyles(theme => ({
  paper: {
    minWidth: 250,
    minHeight: 220,
    margin:  0,
  },
}));


export default TabAdditionDialog
