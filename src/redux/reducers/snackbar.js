import { 
  InitState,
  SNACKBAR_CLOSE,
  SNACKBAR_GENERIC_ERROR,
  SNACKBAR_GENERIC_SUCCESS,
  SNACKBAR_GENERIC_INFO,
} from '../actions/snackbar';

export default function snackbar(state=InitState, {type, payload}) {
  switch(type) {
    case SNACKBAR_GENERIC_ERROR:
      return {type: 'error', payload};
    case SNACKBAR_GENERIC_SUCCESS: 
      return {type: 'success', payload};
    case SNACKBAR_GENERIC_INFO:
      return {type: 'info', payload};
    case SNACKBAR_CLOSE:
      return InitState;
    default:
      return state;
  }
}
