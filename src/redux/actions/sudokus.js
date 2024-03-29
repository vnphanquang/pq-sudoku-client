import uuidv1 from 'uuid/v1';

/* 
* Initial State
*/
export const InitState = {
  activeIndex: null,
  array: [],
  pencil: false,
}
/* 
* Action Types
*/
export const SUDOKU_ADD = 'SUDOKU_ADD';
export const SUDOKU_TAB_CHANGE = 'SUDOKU_TAB_CHANGE';
export const SUDOKU_CLOSE = 'SUDOKU_CLOSE';
export const SUDOKU_PENCIL_TOGGLE = 'PENCIL_MODE_TOGGLE';
export const SUDOKU_VALUE_MAPPING = 'SUDOKU_VALUE_MAPPING';
export const SUDOKU_SAVE = 'SUDOKU_SAVE';
export const SUDOKU_FETCH_START = 'SUDOKU_FETCH_START';
export const SUDOKU_FETCH_APPLY = 'SUDOKU_FETCH_APPLY';
export const SUDOKU_FETCH_END = 'SUDOKU_FETCH_END';
export const CURRENT_SUDOKU_SETTINGS = 'CURRENT_SUDOKU_SETTINGS';

/* 
* Action Creators
*/
export function generateDefaultValues(size) {
  const values = [];
  for (let i = 0; i < size; i++) {
    values.push(`${(i+1).toString(size+1)}`);
  }
  return values;
}

export function SudokuAddition({
  name='New Sudoku', 
  size=9, 
  values=generateDefaultValues(size),
  cellValues,
  fetching=false
}) {
  return {
    type: SUDOKU_ADD,
    payload: {
      id: uuidv1(),
      name, size, values, cellValues, fetching
    }
  }
}

export function SudokuTabChange(index) {
  return {
    type: SUDOKU_TAB_CHANGE,
    payload: index
  }
}

export function SudokuClose(index) {
  return {
    type: SUDOKU_CLOSE,
    payload: index
  }
}

export function SudokuSave() {
  return {
    type: SUDOKU_SAVE,
  }
}

export function SudokuPencilToggle() {
  return {
    type: SUDOKU_PENCIL_TOGGLE
  }
}

export function SudokuValueMapping(valueMap) {
  return {
    type: SUDOKU_VALUE_MAPPING,
    payload: valueMap
  }
}

export function SudokuFetchStart(cellValues) {
  return {
    type: SUDOKU_FETCH_START,
    payload: cellValues
  }
}

export function SudokuFetchEnd(index) {
  return {
    type: SUDOKU_FETCH_END,
    payload: index,
  }
}

export function SudokuFetchApply(index, cellValues) {
  return {
    type: SUDOKU_FETCH_APPLY,
    payload: {
      index,
      cellValues
    }
  }
}

export function CurrentSudokuSettings(sudoku) {
  return {
    type: CURRENT_SUDOKU_SETTINGS,
    payload: sudoku
  }
}
