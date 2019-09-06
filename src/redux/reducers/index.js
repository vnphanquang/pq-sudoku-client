import {combineReducers} from 'redux';
import { TOGGLE_DRAWER, ADD_TAB } from '../actions';

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

const sudokusInitState = {
  activeIndex: null,
  lastAction: null,
  array: []
}

function tabs(state = sudokusInitState, action) {
  switch (action.type) {
    case ADD_TAB:
      return {
        activeIndex: action.payload.index || state.activeIndex || 0,
        lastAction: {type: action.type},
        array: [
        ...state.array,
        action.payload
        ]
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