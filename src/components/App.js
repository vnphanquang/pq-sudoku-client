import React from 'react';
import {connect} from 'react-redux';

import {CssBaseline} from '@material-ui/core';
import {ThemeProvider, withStyles} from '@material-ui/styles';
import {createMuiTheme} from '@material-ui/core/styles';

import Navigator from './Navigator';
// import Drawer from './Drawer';
import Sudoku from './Sudoku';
import Dialog from './Dialog';
import Snackbar from './Snackbar';
import {APPBAR_HEIGHT, COLLAPSED_DRAWER_WIDTH} from './utils';

class App extends React.PureComponent {
  render() {
    // console.log('App rendered');
    let {classes, theme} = this.props;
    theme = createMuiTheme({
      palette: {
        type: theme.type
      },
      colors: theme.colors,
      sudoku: theme.sudoku,
    })

    return (
      <React.Fragment>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <div className={classes.root}>
            <Navigator />
            {/* <Drawer /> */}
            <div className={classes.sudokuWrapper}>
              <Sudoku />
            </div>
            <Dialog />
            <Snackbar />
          </div>
        </ThemeProvider>
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
    paddingLeft: COLLAPSED_DRAWER_WIDTH,
  }
})
const mapStateToProps = (state, ownProps=state) => ({
  theme: (ownProps.theme.type === state.theme.type) ? ownProps.theme : state.theme
})

export default connect(mapStateToProps)(withStyles(styles)(App));
