import React from 'react';

import {useSelector} from 'react-redux';

import { ThemeProvider} from '@material-ui/styles';
import {CssBaseline} from '@material-ui/core';
import {createMuiTheme, makeStyles} from '@material-ui/core/styles';

import SudokuAppBar from './SudokuAppBar';
import SudokuDrawer from './SudokuDrawer';
import Sudoku from './Sudoku';
import SudokuDialog from './Dialog';
import SudokuSnackbar from './Snackbar';
import {APPBAR_HEIGHT, COLLAPSED_DRAWER_WIDTH} from './utils';

function App() {
  const classes = useStyles();

  const theme = useSelector(state => createMuiTheme(state.theme));

  return (
    <React.Fragment>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className={classes.root}>
          <SudokuAppBar />
          <SudokuDrawer />
          <div className={classes.sudokuWrapper}>
            <Sudoku/>
          </div>
          <SudokuDialog />
          <SudokuSnackbar />
        </div>
      </ThemeProvider>
    </React.Fragment>
  )
}


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
