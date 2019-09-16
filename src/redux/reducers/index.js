import {combineReducers} from 'redux';
import { 
  TOGGLE_DRAWER, 
  ADD_TAB, 
  CHANGE_TAB, 
  REMOVE_TAB, 
  SNACKBAR_CLOSE,
  SNACKBAR_NO_SUDOKU,
  THEME_TYPE_TOGGLE,
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

const dialogInitState = null
function dialog(state = dialogInitState, action) {
  if (DIALOG_ACTIONS.includes(action.type)) {
    return action.type;
  } else {
    // FIXME: or return state?
    return null;
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
        array: [...state.array, {name: payload.name, id: payload.id}],
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
  sudoku: {
    color: {
      light: '#212121',
      dark: 'rgb(255,255,255)'
    },
    shadow: {
      light: 'rgba(33, 33, 33, .3)',
      dark: 'rgba(255,255,255, .5)'
    },
    cell: {
      neutralBg: {
        light: 'white',
        dark: '#212121'
      },
      hoverBg: {
        light: 'rgb(218, 255, 214)',
        dark: 'rgb(218, 255, 214)'
      },
      litBg: {
        light: 'rgb(216, 216, 216)',
        dark: 'rgb(80, 80, 80)'
      },
      spottedBg: {
        light: 'rgb(153, 153, 153)',
        dark: 'rgb(153, 153, 153)',
      },
      conflictingBg: {
        light: 'rgb(255, 117, 117)',
        dark: 'rgb(255, 117, 117)'
      },
      selectedBg: {
        light: 'rgb(168, 168, 255)',
        dark: 'rgb(168, 168, 255)'
      },
      focusedBg: {
        light:  'rgb(100, 255, 255)',
        dark:  'rgb(100, 255, 255)'
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