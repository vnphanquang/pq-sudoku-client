export const EXPANDED_DRAWER_WIDTH = 200;
export const APPBAR_HEIGHT = 64;
export const COLLAPSED_DRAWER_WIDTH = 70;

export const DIRECTION = {
  ROW: 'row',
  COL: 'col'
};

export const SELECTION = {
  TYPES: {
    SINGLE: 'single',
    MULTI: 'multiple',
    ALL: 'all',
    SUBGRID: 'subgrid',
    VALUE: 'value',
    ROW: DIRECTION.ROW,
    COL: DIRECTION.COL,
    NONE: 'none',
  }
}

export const KEYS_STROKES = {
  DELETES: ['Backspace', 'Delete'],
  ARROWS: ['ArrowUp', 'ArrowRight', 'ArrowDown', 'ArrowLeft'],
}

export const CLIENT_SOURCE_LINK = 'https://github.com/vnphanquang/pq-sudoku-client';


export function mixColors(...colors) {
  let rgb = '#';
  let sum;
  const factorSum = colors.reduce((acc, [color, factor]) => acc + factor, 0);
  for (let i = 1; i <= 5; i += 2) {
    sum = colors.reduce((acc, [color, factor]) => (
      acc + parseInt(color.substring(i, i + 2), 16) * factor
    ), 0);
    // console.log(sum);
    rgb += Math.floor(sum / factorSum).toString(16);
  }
  return rgb;
}

export function SubgridToCellsMap(gridSize) {
  const entries = [];
  for (let i = 0; i < gridSize; i++) {
    entries.push([i, []]);
  }
  return new Map(entries);
}

export function ValueToCellsMap(values) {
  const entries = [];
  for (let i = 0; i < values.length; i++) {
    entries.push([values[i], []]);
  }
  return new Map(entries);
}

export const valueKeyStrokes = [
  '1', '2', '3', '4', '5', '6', '7', '8', '9', 
  'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i',
  'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r'
]

export function ValueMap(values) {
  const entries = [];
  for (let i = 0; i < values.length; i++) {
    entries.push([valueKeyStrokes[i], values[i]]);
  }
  return new Map(entries);
}