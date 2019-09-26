import React from 'react';
import { connect } from 'react-redux';
import { ThemeProvider } from '@material-ui/styles';
import { CssBaseline } from '@material-ui/core';
import { createMuiTheme } from '@material-ui/core/styles';
import blue from '@material-ui/core/colors/blue';

import { HotKeys } from 'react-hotkeys';

import App from './App';

import {
  DialogAction,
  DIALOG_ADD_TAB, 
  DIALOG_EXPORT, 
  DIALOG_SAVEAS,
  DIALOG_OPEN,
  DIALOG_SETTINGS,
  DIALOG_HELP,
} from '../redux/actions/dialogs';
import { SudokuPencilToggle } from '../redux/actions/sudokus';
import { DrawerToggle } from '../redux/actions/general';
import { ThemeTypeToggle } from '../redux/actions/theme';

const keyMap = {
  TOGGLE_DRAWER: "ctrl+b",
  TOGGLE_PENCIL: "alt+p",
  TOGGLE_THEME_TYPE: "alt+t",
  ADD: "alt+n",
  OPEN: "ctrl+o",
  SAVEAS: "ctrl+s",
  EXPORT: "ctrl+e",
  SETTINGS: "ctrl+p",
  HELP: "f1",
}

class AppContainer extends React.Component {
  
  // componentDidMount() {
  //   window.onbeforeunload = (e) => {
  //     e.preventDefault();
  //     window.localStorage.removeItem('open');
  //     e.returnValue = '';
  //   }
  // }

  render() {
    console.log('AppContainer rendered');
    let {theme} = this.props;
    theme = createMuiTheme({
      palette: {
        type: theme.type,
        primary: blue
      },
      colors: theme.colors,
      sudoku: theme.sudoku,
    })

    return (
      <React.Fragment>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <HotKeys keyMap={keyMap}>
            <App hotkeyHandlers={this.props.hotkeyHandlers}/>
          </HotKeys>
        </ThemeProvider>
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => ({
  theme: state.theme,
})

//TODO: Globalize Hotkeys to Redux?
const mapDispatchToProps = (dispatch, ownProps) => ({
  hotkeyHandlers: {
    TOGGLE_DRAWER: (e) => {
      e.preventDefault();
      e.stopPropagation();
      dispatch(DrawerToggle());
    },
    TOGGLE_PENCIL: (e) => {
      e.preventDefault();
      e.stopPropagation();
      dispatch(SudokuPencilToggle());
    },
    TOGGLE_THEME_TYPE: (e) => {
      e.preventDefault();
      e.stopPropagation();
      dispatch(ThemeTypeToggle());
    },
    ADD: (e) => {
      e.preventDefault();
      e.stopPropagation();
      dispatch(DialogAction(DIALOG_ADD_TAB));
    },
    OPEN: (e) => {
      e.preventDefault();
      e.stopPropagation();
      dispatch(DialogAction(DIALOG_OPEN));
    },
    SAVEAS: (e) => {
      e.preventDefault();
      e.stopPropagation();
      dispatch(DialogAction(DIALOG_SAVEAS));
    },
    EXPORT: (e) => {
      e.preventDefault();
      e.stopPropagation();
      dispatch(DialogAction(DIALOG_EXPORT));
    },
    SETTINGS: (e) => {
      e.preventDefault();
      e.stopPropagation();
      dispatch(DialogAction(DIALOG_SETTINGS));
    },
    HELP: (e) => {
      e.preventDefault();
      e.stopPropagation();
      dispatch(DialogAction(DIALOG_HELP));
    },
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(AppContainer);
