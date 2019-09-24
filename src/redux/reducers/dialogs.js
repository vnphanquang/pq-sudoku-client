import {  DIALOG_ACTIONS, DIALOG_CANCEL } from '../actions/dialogs';

const dialogInitState = null;

export default  function dialog(state = dialogInitState, action) {
  if (DIALOG_ACTIONS.includes(action.type)) {
    return action.type;
  } else if (action.type === DIALOG_CANCEL) {
    return dialogInitState;
  } else {
    return state;
  }
}