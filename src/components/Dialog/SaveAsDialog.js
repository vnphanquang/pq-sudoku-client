import React from 'react';

import {makeStyles} from '@material-ui/styles';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from '@material-ui/core';

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

function SaveAsDialog({onSubmit, onCancel, data: sudoku}) {
  const classes = useStyles();
  const [name, setName] = React.useState(sudoku.name);

  function submit(e) {
    e.preventDefault();
    onSubmit(
      name, customFormat, 
      generateJSONDataURL({
        size: sudoku.size,
        cellValues: window.sudokus.getCellValues()
      })
    );
  }

  return (
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
        <DialogContent className={classes.content} dividers>
          <TextField
            error={name.length === 0}
            required
            fullWidth
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
          <Button type="submit">{dialogLabels.save}</Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

const useStyles = makeStyles(theme => ({
  paper: {
    minWidth: 250,
    minHeight: 215,
    margin:  0
  },
  content: {
  }
}));

export default React.memo(SaveAsDialog);
