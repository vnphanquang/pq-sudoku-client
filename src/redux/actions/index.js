import uuidv1 from 'uuid/v1';
import {messages} from '../../lang';
/* 
* Action Types
*/
export const TOGGLE_DRAWER = 'TOGGLE_DRAWER';

export const ADD_TAB = 'ADD_TAB';
export const CHANGE_TAB = 'CHANGE_TAB';
export const REMOVE_TAB = 'REMOVE_TAB';

export const EXPORT_SUDOKU = 'EXPORT_SUDOKU';


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

export function TabAddition({name='New Sudoku', size=9, values=['1', '2', '3', '4', '5', '6', '7', '8', '9']}) {
  return {
    type: ADD_TAB,
    payload: {
      id: uuidv1(),
      name, size, values
    }
  }
}

export function TabChange(index) {
  return {
    type: CHANGE_TAB,
    payload: index
  }
}

export function TabRemoval(index) {
  return {
    type: REMOVE_TAB,
    payload: index
  }
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

// export function SudokuExport() {
//   return {
//     type: EXPORT_SUDOKU
//   }
// }