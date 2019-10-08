import React from 'react';
import {makeStyles} from '@material-ui/styles';

import {
  Button,
  Typography,
  Tooltip,
} from '@material-ui/core';

import {
  Create as CreateIcon,
  DeleteSweep as DeleteSweepIcon,
} from '@material-ui/icons';

import { valueKeyStrokes } from '../utils';
import { dialogLabels, tooltips } from '../../lang';


const activeTooltips = {
  tTogglePencil: tooltips.togglePencil, 
  tClearCells: tooltips.clearCells,
  tPadKey: (index) => `${tooltips.press} "${valueKeyStrokes[index]}" key`,
  tSolve: tooltips.solve,
  tGenerate: tooltips.generate,
}

function Pad(props) {
  // console.log('Pad rendered!')
  const classes = useStyles(props);
  const { 
    onPencil, 
    inputValue, 
    pencil, 
    values, 
    onClear,
    onSolve,
    onGenerate,
    fetching,
  } = props;

  let tTogglePencil, tClearCells, tPadKey, tSolve, tGenerate;
  if (fetching) {
    tTogglePencil = tClearCells = tPadKey = tSolve = tGenerate = tooltips.fetching;
    tPadKey = () => tooltips.fetching;
  } else {
    ({tTogglePencil, tClearCells, tPadKey, tSolve, tGenerate} = activeTooltips);
  }

  return (
    <div className={classes.container}>
      <div className={classes.buttons}>
        <Tooltip title={tTogglePencil} classes={{tooltip: classes.tooltip}}>
          <span>
            <Button
              variant="outlined" 
              onClick={onPencil}
              disabled={fetching}
            >
              <CreateIcon/>
              <Typography 
                color={pencil ? "primary" : "secondary"} 
                paragraph 
                align="right"
                style={{whiteSpace: 'pre'}}
              >
                {pencil ? `ON  ` : 'OFF'}
              </Typography>
            </Button>
          </span>
        </Tooltip>
        <Tooltip title={tClearCells} classes={{tooltip: classes.tooltip}}>
          <span>
            <Button 
              variant="outlined" 
              onClick={onClear}
              disabled={fetching}
            >
              <DeleteSweepIcon/>
            </Button>
          </span>
        </Tooltip>
      </div>
      <div className={classes.values}>
        {values.map((value, index) => (
          <Tooltip
            key={`valuePad-${value}`}
            title={tPadKey(index)}
            classes={{tooltip: classes.tooltip}}
          >
            <span>
              <Button 
                variant="outlined"
                disabled={fetching}
                onClick={(e) => inputValue(valueKeyStrokes[index])}
              >
                <Typography variant="h4" style={{textTransform: 'none'}}>
                  {value}
                </Typography>
              </Button>
            </span>
          </Tooltip>
        ))}
      </div>
      <div className={classes.buttons}>
        <Tooltip title={tSolve} classes={{tooltip: classes.tooltip}}>
          <span>
            <Button 
              variant="outlined" 
              onClick={onSolve}
              disabled={fetching}
            >
              <Typography>
                {dialogLabels.solve.toUpperCase()}
              </Typography>
            </Button>
          </span>
          </Tooltip>
          {/* <Tooltip title={tGenerate} classes={{tooltip: classes.tooltip}}>
            <span>
              <Button 
                variant="outlined" 
                onClick={onGenerate}
                disabled={fetching}
              >
                <Typography>
                  {dialogLabels.generate.toUpperCase()}
                </Typography>
              </Button>
            </span>
          </Tooltip> */}
      </div>
    </div>
  )
}

const useStyles = makeStyles(theme => ({
  container: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: theme.colors.bg[theme.palette.type],
    boxShadow: `1px 1px 6px ${theme.sudoku.shadow[theme.palette.type]}`,
    marginTop: theme.spacing(2),
    [theme.breakpoints.up('lg')]: {
      width: 350,
      marginTop: 0,
      marginLeft: theme.spacing(2),
    },
    [theme.breakpoints.down('md')]: {
      // height: 105,
      '& button': {
        height: 'auto',
      },
    },
  },
  buttons: {
    display: 'flex',
    fontSize: theme.typography.h5.fontSize,
    '& span': {
      flexBasis: 1,
      flexGrow: 1,
      display: 'flex'
    },
    '& button': {
      flexBasis: 1,
      flexGrow: 1,
      '& svg': {
        fontSize: '1.75rem',
      },
      height: 50,
      [theme.breakpoints.up('lg')]: {
        height: 80,
      },
    },
  },
  values: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    '& span': {
      width: '100%',
      height: '100%',
      flexBasis: 1,
      flexGrow: 1,
      display: 'flex'
    },
    '& button': {
      width: '100%',
      height: '100%',
      [theme.breakpoints.down('md')]: {
        //TODO: adjust dynamic wrapping?
        flexBasis: '11%',
        flexGrow: 1,
        minWidth: 0,
        padding: 0,
      },
    },
    [theme.breakpoints.up('lg')]: {
      marginTop: 0,
      height: 300,
      display: 'grid',
      gridTemplateRows: ({values}) => `repeat(${Math.sqrt(values.length)}, 1fr)`,
      gridTemplateColumns: ({values}) => `repeat(${Math.sqrt(values.length)}, 1fr)`,
    }
  },
  tooltip: {
    ...theme.typography.body2
  }
}));

export default React.memo(Pad);