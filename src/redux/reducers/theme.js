import { 
  InitState,
  THEME_TYPE_TOGGLE,
  THEME_SETTINGS,
} 
from '../actions/theme';

export default function theme(state=InitState, {type, payload}) {
  switch(type) {
    case THEME_TYPE_TOGGLE:
      return {
        ...state,
        type: payload || (state.type === 'light' ? 'dark' : 'light'),
      }
    case THEME_SETTINGS:
      return payload;
    default:
      return state;
  }
}