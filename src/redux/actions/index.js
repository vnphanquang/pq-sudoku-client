import uuidv1 from 'uuid/v1';

/* 
* Action Types
*/
export const TOGGLE_DRAWER = 'TOGGLE_DRAWER';

export const ADD_TAB = 'ADD_TAB';
export const CHANGE_TAB = 'CHANGE_TAB';
export const REMOVE_TAB = 'REMOVE_TAB';

export const EXPORT_SUDOKU = 'EXPORT_SUDOKU';

export const DIALOG_CANCEL = 'DIALOG_CANCEL';
export const DIALOG_ADD_TAB = 'DIALOG_ADD_TAB';
export const DIALOG_REMOVE_TAB = 'DIALOG_REMOVE_TAB';
export const DIALOG_EXPORT = 'DIALOG_EXPORT';
export const DIALOG_SAVEAS = 'DIALIG_SAVEAS';
export const DIALOG_OPEN = 'DIALOG_OPEN';

export const DIALOG_ACTIONS = [
  DIALOG_ADD_TAB, 
  DIALOG_REMOVE_TAB, 
  DIALOG_EXPORT, 
  DIALOG_SAVEAS,
  DIALOG_OPEN
];

/* 
* Action Creators
*/
export function DrawerToggle() {
  return {type: TOGGLE_DRAWER};
}

export function TabAddition({name}) {
  return {
    type: ADD_TAB,
    payload: {
      name,
      id: uuidv1()
    }
  }
}

export function TabChange(index) {
  return {
    type: CHANGE_TAB,
    payload: index
  }
}

export function TabRemoval(index) {
  return {
    type: REMOVE_TAB,
    payload: index
  }
}

export function DialogCancellation() {
  return {
    type: DIALOG_CANCEL
  }
}

export function DialogTabAddition() {
  return {
    type: DIALOG_ADD_TAB
  }
}

export function DialogTabRemoval() {
  return {
    type: DIALOG_REMOVE_TAB
  }
}

export function DialogExport() {
  return {
    type: DIALOG_EXPORT
  }
}

export function DialogSaveAs() {
  return {
    type: DIALOG_SAVEAS
  }
}

export function DialogOpen() {
  return {
    type: DIALOG_OPEN
  }
}

// export function SudokuExport() {
//   return {
//     type: EXPORT_SUDOKU
//   }
// }