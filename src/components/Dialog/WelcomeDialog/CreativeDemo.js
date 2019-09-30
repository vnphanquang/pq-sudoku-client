import React from 'react';
import { makeStyles } from '@material-ui/styles';
import {
  Typography,
} from '@material-ui/core';

import creativeSudokuDemoDark from './demo-sudoku-creative-dark.svg';
import creativeSudokuDemoLight from './demo-sudoku-creative-light.svg';


function CreativeDemo({themeType}) {
  const classes = useStyles();

  return (
    <React.Fragment>
      <Typography className={classes.text} variant="body1">
        In the near future, We plan to introduce more grid templates, 
        better support and customization for SVG export, 
        auto-generation & solution algorithms, and much more. 
        Feel free to reach out for any error report or feature request. 
        In the meantime, stay creative!
      </Typography>
      <img 
        className={classes.demoGrid}
        src={themeType === 'light' ? creativeSudokuDemoLight : creativeSudokuDemoDark}
        alt="creative sudoku demo"
      />
      <Typography variant="body1">
        Thank you!
      </Typography>
    </React.Fragment>
  )
}

const useStyles = makeStyles(theme => ({
  demoGrid: {
    margin: theme.spacing(2, 0),
    height: '75%',
  },
  text: {
    [theme.breakpoints.up('lg')]: {
      width: '80%'
    },
  }
}))

export default React.memo(CreativeDemo);