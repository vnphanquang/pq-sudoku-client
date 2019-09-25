import {combineReducers} from 'redux';
import { 
  TOGGLE_DRAWER, 
  TOGGLE_SAVEAS_PROMPT_ON_TAB_CLOSE,
  SNACKBAR_CLOSE,
  SNACKBAR_NO_SUDOKU,
} 
from '../actions';

import dialog from './dialogs';
import sudokus from './sudokus';
import theme from './theme';

const generalInitState = {
  drawerOpen: false,
  saveAsPromptOnTabClose: true,
}
function general(state = generalInitState, {type, payload}) {
  switch (type) {
    case TOGGLE_DRAWER:
      return { 
        ...state,
        drawerOpen: payload === undefined ? !state.drawerOpen : payload
      };
    case TOGGLE_SAVEAS_PROMPT_ON_TAB_CLOSE:
      return {
        ...state,
        saveAsPromptOnTabClose: payload === undefined ? !state.saveAsPromptOnTabClose : payload
      }
    default:
      return state;
  }
}

const snackbarInitState = {
  type: null,
  message: "",
}

function snackbar(state=snackbarInitState, {type, payload}) {
  switch(type) {
    case SNACKBAR_NO_SUDOKU:
      return {
        ...state,
        type: 'error', 
        message: payload
      };
    case SNACKBAR_CLOSE:
      return {
        ...state,
        type: null, message: ''
      };
    default:
      return state;
  }
}

const rootReducer = combineReducers({
  theme,
  general,
  sudokus,
  dialog,
  snackbar,
})

export default rootReducer;