import {messages} from '../../lang';
/* 
* Action Types
*/
export const TOGGLE_DRAWER = 'TOGGLE_DRAWER';

export const SNACKBAR_CLOSE = 'SNACKBAR_CLOSE';
export const SNACKBAR_NO_SUDOKU = 'SNACKBAR_NO_SUDOKU';

export const THEME_TYPE_TOGGLE = 'THEME_TYPE_TOGGLE';
export const THEME_REPLACE = 'THEME_REPLACE';

/* 
* Action Creators
*/

export function ThemeTypeToggle() {
  return {
    type: THEME_TYPE_TOGGLE
  }
}

export function ThemeReplacement(theme) {
  return {
    type: THEME_REPLACE,
    payload: theme
  }
}

export function DrawerToggle(state) {
  return {
    type: TOGGLE_DRAWER,
    payload: state,
  };
}


export function SnackbarClose() {
  return {
    type: SNACKBAR_CLOSE
  }
}

export function SnackbarNoSudoku() {
  return {
    type: SNACKBAR_NO_SUDOKU,
    payload: messages.noSudoku
  }
}
