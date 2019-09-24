import {combineReducers} from 'redux';
import { 
  TOGGLE_DRAWER, 
  SNACKBAR_CLOSE,
  SNACKBAR_NO_SUDOKU,
} 
from '../actions';

import dialog from './dialogs';
import sudokus from './sudokus';
import theme from './theme';

const navigationInitState = {
  drawerOpen: false
}

function navigation(state = navigationInitState, {type, payload}) {
  switch (type) {
    case TOGGLE_DRAWER:
      return { 
        ...state,
        drawerOpen: payload === undefined ? !state.drawerOpen : payload
      };
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
  navigation,
  sudokus,
  dialog,
  snackbar,
})

export default rootReducer;