import React from 'react';
import {makeStyles} from '@material-ui/styles';

import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Button from '@material-ui/core/Button';

function TabAdditionDialog({onSubmit, onCancel}) {
  const classes = useStyles();
  const [name, setName] = React.useState('');

  function submit(e) {
    e.preventDefault();
    onSubmit(name);
  }

  return (
    <React.Fragment>
      <Dialog
        classes={{paper: classes.paper}}
        onClose={onCancel}
        open
      >
        <DialogTitle>New Tab</DialogTitle>
        <form action="" onSubmit={submit}>
          <TextField
            error={name.length === 0}
            required
            fullWidth
            autoFocus
            label="Name"
            type="text"
            variant="outlined"
            placeholder="Sudoku Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <DialogActions>
            <Button onClick={onCancel}>Cancel</Button>
            <Button type="submit">Create</Button>
          </DialogActions>
        </form>
      </Dialog>
    </React.Fragment>
  )
}

const useStyles = makeStyles(theme => ({
  paper: {
    width: '40%',
    minWidth: 250,
    margin:  0
  },
  mode: {
    justifyContent: 'center'
  }
}));


export default TabAdditionDialog
