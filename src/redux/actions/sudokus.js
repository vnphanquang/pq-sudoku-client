import uuidv1 from 'uuid/v1';

/* 
* Action Types
*/
export const SUDOKU_ADD = 'SUDOKU_ADD';
export const SUDOKU_TAB_CHANGE = 'SUDOKU_TAB_CHANGE';
export const SUDOKU_REMOVE = 'SUDOKU_REMOVE';
export const SUDOKU_PENCIL_TOGGLE = 'PENCIL_MODE_TOGGLE';

/* 
* Action Creators
*/
export function SudokuAddition({
  name='New Sudoku', 
  size=9, 
  values=['1', '2', '3', '4', '5', '6', '7', '8', '9']
}) {
  return {
    type: SUDOKU_ADD,
    payload: {
      id: uuidv1(),
      name, size, values
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