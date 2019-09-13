import React from 'react';
import {makeStyles} from '@material-ui/styles';

import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import {dialogLabels} from '../../lang';

export const customFormat = 'pqsudoku';

function generateJSONDataURL(object) {
  return URL.createObjectURL(
    new Blob(
      [JSON.stringify(object)],
      {type: 'application/json'}
    )
  )
}

function SaveAsDialog({onSubmit, onCancel, sudoku}) {
  const classes = useStyles();
  const [name, setName] = React.useState(sudoku.name);

  function submit(e) {
    e.preventDefault();
    onSubmit(
      name, customFormat, 
      generateJSONDataURL({
        cellValues: window.sudoku.getCellValues()
      })
    );
  }

  return (
    <React.Fragment>
      <Dialog
        classes={{paper: classes.paper}}
        onClose={onCancel}
        open
      >
        <DialogTitle>{dialogLabels.saveAs}</DialogTitle>
        <form 
          action="" 
          onSubmit={submit}
        >
          <div className={classes.content}>
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
          </div>
          <DialogActions>
            <Button onClick={onCancel}>{dialogLabels.cancel}</Button>
            <Button type="submit">{dialogLabels.save}</Button>
          </DialogActions>
        </form>
      </Dialog>
    </React.Fragment>
  )
}

const useStyles = makeStyles(theme => ({
  paper: {
    minWidth: 250,
    margin:  0
  },
  content: {
    padding: theme.spacing(0, 2),
  }
}));

export default SaveAsDialog
