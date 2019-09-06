import React from 'react';

import { ThemeProvider} from '@material-ui/styles';
import {amber, lightGreen, red} from '@material-ui/core/colors';
import {CssBaseline} from '@material-ui/core';
import {createMuiTheme} from '@material-ui/core/styles';


import SudokuAppBar from './SudokuAppBar';
import SudokuDrawer from './SudokuDrawer';
import SudokuContainer from './SudokuContainer';

function App() {
  return (
    <React.Fragment>
      <CssBaseline />
      <ThemeProvider theme={theme}>
        <SudokuAppBar />
        <SudokuDrawer />
        <SudokuContainer />
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

export default App
