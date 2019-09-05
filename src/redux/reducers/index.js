import {combineReducers} from 'redux';
import { TOGGLE_DRAWER } from '../actions';

const initialState = {
  drawerOpen: false
}

function navigation(state = initialState, action) {
  switch (action.type) {
    case TOGGLE_DRAWER:
      return { 
        drawerOpen: !state.drawerOpen
      };
    default:
      return state;
  }
}

const rootReducer = combineReducers({
  navigation,
})

export default rootReducer;