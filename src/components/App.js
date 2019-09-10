import React from 'react';

import { ThemeProvider} from '@material-ui/styles';
import {amber, lightGreen, red} from '@material-ui/core/colors';
import {CssBaseline} from '@material-ui/core';
import {createMuiTheme, makeStyles} from '@material-ui/core/styles';

import SudokuAppBar from './SudokuAppBar';
import SudokuDrawer from './SudokuDrawer';
import Sudoku from './Sudoku';
import {APPBAR_HEIGHT, COLLAPSED_DRAWER_WIDTH} from './utils';

function App() {
  const classes = useStyles();

  return (
    <React.Fragment>
      <CssBaseline />
      <ThemeProvider theme={theme}>
        <SudokuAppBar />
        <SudokuDrawer />
        <div className={classes.sudokuWrapper}>
          <Sudoku/>
        </div>
      </ThemeProvider>
    </React.Fragment>
  )
}


const theme = createMuiTheme({
  palette: {
    primary: lightGreen,
    secondary: amber,
    error: red,
  },
  cell: {
    hoverBg: 'rgb(218, 255, 214)',
    litBg: 'rgb(216, 216, 216)',
    spottedBg: 'rgb(153, 153, 153)',
    conflictingBg: 'rgb(255, 117, 117)',
    selectedBg: 'rgb(168, 168, 255)',
    focusedBg: 'rgb(100, 255, 255)',
  }
})


const useStyles = makeStyles( theme => ({
  root: {
    // position: 'absolute'
  },

  sudokuWrapper: {
    position: 'absolute',
    width: '100vw',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: APPBAR_HEIGHT,
    paddingLeft: COLLAPSED_DRAWER_WIDTH,
  }
}))

export default App
