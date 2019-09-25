/* 
* Initial State
*/
export const InitState = {
  drawerOpen: false,
  saveAsPromptOnTabClose: true,
}

/* 
* Action Types
*/
export const TOGGLE_DRAWER = 'TOGGLE_DRAWER';
export const TOGGLE_SAVEAS_PROMPT_ON_TAB_CLOSE = 'TOGGLE_SAVEAS_PROMPT_ON_TAB_CLOSE';
export const GENERAL_SETTINGS = 'GENERAL_SETTINGS';

/* 
* Action Creators
*/

export function DrawerToggle(state) {
  return {
    type: TOGGLE_DRAWER,
    payload: state,
  };
}

export function SaveAsPromptOnTabCloseToggle(state) {
  return {
    type: TOGGLE_SAVEAS_PROMPT_ON_TAB_CLOSE,
    payload: state,
  }
}

export function GeneralSettings(general=InitState) {
  return {
    type: GENERAL_SETTINGS,
    payload: general,
  }
}