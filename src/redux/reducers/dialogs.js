import {  DIALOG_ACTIONS, DIALOG_CANCEL } from '../actions/dialogs';

const dialogInitState = {
  type: null,
  payload: null,
}

export default  function dialog(state = dialogInitState, {type, payload}) {
  if (DIALOG_ACTIONS.includes(type)) {
    return {type, payload};
  } else if (type === DIALOG_CANCEL) {
    return dialogInitState;
  } else {
    return state;
  }
}