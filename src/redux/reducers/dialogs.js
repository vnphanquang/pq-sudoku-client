import {  DIALOG_ACTIONS } from '../actions/dialogs';

const dialogInitState = null;

export default  function dialog(state = dialogInitState, action) {
  if (DIALOG_ACTIONS.includes(action.type)) {
    return action.type;
  } else {
    // FIXME: or return state?
    return dialogInitState;
  }
}