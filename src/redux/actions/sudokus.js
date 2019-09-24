import uuidv1 from 'uuid/v1';

/* 
* Action Types
*/
export const SUDOKU_ADD = 'SUDOKU_ADD';
export const SUDOKU_TAB_CHANGE = 'SUDOKU_TAB_CHANGE';
export const SUDOKU_REMOVE = 'SUDOKU_REMOVE';
export const SUDOKU_PENCIL_TOGGLE = 'PENCIL_MODE_TOGGLE';
export const SUDOKU_VALUE_MAPPING = 'SUDOKU_VALUE_MAPPING';

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
  cellsData=(new Array(size)).fill((new Array(size)).fill(''))
}) {
  return {
    type: SUDOKU_ADD,
    payload: {
      id: uuidv1(),
      name, size, values, cellsData,
    }
  }
}

export function SudokuTabChange(index) {
  return {
    type: SUDOKU_TAB_CHANGE,
    payload: index
  }
}

export function SudokuRemoval(index) {
  return {
    type: SUDOKU_REMOVE,
    payload: index
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