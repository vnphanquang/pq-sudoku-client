import {errorMessages} from '../lang';

class NoActiveSudokuError extends Error {
  constructor(...params) {
    super(...params);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, NoActiveSudokuError);
    };
    this.name = 'NoActiveSudokuError';
    this.message = errorMessages.noActiveSudoku;
  }
}

export default NoActiveSudokuError;