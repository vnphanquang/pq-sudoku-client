import { 
  InitState,
  THEME_TYPE_TOGGLE,
  THEME_REPLACE,
} 
from '../actions/theme';

export default function theme(state=InitState, {type, payload}) {
  switch(type) {
    case THEME_TYPE_TOGGLE:
      return {
        ...state,
        type: state.type === 'light' ? 'dark' : 'light',
      }
    case THEME_REPLACE:
      return payload || InitState;
    default:
      return state;
  }
}