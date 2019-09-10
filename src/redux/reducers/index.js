import {combineReducers} from 'redux';
import { TOGGLE_DRAWER, ADD_TAB, CHANGE_TAB, REMOVE_TAB } from '../actions';
import uuidv1 from 'uuid/v1';
import { PassThrough } from 'stream';
import { nextTick } from 'q';
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

const tabsInitState = {
  activeIndex: null,
  array: []
}

function tabs(state = tabsInitState, {type, payload}) {
  switch (type) {
    case ADD_TAB:
      return {
        ...state,
        array: [...state.array, {name: payload.name, id: uuidv1()}],
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

const rootReducer = combineReducers({
  navigation,
  tabs
})

export default rootReducer;