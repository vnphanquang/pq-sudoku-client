import { 
  InitState,
  SUDOKU_ADD, 
  SUDOKU_TAB_CHANGE,
  SUDOKU_SAVE,
  SUDOKU_CLOSE,
  SUDOKU_PENCIL_TOGGLE,
  SUDOKU_VALUE_MAPPING,
  CURRENT_SUDOKU_SETTINGS,
} 
from '../actions/sudokus';

export default function sudokus(state = InitState, {type, payload}) {
  switch (type) {
    case SUDOKU_ADD:
      if (state.activeIndex !== null) {
        state.array[state.activeIndex].cellValues = window.sudokus.getCellValues();
      }
      return {
        ...state,
        array: [...state.array, payload],
        activeIndex: state.array.length
      }
    case SUDOKU_TAB_CHANGE:
      state.array[state.activeIndex].cellValues = window.sudokus.getCellValues();
      return {
        ...state,
        array: [...state.array],
        activeIndex: payload
      }
    case SUDOKU_CLOSE:
      const sudokus = state.array;
      const length = state.array.length;
      let activeIndex;
      if (length === 1) activeIndex = null;
      else if (payload === length - 1) activeIndex = payload - 1;
      else activeIndex = payload;
      return {
        ...state,
        array: [...sudokus.slice(0, payload), ...sudokus.slice(payload + 1, length)],
        activeIndex
      }
    case SUDOKU_SAVE:
      if (state.activeIndex !== null) {
        state.array[state.activeIndex].cellValues = window.sudokus.getCellValues();
      }
      return state;
    case SUDOKU_PENCIL_TOGGLE:
      return {
        ...state,
        pencil: !state.pencil
      }
    case SUDOKU_VALUE_MAPPING:
      state.array[state.activeIndex].values = payload;
      return {
        ...state,
        array: [...state.array]
      }
    case CURRENT_SUDOKU_SETTINGS:
      state.array[state.activeIndex] = payload;
      return {
        ...state,
        array: [...state.array]
      }
    default:
      return state;
  }
}