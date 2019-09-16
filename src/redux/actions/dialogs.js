/* 
* Dialog Action Types
*/
export const DIALOG_CANCEL = 'DIALOG_CANCEL';
export const DIALOG_ADD_TAB = 'DIALOG_ADD_TAB';
export const DIALOG_REMOVE_TAB = 'DIALOG_REMOVE_TAB';
export const DIALOG_OPEN = 'DIALOG_OPEN';
export const DIALOG_SAVEAS = 'DIALOG_SAVEAS';
export const DIALOG_EXPORT = 'DIALOG_EXPORT';
export const DIALOG_SETTINGS = 'DIALOG_SETTINGS';
export const DIALOG_FEEDBACK = 'DIALOG_FEEDBACK';
export const DIALOG_HELP = 'DIALOG_HELP';
export const DIALOG_ABOUT = 'DIALOG_ABOUT';

// Helper array
export const DIALOG_ACTIONS = [
  DIALOG_ADD_TAB, 
  DIALOG_REMOVE_TAB, 
  DIALOG_OPEN,
  DIALOG_SAVEAS,
  DIALOG_EXPORT, 
  DIALOG_SETTINGS,
  DIALOG_FEEDBACK,
  DIALOG_HELP,
  DIALOG_ABOUT,
];

/* 
* Dialog Action Creators
*/
export function DialogAction(type) {
  return {
    type
  };
}