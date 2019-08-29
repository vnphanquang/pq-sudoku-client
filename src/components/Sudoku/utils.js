export const STYLE_STATES = {
  FOCUSED: 'focused',
  CONFLICTING: 'conflicting',
  SPOTTED: 'spotted',
  LIT: 'lit'
}

export const DIRECTION = {
  ROW: 'row',
  COL: 'col'
};
export const SUBGRID_NUMBERS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8]
];
export const KEYS_STROKES = {
  DELETES: ['Backspace', 'Delete'],
  ARROWS: ['ArrowUp', 'ArrowRight', 'ArrowDown', 'ArrowLeft'],
}
export const VALUES = new Map([
  ['1', '1'],
  ['2', '2'],
  ['3', '3'],
  ['4', '4'],
  ['5', '5'],
  ['6', '6'],
  ['7', '7'],
  ['8', '8'],
  ['9', '9']
]);

export const GRID_SIZE = 9;


export function ValueMap() {
  return new Map([
    ['1', []],
    ['2', []],
    ['3', []],
    ['4', []],
    ['5', []],
    ['6', []],
    ['7', []],
    ['8', []],
    ['9', []]
  ]);
}

export function PencilMap() {
  return new Map([
    ['1', false],
    ['2', false],
    ['3', false],
    ['4', false],
    ['5', false],
    ['6', false],
    ['7', false],
    ['8', false],
    ['9', false]
  ]);
}

export function SubgridMap() {
  return new Map([
    [SUBGRID_NUMBERS[0][0], []],
    [SUBGRID_NUMBERS[0][1], []],
    [SUBGRID_NUMBERS[0][2], []],
    [SUBGRID_NUMBERS[1][0], []],
    [SUBGRID_NUMBERS[1][1], []],
    [SUBGRID_NUMBERS[1][2], []],
    [SUBGRID_NUMBERS[2][0], []],
    [SUBGRID_NUMBERS[2][1], []],
    [SUBGRID_NUMBERS[2][2], []],
  ]);
}