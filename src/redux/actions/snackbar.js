/* 
* Initial State
*/
export const InitState = {
  type: null,
  payload: null,
}

/* 
* Action Types
*/
export const SNACKBAR_CLOSE = 'SNACKBAR_CLOSE';
export const SNACKBAR_GENERIC_ERROR = 'SNACKBAR_GENERIC_ERROR';
export const SNACKBAR_GENERIC_SUCCESS = 'SNACKBAR_GENERIC_SUCCESS';
export const SNACKBAR_GENERIC_INFO = 'SNACKBAR_GENERIC_INFO';
export const SNACKBAR_SUDOKU_SOLUTION_REQUEST = 'SNACKBAR_SUDOKU_SOLUTION_REQUEST';
export const SNACKBAR_SUDOKU_SOLUTION_SUCCESS = 'SNACKBAR_GENERIC_INFO';

export const SNACKBAR_ACTIONS = [
  SNACKBAR_GENERIC_ERROR,
  SNACKBAR_GENERIC_SUCCESS,
  SNACKBAR_GENERIC_INFO,
];
/* 
* Action Creators
*/
export function SnackbarClose() {
  return {
    type: SNACKBAR_CLOSE
  }
}

export function SnackbarGenericError({message}) {
  return {
    type: SNACKBAR_GENERIC_ERROR,
    payload: { message }
  }
}

export function SnackbarGenericSuccess({message}) {
  return {
    type: SNACKBAR_GENERIC_SUCCESS,
    payload: { message }
  }
}

export function SnackbarGenericInfo({message}) {
  return {
    type: SNACKBAR_GENERIC_INFO,
    payload: { message }
  }
}