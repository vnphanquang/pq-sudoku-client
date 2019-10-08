import { 
  InitState,
  SNACKBAR_CLOSE,
  SNACKBAR_ACTIONS
} from '../actions/snackbar';

export default function snackbar(state=InitState, {type, payload}) {
  if (SNACKBAR_ACTIONS.includes(type)) {
    return {type, payload};
  } else if (type === SNACKBAR_CLOSE) {
    return InitState;
  } else {
    return state;
  }
}
