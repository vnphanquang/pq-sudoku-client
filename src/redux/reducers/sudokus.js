import { 
  SUDOKU_ADD, 
  SUDOKU_TAB_CHANGE,
  SUDOKU_REMOVE,
  SUDOKU_PENCIL_TOGGLE,
} 
from '../actions/sudokus';

const sudokusInitState = {
  activeIndex: null,
  array: [],
  pencil: false,
}

export default function sudokus(state = sudokusInitState, {type, payload}) {
  switch (type) {
    case SUDOKU_ADD:
      if (state.activeIndex !== null)
        state.array[state.activeIndex].cellsData = window.sudoku.getCellsData();
      return {
        ...state,
        array: [...state.array, payload],
        activeIndex: state.array.length
      }
    case SUDOKU_TAB_CHANGE:
      state.array[state.activeIndex].cellsData = window.sudoku.getCellsData();
      return {
        ...state,
        array: [...state.array],
        activeIndex: payload
      }
    case SUDOKU_REMOVE:
      let sudokus = state.array;
      let length = state.array.length;
      let activeIndex;
      if (length === 1) activeIndex = null;
      else if (payload === length - 1) activeIndex = payload - 1;
      else activeIndex = payload;
      return {
        ...state,
        array: [...sudokus.slice(0, payload), ...sudokus.slice(payload + 1, length)],
        activeIndex
      }
    case SUDOKU_PENCIL_TOGGLE:
      return {
        ...state,
        pencil: !state.pencil
      }
    default:
      return state;
  }
}