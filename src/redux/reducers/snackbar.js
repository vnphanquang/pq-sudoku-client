import { 
  InitState,
  SNACKBAR_CLOSE,
  SNACKBAR_NO_SUDOKU,
} from '../actions/snackbar';

export default function snackbar(state=InitState, {type, payload}) {
  switch(type) {
    case SNACKBAR_NO_SUDOKU:
      return {
        ...state,
        type: 'error', 
        message: payload
      };
    case SNACKBAR_CLOSE:
      return {
        ...state,
        type: null, message: ''
      };
    default:
      return state;
  }
}
