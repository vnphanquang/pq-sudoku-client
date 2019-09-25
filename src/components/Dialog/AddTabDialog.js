import React from 'react';

import { makeStyles } from '@material-ui/styles';
import {
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  TextField,
  Button,
  FormControl,
  FormHelperText,
  Select,
  MenuItem,
  Input,
  Tooltip,
  Typography,
} from '@material-ui/core';

import { generateDefaultValues } from '../../redux/actions/sudokus';
import { dialogLabels } from '../../lang';
import { StyledGrid } from '../Sudoku/Grid';
import { StyledCell } from '../Sudoku/Cell';
import { STYLE_STATES} from '../utils';

const sizeVariant = {
  4: '4x4',
  9: '9x9',
  16: '16x16',
  25: '25x25'
}

const defaultSettings = {
  size: '9',
  values: generateDefaultValues(9),
}

function TabAdditionDialog({onSubmit, onCancel}) {
  const classes = useStyles();
  const [settings, setSettings] = React.useState({
    name: '',
    ...defaultSettings,
  });

  function submit(e) {
    e.preventDefault();
    onSubmit({
      ...settings,
      size: parseInt(settings.size),
    });
    //TODO: add size parameter & value mapping option
  }
  function setDefault() {
    setSettings({...settings, ...defaultSettings});
  }

  function updateSettings(e) {
    setSettings({...settings, [e.target.name]: e.target.value});
  }

  function updateSize(e) {
    setSettings({
      ...settings,
      size: e.target.value,
      values: generateDefaultValues(parseInt(e.target.value))
    })
  }

  function updateValue(e) {
    if (!settings.values.some(value => value === e.target.value)) {
      settings.values[parseInt(e.target.name)] = e.target.value;
      setSettings({
        ...settings,
        values: [...settings.values]
      })
    }
  }

  const demoCells = [];
  const subgridSize = Math.sqrt(settings.size);
  let index = 0;
  for (let row = 0; row < subgridSize; row++) {
    for (let col = 0; col < subgridSize; col++) {
      demoCells.push(
        <StyledCell
            key={`demo-cell-${row}-${col}`}
            row={row} col={col}
            styleState={settings.values[index].length === 0 && STYLE_STATES.CONFLICTING}
          >
            <Tooltip className={classes.demoCellWrapper} title={`insert label #${index+1}`}>
              <Input
                required
                disableUnderline
                value={settings.values[index]}
                name={`${index}`}
                onChange={updateValue}
                type="text"
                inputProps={{maxLength: 2, minLength: 1}}
              />
            </Tooltip>
        </StyledCell>
      )
      index++;
    }
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
            error={settings.name.length === 0}
            required
            fullWidth
            label={dialogLabels.sudokuName.label}
            type="text"
            variant="outlined"
            placeholder={dialogLabels.sudokuName.placeholder}
            name="name"
            value={settings.name}
            onChange={updateSettings}
          />
          <FormControl fullWidth>
            <FormHelperText>{dialogLabels.sudokus.sizeHint}</FormHelperText>
            <Select
              value={settings.size}
              onChange={updateSize}
              name="size"
              variant="outlined"
            >
              {Object.entries(sizeVariant).map(([key, value]) => (
                <MenuItem
                  key={`feedback-about-${key}`}
                  value={key}
                >
                  {value}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <div className={classes.values}>
            <Typography 
              variant="body1" 
              component="label"
            >
              {dialogLabels.sudokus.valueMapping}
            </Typography>
            <Typography
                variant="body2"
                component="label"
              >
                {dialogLabels.sudokus.valueMappingHint}
              </Typography>
            <StyledGrid className={classes.demoGrid} rows={subgridSize} cols={subgridSize}>
              {demoCells}
            </StyledGrid>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={onCancel}>{dialogLabels.cancel}</Button>
          <Button onClick={setDefault}>{dialogLabels.default}</Button>
          <Button type="submit">{dialogLabels.create}</Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

const useStyles = makeStyles(theme => ({
  paper: {
    minWidth: 250,
    minHeight: 300,
    margin:  0,
  },
  content: {

  },
  values: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: theme.spacing(2),
    '& label': {
      alignSelf: 'start',
    }
  },
  demoGrid: {
    marginTop: theme.spacing(1),
    width: 200,
    height: 200,
  },
  demoCellWrapper: {
    width: '100%',
    height: '100%',
    '& input': {
      cursor: 'pointer',
      textAlign: 'center',
    },
  }
}));


export default React.memo(TabAdditionDialog);
