import { 
  InitState,
  SNACKBAR_CLOSE,
  SNACKBAR_GENERIC_ERROR,
} from '../actions/snackbar';

export default function snackbar(state=InitState, {type, payload}) {
  switch(type) {
    case SNACKBAR_GENERIC_ERROR:
      return {type: 'error', payload};
    case SNACKBAR_CLOSE:
      return InitState;
    default:
      return state;
  }
}
