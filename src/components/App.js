import React from 'react';
import { connect } from 'react-redux';
import { ThemeProvider, styled } from '@material-ui/styles';
import { CssBaseline } from '@material-ui/core';
import { createMuiTheme } from '@material-ui/core/styles';
import blue from '@material-ui/core/colors/blue';

import { GlobalHotKeys } from 'react-hotkeys';

import {
  DialogAction,
  DIALOG_ADD_TAB, 
  DIALOG_EXPORT, 
  DIALOG_SAVEAS,
  DIALOG_OPEN,
  DIALOG_SETTINGS,
  DIALOG_HELP,
  DIALOG_WELCOME,
} from '../redux/actions/dialogs';
import { SudokuPencilToggle, SudokuSave } from '../redux/actions/sudokus';
import { DrawerToggle } from '../redux/actions/general';
import { ThemeTypeToggle } from '../redux/actions/theme';

import Navigator from './Navigator';
import Sudoku from './Sudoku';
import Dialog from './Dialog';
import Snackbar from './Snackbar';
import {APPBAR_HEIGHT, COLLAPSED_DRAWER_WIDTH} from './utils';

const keyMap = {
  TOGGLE_DRAWER: ['ctrl+b', 'command+b'],
  TOGGLE_PENCIL: 'shift+P',
  TOGGLE_THEME_TYPE: 'shift+T',
  ADD: 'Shift+N',
  OPEN: ['ctrl+o', 'command+o'],
  SAVE: ['ctrl+s', 'command+s'],
  SAVEAS: ['ctrl+shift+s', 'command+shift+s'],
  EXPORT: ['ctrl+e', 'command+e'],
  SETTINGS: ['ctrl+p', 'command+p'],
  HELP: 'f1',
}

class App extends React.Component {
  
  componentDidMount() {
    if (this.props.new) {
      this.props.openTour();
    }
  }

  render() {
    // console.log('AppContainer rendered');
    let {theme, hotkeyHandlers} = this.props;
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
          <GlobalHotKeys keyMap={keyMap} handlers={hotkeyHandlers} />
          <Navigator />
          <SudokuWrapper>
            <Sudoku />
          </SudokuWrapper>
          <Dialog />
          <Snackbar />
        </ThemeProvider>
      </React.Fragment>
    )
  }
}


const SudokuWrapper = styled((props) => <div {...props}/>)(
  ({theme}) => ({
    position: 'absolute',
    width: '100vw',
    height: `calc(100vh - ${APPBAR_HEIGHT}px)`,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.11'%3E%3Cpath opacity='.5' d='M96 95h4v1h-4v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9zm-1 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9z'/%3E%3Cpath d='M6 5V0H5v5H0v1h5v94h1V6h94V5H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`, 
    marginTop: APPBAR_HEIGHT,
    [theme.breakpoints.up('md')]: {
      marginLeft: COLLAPSED_DRAWER_WIDTH,
      width: `calc(100vw - ${COLLAPSED_DRAWER_WIDTH}px)`,
    },
  })
)

const mapStateToProps = state => ({
  theme: state.theme,
})

//TODO: Globalize Hotkeys to Redux?
const mapDispatchToProps = dispatch => ({
  openTour: () => dispatch(DialogAction(DIALOG_WELCOME)),
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
    SAVE: (e) => {
      e.preventDefault();
      e.stopPropagation();
      dispatch(SudokuSave());
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

export default connect(mapStateToProps, mapDispatchToProps)(App);
