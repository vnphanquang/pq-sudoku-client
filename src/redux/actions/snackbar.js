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

export function SnackbarGenericSuccess({message}) {
  return {
    type: 'SNACKBAR_GENERIC_SUCCESS',
    payload: {message}
  }
}

export function SnackbarGenericInfo({message}) {
  return {
    type: 'SNACKBAR_GENERIC_INFO',
    payload: {message}
  }
}