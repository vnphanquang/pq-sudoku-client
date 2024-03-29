import React from 'react'

import {makeStyles} from '@material-ui/styles';
import FolderOpenIcon from '@material-ui/icons/FolderOpen';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from '@material-ui/core';

import {dialogLabels} from '../../lang';
import {customFormat} from './SaveAsDialog';

function OpenDialog({onSubmit, onCancel}) {
  const classes = useStyles();
  const [name, setName] = React.useState('');
  const [file, setFile] = React.useState(null);

  function changeFile(e) {
    const loadedFile = e.target.files[0];
    if (loadedFile) {
      setFile(loadedFile);
      setName(loadedFile.name.replace(`.${customFormat}`, ''));
    }
  }

  function submit(e) {
    e.preventDefault();
    const reader = new FileReader();
    reader.onload = () => {
      onSubmit(name, JSON.parse(reader.result))
    }
    reader.readAsBinaryString(file);
    
  }

  return (
    <Dialog
      classes={{paper: classes.paper}}
      onClose={onCancel}
      open
    >
      <DialogTitle>{dialogLabels.open}</DialogTitle>
      <form 
        action="" 
        onSubmit={submit}
      >
        <DialogContent className={classes.content} dividers>
          <input 
            name="sudoku-file-picker"
            type="file"
            required
            id="sudoku-file-picker"
            accept={`.${customFormat}`}
            multiple={false}
            onChange={changeFile}
            style={{display: 'none'}}
          />
          <label htmlFor="sudoku-file-picker">
            <Button variant="contained" component="span">
              <FolderOpenIcon className={classes.fileBtn}/>
              {dialogLabels.choose}
            </Button>
          </label>
          {
            (file !== null) && 
            <TextField
              className={classes.name}
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
          }
        </DialogContent>
        <DialogActions>
          <Button onClick={onCancel}>{dialogLabels.cancel}</Button>
          <Button type="submit">{dialogLabels.open}</Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

const useStyles = makeStyles(theme => ({
  paper: {
    minWidth: 250,
    margin:  0
  },
  content: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  name: {
    margin: theme.spacing(1)
  },
  fileBtn: {
    margin: theme.spacing(1)
  }
}));

export default React.memo(OpenDialog);
