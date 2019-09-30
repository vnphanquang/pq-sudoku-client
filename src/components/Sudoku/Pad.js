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

import {valueKeyStrokes} from './Grid';

function Pad(props) {
  console.log('Pad rendered!')
  const classes = useStyles(props);
  const {togglePencilMode, inputValue, pencil, values, clearCells} = props;
  return (
    <div className={classes.container}>
      <div className={classes.buttons}>
        <Tooltip title="Toggle pencil">
          <Button
            variant="outlined" 
            onClick={togglePencilMode}
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
        </Tooltip>
        <Tooltip title="Clear cell(s)">
          <Button 
            variant="outlined" 
            onClick={clearCells}
          >
            <DeleteSweepIcon/>
          </Button>
        </Tooltip>
      </div>
      <div className={classes.values}>
        {values.map((value, index) => (
          <Button 
            key={`valuePad-${value}`}
            variant="outlined"
            onClick={(e) => inputValue(valueKeyStrokes[index])}
          >
            <Typography variant="h4" style={{textTransform: 'none'}}>
              {value}
            </Typography>
          </Button>
        ))}
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
      width: 300,
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
    '& button': {
      flexBasis: 1,
      flexGrow: 1,
      '& svg': {
        fontSize: '1.75rem',
      },
      [theme.breakpoints.up('lg')]: {
        height: 80,
      },
    },
  },
  values: {
    display: 'flex',
    justifyContent: 'space-around',
    '& button': {
      [theme.breakpoints.down('md')]: {
        flexBasis: 1,
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
  }
}));

export default React.memo(Pad);