/* 
* Initial State,
*/
export const InitState = {
  type: null,
  payload: null,
}

/* 
* Dialog Action Types
*/
export const DIALOG_CANCEL = 'DIALOG_CANCEL';
export const DIALOG_ADD_TAB = 'DIALOG_ADD_TAB';
export const DIALOG_CLOSE_TAB = 'DIALOG_REMOVE_TAB';
export const DIALOG_SAVEAS_ON_TAB_CLOSE = 'DIALOG_REMOVE_TAB_SAVEAS_PROMPT';
export const DIALOG_OPEN = 'DIALOG_OPEN';
export const DIALOG_SAVEAS = 'DIALOG_SAVEAS';
export const DIALOG_EXPORT = 'DIALOG_EXPORT';
export const DIALOG_SETTINGS = 'DIALOG_SETTINGS';
export const DIALOG_FEEDBACK = 'DIALOG_FEEDBACK';
export const DIALOG_HELP = 'DIALOG_HELP';
export const DIALOG_ABOUT = 'DIALOG_ABOUT';
export const DIALOG_WELCOME = 'DIALOG_WELCOME';
// Helper array
export const DIALOG_ACTIONS = [
  DIALOG_ADD_TAB, 
  DIALOG_CLOSE_TAB, 
  DIALOG_OPEN,
  DIALOG_SAVEAS,
  DIALOG_EXPORT, 
  DIALOG_SETTINGS,
  DIALOG_FEEDBACK,
  DIALOG_HELP,
  DIALOG_ABOUT,
  DIALOG_SAVEAS_ON_TAB_CLOSE,
  DIALOG_WELCOME,
];

/* 
* Dialog Action Creators
*/
export function DialogAction(type) {
  return {
    type
  };
}

export function DialogSaveAsOnTabClose(index) {
  return {
    type: DIALOG_SAVEAS_ON_TAB_CLOSE,
    payload: index,
  }
}