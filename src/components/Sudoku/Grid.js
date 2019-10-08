import React from 'react';
import PropTypes from 'prop-types';

import { styled } from '@material-ui/styles';

import Cell from './Cell';
import { 
  SELECTION, 
  DIRECTION, 
  KEYS_STROKES, valueKeyStrokes,
  SubgridToCellsMap, ValueToCellsMap, ValueMap 
} from '../utils';

class Grid extends React.Component {
  static propTypes = {
    // rows: PropTypes.number.isRequired,
    // cols: PropTypes.number.isRequired,
    size: PropTypes.number.isRequired,
    values: PropTypes.array.isRequired,
    initCellValues: PropTypes.array,
  }

  constructor(props) {
    super(props);
    const {values, size} = this.props;
    // maps
    this.valueToCellsMap = ValueToCellsMap(values);
    this.subgridToCellsMap = SubgridToCellsMap(size);
    this.valueMap = ValueMap(values);

    // conflicts
    this.conflicts = [];

    // selection
    this.selectedCells = [null];
    this.selection = {
      type: SELECTION.TYPES.NONE,
      position: null,
      cells: [],
      focus: null
    }

    // pencil mode
    this.pencilMode = false;

    // event handlers
    this.handleKeyInput = this.handleKeyInput.bind(this);
    this.handleCellClick = this.handleCellClick.bind(this);
    
    // cells
    this.cells = this.initGrid();
    this.mapCellRef = this.mapCellRef.bind(this);

    // exposed globally
    this.focus = this.focus.bind(this);
  }

  initGrid() {
    let cells = [];
    let cellRow;
    for (let row = 0; row < this.props.size; row++) {
      cellRow = [];
      for (let col = 0; col < this.props.size; col++) {
        cellRow.push(null);
      }
      cells.push(cellRow);
    }
    return cells;
  }

  componentDidMount() {
    if (this.props.initCellValues) {
      this.checkConflicts();
    }
  }
  
  shouldComponentUpdate(nextProps) {
    const newValues = nextProps.values;
    const oldValues = this.props.values;
    let newValue, oldValue, cells;
    for (let i = 0; i < newValues.length; i++) {
      newValue = newValues[i];
      oldValue = oldValues[i];
      if (newValue !== oldValue) {
        cells = this.valueToCellsMap.get(oldValue);
        for (const cell of cells) {
          cell.setState({cellValue: newValue});
        }
        this.valueToCellsMap.set(newValue, cells);
        this.valueToCellsMap.delete(oldValue);
        this.valueMap.set(valueKeyStrokes[i], newValue);
      }
    }
    if (this.props.hidden !== nextProps.hidden) {
      return true;
    } else {
      return false;
    }
  }

  render() {
    const { size, initCellValues, hidden } = this.props;
    const cells = [];
    let subgrid;
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        subgrid = Grid.getSubgridNumber(row, col, size);
        cells.push(
          <Cell
            key={`${subgrid}-${row}-${col}`}
            ref={this.mapCellRef}
            gridsize={size}
            row={row} col={col}
            subgrid={subgrid}
            initValue={initCellValues ? initCellValues[row][col] : ''}
            handleCellClick={this.handleCellClick}
          />
        );
      }
    }

    return (
      <StyledGrid hidden={hidden} rows={size} cols={size}>
        {cells}
      </StyledGrid>
    )
  }

  mapCellRef(targetCell) {
    if (targetCell) {
      const { row, col } = targetCell.props;
      this.cells[row][col] = targetCell;
      this.setSubgridToCellsMapping(targetCell);
      if (this.props.initCellValues) {
        const targetValue = this.props.initCellValues[row][col];
        this.setValueToCellsMapping(targetCell, targetValue);
      }
    }
  }
//--------------------------GETTERS & MAPPING------------------------------
//TODO: Condition (targetCell) for all?
  setSubgridToCellsMapping(targetCell) {
      this.getCellsBySubgrid(targetCell.props.subgrid).push(targetCell);
  }

  setValueToCellsMapping(targetCell, targetValue) {
    if (targetValue) {
      this.getCellsByValue(targetValue).push(targetCell);
    }
  }
  removeCellFromValueMap(targetCell, targetValue) {
    let cells = this.getCellsByValue(targetValue);
    cells = cells.filter(cell => !cell.isSameCell(targetCell));
    this.valueToCellsMap.set(targetValue, cells);
  }

  getCellsByValue(value) {
    return this.valueToCellsMap.get(value);
  }

  getCellsBySubgrid(subgrid) {
    return this.subgridToCellsMap.get(subgrid);
  }

  getCell(row, col) {
    return this.cells[row][col];
  }

  getCellValue(targetCell) {
    return targetCell.state.cellValue;
  }
//-------------------------EVENT HANDLERS----------------------------
  handleKeyInput(e) {
    const {ctrlKey, metaKey, shiftKey, key} = e;
    if (!['Control', 'Meta', 'Shift', 'Alt'].includes(key)) {
      if (this.valueMap.has(key)) {
        this.inputCellsValue(key);
      } else if (KEYS_STROKES.ARROWS.includes(key)) {
        this.keyNavigate(e);
      } else if (KEYS_STROKES.DELETES.includes(key)) {
        this.clearCellsValue();
      } else {
        if ((ctrlKey || metaKey) && key === 'a') {
          this.clearSelection();
          this.selectAllCells();
        } else if (shiftKey) {
          switch(key) {
            case 'G':
              if (this.selection.focus) {
                this.clearSelection();
                this.selectCellsBySubgrid(this.selection.focus.props.subgrid);
              }
              break;
            case 'R':
              if (this.selection.focus) {
                this.clearSelection();
                this.selectCellsByIndex(DIRECTION.ROW, this.selection.focus.props.row);
              }
              break;
            case 'C':
              if (this.selection.focus) {
                this.clearSelection();
                this.selectCellsByIndex(DIRECTION.COL, this.selection.focus.props.col);
              }
              break;
            case 'V':
              if (this.selection.focus) {
                const targetValue = this.getCellValue(this.selection.focus);
                if (targetValue) {
                  this.clearSelection();
                  this.selectCellsByValue(this.getCellValue(this.selection.focus));
                }
              }
              break;
            default:
              break;
          }
        }
      }
    }
  }

  handleCellClick(e, targetCell) {
    const { detail=0 } = e;
    switch(detail) {
      case 0:
      case 1: 
        this.select(e, targetCell);
        break;
      case 2:
        this.clearSelection();
        this.selectCellsBySubgrid(targetCell.props.subgrid);
        break;
      case 3:
        this.clearSelection();
        this.selectAllCells();
        break;
      default:
        break;
    }
  }
//-------------------------KEY CELL VALUE INPUT------------------------------
  inputCellsValue(key) {
    const inputValue = this.valueMap.get(key);
    if (this.pencilMode) {
      let oldValue;
      for (const cell of this.selection.cells) {
        oldValue = this.getCellValue(cell);
        if (oldValue) {
          this.removeCellFromValueMap(cell, oldValue);
          if (this.selection.type === SELECTION.TYPES.SINGLE) {
            this.unspotCellsByValue(oldValue);
          }
          this.uncheckConflicts(cell);
        }
        cell.setState(st => ({
          cellValue: '',
          showPencils: true,
          pencils: st.pencils.map((value, index) => {
            if (index === this.props.values.indexOf(inputValue)) {
              return value ? false : inputValue;
            } else {
              return value;
            }
          })
        }));
      }
    } else {
      for (const cell of this.selection.cells) {
        this.updateCellValue(
          cell, 
          inputValue !== this.getCellValue(cell) ? inputValue : ''
        );
      }
    }
    this.focus();
  }
  updateCellValue(targetCell, targetValue) {
    const oldValue = this.getCellValue(targetCell);
    if (targetValue !== oldValue) {
      targetCell.setState({cellValue: targetValue, showPencils: false}, () => {
        if (oldValue) {
          if (this.selection.type === SELECTION.TYPES.SINGLE) {
            this.unspotCellsByValue(oldValue);
          }
          this.uncheckConflicts(targetCell);
          this.removeCellFromValueMap(targetCell, oldValue);
        } 
        if (targetValue) {
          this.setValueToCellsMapping(targetCell, targetValue);
          if (this.selection.type === SELECTION.TYPES.SINGLE) {
            this.spotCellsByValue(targetValue);
          }
          this.checkConflicts(targetCell);
        //TODO: refactors into Cell?
        } else if (targetCell.state.pencils.some(pencil => pencil)) {
          targetCell.setState({showPencils: true});
        }
      })
    }
  }
  updateCellValues(cellValues) {
    const selectionType = this.selection.type;
    this.selection.type = SELECTION.NONE;
    let targetCell, targetValue;
    for (let row = 0; row < this.props.size; row++) {
      for (let col = 0; col < this.props.size; col++) {
        targetCell = this.getCell(row, col);
        targetValue = cellValues[row][col];
        this.updateCellValue(targetCell, targetValue);
      }
    }
    this.selection.type = selectionType;
    if (this.selection.focus) {
      this.singleSelectCell(this.selection.focus);
    }
  }
  clearCellsValue() {
    for (const cell of this.selection.cells) {
      if (this.getCellValue(cell)) {
        this.updateCellValue(cell, '');
      } else {
        cell.setState({
          showPencils: false,
          pencils: (new Array(this.props.size)).fill(false),
        })
      }
    }
    this.focus();
  }
//-------------------------CONFLICTS------------------------------
  checkConflicts(targetCell) {
    const conflicts = [];
    if (targetCell) {
      const {row, col, subgrid} = targetCell.props;
      const cells = this.getCellsByValue(this.getCellValue(targetCell));
      let bitMask;
      for (const cell of cells) {
        bitMask = (
          0 |
          (cell.props.row === row) |
          ((cell.props.col === col) << 1) |
          ((cell.props.subgrid === subgrid) << 2)
        );
        if (bitMask && bitMask !== 7) {
          conflicts.push([
            {row, col},
            {row: cell.props.row, col: cell.props.col}
          ]);
          cell.addConflict(targetCell);
          cell.status = {conflicting: true};
          targetCell.addConflict(cell);
        }
      }
      if (conflicts.length > 0) {
        targetCell.status = {conflicting: true};
      }
    } else {
      let cells;
      let cell;
      for (const value of this.props.values) {
        cells = [...this.valueToCellsMap.get(value)];
        while (cells.length > 0) {
          cell = cells.pop();
          for (const other of cells) {
            if (
              cell.props.row === other.props.row ||
              cell.props.col === other.props.col ||
              cell.props.subgrid === other.props.subgrid
            ) {
              conflicts.push([
                {row: cell.props.row, col: cell.props.col},
                {row: other.props.row, col: other.props.col}
              ]);
              cell.addConflict(other);
              cell.status = {conflicting: true};
              other.addConflict(cell);
              other.status = {conflicting: true};
            }
          }
        }
      }
    }
    this.conflicts.push(...conflicts);
  }
  uncheckConflicts(targetCell) {
    const {row, col} = targetCell.props;
    const matchedCells = [];
    this.conflicts = this.conflicts.filter(([first, second]) => {
      if (first.row === row && first.col === col) {
        matchedCells.push(second);
        return false;
      }
      if (second.row === row && second.col === col) {
        matchedCells.push(first);
        return false;
      }
      return true;
    })
    if (matchedCells.length > 0) {
      for (let cell of matchedCells) {
        cell = this.getCell(cell.row, cell.col);
        cell.removeConflict(targetCell);
        if (cell.conflicts.length === 0) {
          cell.status = {conflicting: false};
        }
      }
      targetCell.status = {conflicting: false};
      targetCell.conflicts = [];
    }
  }

//-------------------------KEY NAVIGATION------------------------------
  keyNavigate(e) {
    e.preventDefault();
    e.stopPropagation();
    const {key, ctrlKey, shiftKey} = e;
    let lastSelectedCell = this.selection.focus;
    if (!lastSelectedCell) lastSelectedCell = this.getCell(0, 0);
    const {row, col} = lastSelectedCell.props;
    let targetCell = null;

    switch(key) {
      case 'ArrowUp': 
        if (row - 1 >= 0) {
          targetCell = this.getCell(row - 1, col);
        }
        break;
      case 'ArrowRight':
        if (col + 1 < this.props.size) {
          targetCell = this.getCell(row, col + 1);
        }
        break;
      case 'ArrowDown':
        if (row + 1 < this.props.size) {
          targetCell = this.getCell(row + 1, col);
        }
        break;
      case 'ArrowLeft':
        if (col - 1 >= 0) {
          targetCell = this.getCell(row, col - 1);
        }
        break;
      default:
        throw new Error(`Unknown KeyDown (${key}) at (${row},${col})`);
    }
    if (targetCell) {
      let isMultiSelection = this.selection.type === SELECTION.TYPES.MULTI;
      if ((ctrlKey|| shiftKey) && isMultiSelection) {
        if (!targetCell.selected) {
          this.selectCell(targetCell);
        }
        this.focusCell(targetCell)
      } else {
        this.handleCellClick(e, targetCell);
      }
    }
  }
//-----------------------SELECTION-----------------------------------
  select(e, targetCell) {
    const { ctrlKey, shiftKey } = e;
    const lastSelectedCell = this.selection.focus;
    if (!lastSelectedCell) {
      this.singleSelectCell(targetCell);
    } else if (!targetCell.isSameCell(lastSelectedCell)) {
      if (this.selection.type === SELECTION.TYPES.SINGLE) {
        if (ctrlKey) {
          this.clearSelection();
          this.selection.type = SELECTION.TYPES.MULTI;
          this.selectCell(lastSelectedCell);
          this.selectCell(targetCell);
          this.focusCell(targetCell);
        } else if (shiftKey) {
          this.clearSelection();
          this.selection.type = SELECTION.TYPES.MULTI;
          this.shiftSelectCells(lastSelectedCell, targetCell);
        } else {
          this.unlitRelatives(lastSelectedCell);
          const lastSelectedValue = this.getCellValue(lastSelectedCell);
          const targetValue = this.getCellValue(targetCell);
          if (lastSelectedValue !== targetValue) {
            this.unspotCellsByValue(lastSelectedValue);
          }
          this.unselectCell(lastSelectedCell);
          this.singleSelectCell(targetCell);
        }
      } else if (this.selection.type === SELECTION.TYPES.MULTI) {
        if (ctrlKey) {
          if (targetCell.selected) {
            this.unselectCell(targetCell);
          } else {
            this.selectCell(targetCell);
            this.focusCell(targetCell);
          }
        } else if (shiftKey) {
          this.clearSelection();
          this.shiftSelectCells(lastSelectedCell, targetCell);
        } else {
          this.clearSelection();
          this.singleSelectCell(targetCell);
        }
      } else {
        this.clearSelection();
        this.singleSelectCell(targetCell);
      }
    } else {
      if (ctrlKey) {
        this.unselectCell(targetCell);
      } else if (shiftKey) {
        this.clearSelection();
        this.singleSelectCell(targetCell);
      }
    }
  }

  selectCell(targetCell) {
    targetCell.status = {selected: true};
    this.selection.cells.push(targetCell);
  }

  unselectCell(targetCell) {
    targetCell.status = {selected: false};
    if (this.selection.type !== SELECTION.TYPES.SINGLE) {
      const selectedCells = this.selection.cells;
      selectedCells.splice(selectedCells.indexOf(targetCell), 1);
      if (selectedCells.length === 1) {
        this.singleSelectCell(selectedCells[0]);
      } else {
        this.focusCell(selectedCells[selectedCells.length - 1]);
      }
    }
  }

  singleSelectCell(targetCell) {
    this.litRelatives(targetCell);
    this.spotCellsByValue(this.getCellValue(targetCell));
    this.selection.cells = [];
    this.selection.type = SELECTION.TYPES.SINGLE;
    this.selection.position = null;
    this.selectCell(targetCell);
    this.focusCell(targetCell);
  }

  selectCellsByIndex(direction, targetIndex) {
    const selectionType = SELECTION.TYPES[direction.toUpperCase()];
    if (this.selection.type === selectionType && this.selection.position === targetIndex) {
      this.singleSelectCell(this.selection.focus);
    } else {
      this.selection.type = selectionType
      this.selection.position = targetIndex;
      this.onCellsByIndex(direction, targetIndex, this.selectCell.bind(this));
      this.focusCell(this.selection.focus);
    }
  }

  selectCellsByValue(targetValue) {
    if (this.selection.type === SELECTION.TYPES.VALUE && this.selection.position === targetValue) {
      this.singleSelectCell(this.selection.focus);
    } else if (targetValue) {
      this.selection.type = SELECTION.TYPES.VALUE;
      this.selection.position = targetValue;
      this.onCellsByValue(targetValue, this.selectCell.bind(this));
      this.focusCell(this.selection.focus);
    }
  }

  selectCellsBySubgrid(targetSubgrid) {
    if (this.selection.type === SELECTION.TYPES.SUBGRID && this.selection.position === targetSubgrid) {
      this.singleSelectCell(this.selection.focus);
    } else {
      this.selection.type = SELECTION.TYPES.SUBGRID;
      this.selection.position = targetSubgrid;
      this.onCellsBySubgrid(targetSubgrid, this.selectCell.bind(this));
      this.focusCell(this.selection.focus);
    }
  }

  selectAllCells() {
    if (this.selection.type === SELECTION.TYPES.ALL) {
      this.singleSelectCell(this.selection.focus);
    } else {
      this.selection.type = SELECTION.TYPES.ALL;
      this.selection.position = null;
      for (let row = 0; row < this.props.size; row++) {
        for (let col = 0; col < this.props.size; col++) {
          this.selectCell(this.getCell(row, col));
        }
      }
      this.focusCell(this.selection.focus);
    }
  }

  shiftSelectCells(originCell, targetCell) {
    let {row: originRow, col: originCol} = originCell.props;
    let {row: targetRow, col: targetCol} = targetCell.props;
    let rowIncrement = (originRow <= targetRow) ? 1 : -1;
    let colIncrement = (originCol <= targetCol) ? 1 : -1;
    targetRow += rowIncrement;
    targetCol += colIncrement;
    for (let row = originRow; row !== targetRow; row += rowIncrement) {
      for (let col = originCol; col !== targetCol; col += colIncrement) {
        this.selectCell(this.getCell(row, col));
      }
    }
    this.focusCell(originCell);
  }

  clearSelection() {
    const lastSelectedCell = this.selection.focus;
    if (this.selection.type !== SELECTION.TYPES.SINGLE) {
      for (const cell of this.selection.cells) {
        cell.status = {selected: false};
      }
    } else if (lastSelectedCell) {
      this.unselectCell(lastSelectedCell);
      this.unlitRelatives(lastSelectedCell);
      this.unspotCellsByValue(this.getCellValue(lastSelectedCell));
    }
    this.selection.cells = [];
  }
//--------------------------RELATIVES---------------------------------------
  litRelatives(targetCell) {
    this.onRelatives(targetCell, (cell) => cell.status = {lit: true});
  }
  unlitRelatives(targetCell) {
    this.onRelatives(targetCell, (cell) => cell.status = {lit: false});
  }
  onRelatives(targetCell, callback) {
    this.onCellsByIndex(DIRECTION.ROW, targetCell.props.row, callback);
    this.onCellsByIndex(DIRECTION.COL, targetCell.props.col, callback);
    this.onCellsBySubgrid(targetCell.props.subgrid, callback)
  }
  onCellsByIndex(direction, index, callback) {
    const coor = {
      row: index,
      col: index
    }
    let cursor = (direction === DIRECTION.ROW) ? DIRECTION.COL : DIRECTION.ROW;
    for (coor[cursor] = 0; coor[cursor] < this.props.size; coor[cursor]++) {
      callback(this.getCell(coor.row, coor.col));
    }
  }
  onCellsBySubgrid(targetSubgrid, callback) {
    if (targetSubgrid) {
      this.getCellsBySubgrid(targetSubgrid).forEach(callback);
    }
  }
//-----------------------------SPOTTING----------------------------------
  spotCellsByValue(targetValue) {
    if (targetValue) {
      this.onCellsByValue(targetValue, (cell) => cell.status = {spotted: true});
    }
  }
  unspotCellsByValue(targetValue) {
    if (targetValue) {
      this.onCellsByValue(targetValue, (cell) => cell.status = {spotted: false});
    }
  }
  onCellsByValue(targetValue, callback) {
    if (targetValue) {
      this.getCellsByValue(targetValue).forEach(callback);
    }
  }
//---------------------------FOCUS-------------------------------------
  focusCell(targetCell) {
    if (targetCell.isSameCell(this.selection.focus)) {
      targetCell.input.focus();
    } else {
      if(this.selection.focus) {
        this.selection.focus.status = {focused: false};
      }
      this.selection.focus = targetCell;
      targetCell.status = {focused: true};
      targetCell.input.focus();
    }
  }
//-------------------------------------------------------------------
  static getSubgridNumber(row, col, gridSize) {
    const subgridSize = Math.sqrt(gridSize);
    const [subgridRow, subgridCol] = [Math.floor(row/subgridSize), Math.floor(col/subgridSize)];
    return subgridRow + subgridCol * subgridSize;
  }

  togglePencilMode(state) {
    if (state !== undefined) {
      this.pencilMode = state;
    } else {
      this.pencilMode = !this.pencilMode;
    }
  }
//-------------------------------------------------------------------
  focus() {
    if (this.selection.focus) {
      this.selection.focus.input.focus();
    } else {
      const center = parseInt(this.props.size / 2);
      this.singleSelectCell(this.getCell(center, center));
    }
  }

  getCellValues() {
    return this.cells.map(cellRow => cellRow.map(cell => this.getCellValue(cell)));
  }

  getCellsData() {
    const data = [];
    for (const cellRow of this.cells) {
      for (const cell of cellRow) {
        const {row, col, subgrid} = cell.props;
        data.push({
          value: this.getCellValue(cell),
          row, col, subgrid,
        })
      }
    }
    return data;
  }

}

export default Grid;


export const StyledGrid = styled(({...props}) => <div {...props} />)(
  ({hidden, theme, rows, cols}) => ({
    width: '100%',
    height: '100%',
    gridArea: 'sudoku-grid',
    display: hidden ? 'none' : 'grid',
    justifyContent: 'center',
    gridTemplateColumns: `repeat(${cols}, 1fr)`,
    gridTemplateRows: `repeat(${rows}, 1fr)`,
    gridGap: '1px 1px',
    backgroundColor: theme.sudoku.color[theme.palette.type],
    border: '4px solid',
    borderRadius: '3px',
    boxShadow: `1px 1px 6px ${theme.sudoku.shadow[theme.palette.type]}`,
  })
)