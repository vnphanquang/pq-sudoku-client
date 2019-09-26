/* 
* Initial State
*/
export const InitState = {
  type: null,
  payload: null,
}

export const SNACKBAR_GENERIC_ERROR = 'SNACKBAR_GENERIC_ERROR';

/* 
* Action Types
*/
export const SNACKBAR_CLOSE = 'SNACKBAR_CLOSE';

/* 
* Action Creators
*/
export function SnackbarClose() {
  return {
    type: SNACKBAR_CLOSE
  }
}

export function SnackbarGenericError(error) {
  return {
    type: 'SNACKBAR_GENERIC_ERROR',
    payload: error
  }
}