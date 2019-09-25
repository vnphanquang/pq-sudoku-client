import {  InitState, DIALOG_ACTIONS, DIALOG_CANCEL } from '../actions/dialogs';

export default  function dialog(state = InitState, {type, payload}) {
  if (DIALOG_ACTIONS.includes(type)) {
    return {type, payload};
  } else if (type === DIALOG_CANCEL) {
    return InitState;
  } else {
    return state;
  }
}