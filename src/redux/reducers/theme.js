import { 
  THEME_TYPE_TOGGLE,
  THEME_REPLACE,
} 
from '../actions';

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
export default function theme(state=themeInitState, {type, payload}) {
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