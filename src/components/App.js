import React from 'react';
import {withStyles} from '@material-ui/styles';

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
          {/* <Drawer /> */}
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
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: APPBAR_HEIGHT,
    [theme.breakpoints.up('md')]: {
      paddingLeft: COLLAPSED_DRAWER_WIDTH,
    },
  },
})

export default withStyles(styles)(App);
