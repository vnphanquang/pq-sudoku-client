import {messages} from '../../lang';

/* 
* Initial State
*/
export const InitState = {
  type: null,
  message: "",
}

/* 
* Action Types
*/
export const SNACKBAR_CLOSE = 'SNACKBAR_CLOSE';
export const SNACKBAR_NO_SUDOKU = 'SNACKBAR_NO_SUDOKU';

/* 
* Action Creators
*/
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
