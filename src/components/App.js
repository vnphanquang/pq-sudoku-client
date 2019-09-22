import React from 'react';
import {withStyles} from '@material-ui/styles';

// import {

// } from '@material-ui/core';

import Navigator from './Navigator';
// import Drawer from './Drawer';
import Sudoku from './Sudoku';
import Dialog from './Dialog';
import Snackbar from './Snackbar';
import {APPBAR_HEIGHT, COLLAPSED_DRAWER_WIDTH} from './utils';

class App extends React.PureComponent {
  render() {
    // console.log('App rendered');
    let { classes } = this.props;
    return (
      <React.Fragment>
        <div className={classes.root}>
          <Navigator />
          <div className={classes.sudokuWrapper}>
            <Sudoku />
          </div>
          <Dialog />
          <Snackbar />
        </div>
      </React.Fragment>
    )
  }
}

const styles = theme => ({
  root: {
    // position: 'absolute'
  },

  sudokuWrapper: {
    position: 'absolute',
    width: '100vw',
    height: `calc(100vh - ${APPBAR_HEIGHT}px)`,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: APPBAR_HEIGHT,
    [theme.breakpoints.up('md')]: {
      marginLeft: COLLAPSED_DRAWER_WIDTH,
      width: `calc(100vw - ${COLLAPSED_DRAWER_WIDTH}px)`,
    },
  },
})

export default withStyles(styles)(App);
