import {combineReducers} from 'redux';
import { 
  TOGGLE_DRAWER, 
  ADD_TAB, 
  CHANGE_TAB, 
  REMOVE_TAB, 
  SNACKBAR_CLOSE,
  SNACKBAR_NO_SUDOKU,
  THEME_TYPE_TOGGLE,
  THEME_REPLACE,

} 
from '../actions';

import {  DIALOG_ACTIONS } from '../actions/dialogs';

const navigationInitState = {
  drawerOpen: false
}
function navigation(state = navigationInitState, action) {
  switch (action.type) {
    case TOGGLE_DRAWER:
      return { 
        ...state,
        drawerOpen: !state.drawerOpen
      };
    default:
      return state;
  }
}

const dialogInitState = null;
function dialog(state = dialogInitState, action) {
  if (DIALOG_ACTIONS.includes(action.type)) {
    return action.type;
  } else {
    // FIXME: or return state?
    return dialogInitState;
  }
}

const tabsInitState = {
  activeIndex: null,
  array: []
}
function tabs(state = tabsInitState, {type, payload}) {
  switch (type) {
    case ADD_TAB:
      return {
        ...state,
        array: [...state.array, payload],
        activeIndex: state.array.length
      }
    case CHANGE_TAB:
      return {
        ...state,
        activeIndex: payload
      }
    case REMOVE_TAB:
      let tabs = state.array;
      let length = state.array.length;
      let activeIndex;
      if (length === 1) activeIndex = null;
      else if (payload === length - 1) activeIndex = payload - 1;
      else activeIndex = payload;
      return {
        ...state,
        array: [...tabs.slice(0, payload), ...tabs.slice(payload + 1, length)],
        activeIndex
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

const themeInitState = {
  type: 'dark',
  colors: {
    appBar: {
      light: '#4169E1',
      dark: '#696969',
    }
  },
  sudoku: {
    color: {
      light: '#212121',
      dark: '#ffffff'
    },
    shadow: {
      light: 'rgba(33, 33, 33, .3)',
      dark: 'rgba(255,255,255, .5)'
    },
    cell: {
      baseBg: {
        light: '#ffffff',
        dark: '#212121'
      },
      hoveredBg: {
        light: '#daffd6',
        dark: '#384d36'
      },
      litBg: {
        light: '#d8d8d8',
        dark: '#505050'
      },
      spottedBg: {
        light: '#999999',
        dark: '#999999',
      },
      conflictingBg: {
        light: '#ff7575',
        dark: '#ff7575'
      },
      selectedBg: {
        light: '#a8a8ff',
        dark: '#a8a8ff'
      },
      focusedBg: {
        light:  '#00FFFF',
        dark:  '#7F8C8D'
      },
    }
  },
}
function theme(state=themeInitState, {type, payload}) {
  switch(type) {
    case THEME_TYPE_TOGGLE:
      return {
        ...state,
        type: state.type === 'light' ? 'dark' : 'light',
      }
    case THEME_REPLACE:
      return payload || themeInitState;
    default:
      return state;
  }
}

const rootReducer = combineReducers({
  theme,
  navigation,
  tabs,
  dialog,
  snackbar,
})

export default rootReducer;