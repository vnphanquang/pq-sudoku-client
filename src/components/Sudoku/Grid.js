import React from 'react';
import {SELECTION, KEYS_STROKES, DIRECTION, STYLE_STATES} from '../utils';
import Cell from './Cell';
import {styled} from '@material-ui/styles';

function SubgridToCellsMap(gridSize) {
  const entries = [];
  for (let i = 0; i < gridSize; i++) {
    entries.push([i, []]);
  }
  return new Map(entries);
}

function ValueToCellsMap(values) {
  const entries = [];
  for (let i = 0; i < values.length; i++) {
    entries.push([values[i], []])
  }
  return new Map(entries);
}

function ValueMap(values) {
  const entries = [];
  for (let i = 0; i < values.length; i++) {
    entries.push([i+1, values[i]])
  }
  return new Map(entries);
}

class Grid extends React.PureComponent {
  constructor(props) {
    super(props);

    this.valueToCellsMap = ValueToCellsMap(this.props.values);
    this.subgridToCellsMap = SubgridToCellsMap(this.props.size);
    this.valueMap = ValueMap(this.props.values);
    this.conflictCells = [];
    this.selectedCells = [null];
    this.selection = {
      type: SELECTION.TYPES.SINGLE,
      position: null,
      cells: [],
      focus: null
    }
    this.pencilMode = false;

    // Input & Navigation
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleCellSelection = this.handleCellSelection.bind(this);
    this.mapCellRef = this.mapCellRef.bind(this);
    this.focus = this.focus.bind(this);
    this.isFocused = this.isFocused.bind(this);
    
    this.cells = this.initGrid();
  }

  initGrid() {
    let refs = [];
    let cellRow, cell;
    for (let row = 0; row < this.props.size; row++) {
      cellRow = [];
      for (let col = 0; col < this.props.size; col++) {
        cell = null;
        cellRow.push(cell);
      }
      refs.push(cellRow);
    }
    return refs;
  }

  mapCellRef(targetCell) {
    if (targetCell) {
      let {row, col} = targetCell.props;
      this.cells[row][col] = targetCell;
      this.setSubgridToCellsMapping(targetCell);
    }
  }

  updateCellValue(targetCell, newValue) {
    let oldValue = this.getCellValue(targetCell);
    if (newValue !== oldValue) {
      targetCell.setState({cellValue: newValue}, () => {
        if (oldValue !== '') {
          this.removeCellFromValueMap(targetCell, oldValue);
          if (this.selection.type === SELECTION.TYPES.SINGLE) {
            this.unspotMatchedCells(oldValue);
            this.uncheckConflicts(targetCell);
          }
        }  
        if (newValue !== '') {
          this.setValueToCellsMapping(targetCell, newValue);
          if (this.selection.type === SELECTION.TYPES.SINGLE) {
            this.spotMatchedCellsAndConflicts(targetCell);
          }
        }
      });  
    }
  }

  handleKeyPress(e, targetCell) {
    let {ctrlKey, key} = e
    let numKey = parseInt(key);
    if (this.valueMap.has(numKey)) {
      let inputValue = this.valueMap.get(numKey);
      if (this.pencilMode) {
        this.selection.cells.forEach(cell => {
          cell.setState((st) => ({
            cellValue: '',
            // pencilMap: st.pencilMap.set(key, st.pencilMap.get(key) ? false : inputValue)
            pencils: st.pencils.map((value, index) => {
              if (index + 1 === numKey) {
                return value ? false : inputValue;
              } else {
                return value;
              }
            })
          }))
        })
      } else {
        this.selection.cells.forEach(cell => {
          this.updateCellValue(cell, inputValue !== cell.state.cellValue ? inputValue : '');
        })

      }
    } else if (KEYS_STROKES.ARROWS.includes(key)) {
      this.keyNavigate(e);
    } else if (KEYS_STROKES.DELETES.includes(key)) {
      if (this.pencilMode) {
        this.selection.cells.forEach(cell => {
          cell.setState({pencils: new Array(this.props.size).fill(false)});
        })
      } else {
        this.selection.cells.forEach(cell => {
          if (cell.state.cellValue !== '') {
            this.updateCellValue(cell, '');
          }
        })
      }
    } else if (ctrlKey) {
      switch(key) {
        case 'a':
          e.preventDefault();
          this.selectAll();
          break;
        case 'z':
          //TODO: implement undo
          break;
        case 'y':
          //TODO: implement redo
          break;
        case 'g':
          e.preventDefault();
          this.selectCellsBySubgrid(targetCell.props.subgrid);
          break;
        case 'q':
          e.preventDefault();
          this.handleCellSelectionByIndex({shiftKey: false, ctrlKey: false}, targetCell.props.row, DIRECTION.ROW);
          break;
        case 'f':
          e.preventDefault();
          this.handleCellSelectionByIndex({shiftKey: false, ctrlKey: false}, targetCell.props.col, DIRECTION.COL);
          break;
        default:
          break;
      }
    }
  }

  handleCellSelection({ctrlKey, shiftKey}, targetCell) {
    let lastSelectedCell = this.selection.focus;
    if (this.selection.type === SELECTION.TYPES.SINGLE) {
      if (ctrlKey && lastSelectedCell && !targetCell.isSameCell(lastSelectedCell)) {
        this.clearSelection();
        this.selectCell(lastSelectedCell);
        this.selection.type = SELECTION.TYPES.MULTI;
        this.selectCell(targetCell);
        this.focusCell(targetCell);
        targetCell.input.focus();
      } else if (shiftKey && lastSelectedCell && !targetCell.isSameCell(lastSelectedCell)) {
        this.clearSelection();
        this.selection.type = SELECTION.TYPES.MULTI;
        this.shiftSelectCell(lastSelectedCell, targetCell);
        lastSelectedCell.input.focus();
      } else {
        if (!targetCell.isSameCell(lastSelectedCell)) {
          if (lastSelectedCell) {
            this.clearCellStyle(lastSelectedCell);
            this.unlitRelatives(lastSelectedCell);
            let lastSelectedValue = this.getCellValue(lastSelectedCell);
            let targetValue = this.getCellValue(targetCell);
            if (lastSelectedValue !== '') {
              this.uncheckConflicts(targetCell);
              if (targetValue !== lastSelectedValue) {
                this.unspotMatchedCells(lastSelectedValue);
              }
            }
          }
          this.singleSelectCell(targetCell);
        } else {
          lastSelectedCell.input.focus();
        }
      }
    } else if (this.selection.type === SELECTION.TYPES.MULTI) {
      if (ctrlKey) {
        if (targetCell.isSelected()) {
          this.unselectCell(targetCell);
        } else {
          this.selectCell(targetCell);
          this.focusCell(targetCell);
          targetCell.input.focus();
        }
      } else if (shiftKey &&  !targetCell.isSameCell(lastSelectedCell)) {
        this.clearSelection();
        this.shiftSelectCell(lastSelectedCell, targetCell);
        lastSelectedCell.input.focus();
      } else {
        this.selection.cells.forEach(cell => {
          this.clearCellStyle(cell);
        })
        this.singleSelectCell(targetCell);  
      }
    } else {
      this.selection.cells.forEach(cell => {
        this.clearCellStyle(cell);
      })
      this.singleSelectCell(targetCell);
    }
  }

  handleCellSelectionByIndex({shiftKey, ctrlKey}, targetIndex, direction) {
    if (this.selection.type !== direction){
      this.clearSelection();
      this.selection.type = SELECTION.TYPES[direction.toUpperCase()];
      this.selection.position = targetIndex;
      this.selectCellsByIndex(targetIndex, direction);
    } else if (ctrlKey) {
      let row = targetIndex;
        let col = targetIndex;
        if (direction === DIRECTION.ROW) {
          col = 0;
        } else {
          row = 0;
        }
        if (!this.getCell(row, col).isSelected()) {
          this.selectCellsByIndex(targetIndex, direction);
          this.selection.position = targetIndex;
        } else {
          this.unselectCellsByIndex(targetIndex, direction);
        }
    } else if (shiftKey) {
      this.clearSelection();
      let increment = (targetIndex > this.selection.position) ? 1 : -1
      targetIndex += increment;
      let i = this.selection.position; 
      do {
        this.selectCellsByIndex(i, direction);
        i += increment;
      } while (i !== targetIndex);
      this.selection.position = targetIndex - increment;
    } else {
      this.clearSelection();
      this.selection.position = targetIndex;
      this.selectCellsByIndex(targetIndex, direction);
    }
  }

  selectCellsByIndex(targetIndex, direction) {
    let coor = {
      row: targetIndex,
      col: targetIndex
    }
    let cursor = (direction === DIRECTION.ROW) ? DIRECTION.COL : DIRECTION.ROW;
    for (coor[cursor] = 0; coor[cursor] < this.props.size; coor[cursor]++) {
      this.selectCell(this.getCell(coor.row, coor.col));
    }
    let selectedCell = this.selection.focus;
    selectedCell = (selectedCell) ? selectedCell : this.selection.cells[0];
    selectedCell.input.focus();
  }
  
// TODO: Selection methods ==> return false/true or selected/unselected cells
  singleSelectCell(targetCell) {
    this.litRelatives(targetCell);
    this.spotMatchedCellsAndConflicts(targetCell);
    this.selection.cells = [];
    this.selection.type = SELECTION.TYPES.SINGLE;
    this.selection.position = null;
    this.selectCell(targetCell);
    this.focusCell(targetCell);
    targetCell.input.focus();
  }

  shiftSelectCell(originCell, targetCell) {
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
  }

  selectCell(targetCell) {
    this.setCellStyle(targetCell, STYLE_STATES.SELECTED);
    this.selection.cells.push(targetCell);
  }

  unselectCell(targetCell) {
    let selectedCells = this.selection.cells;
    this.clearCellStyle(targetCell);
    selectedCells.splice(selectedCells.indexOf(targetCell), 1)
    if (selectedCells.length === 0) {
      this.selection.type = SELECTION.TYPES.SINGLE;
      this.selection.cells = [];
      this.selection.position = null;
      this.selection.focus = null;
    } else {
      let lastSelected = selectedCells[selectedCells.length - 1];
      this.focusCell(lastSelected);
      lastSelected.input.focus();
    }
  }

  selectCellsBySubgrid(subgrid) {
    if (this.selection.type !== SELECTION.TYPES.SUBGRID) {
      this.clearSelection();
      this.selection.type = SELECTION.TYPES.SUBGRID;
      this.selection.position = subgrid;
      this.getCellsBySubgrid(subgrid).forEach(cell => this.selectCell(cell));
      this.selection.focus.input.focus();
    } else {
      this.handleCellSelection({ctrlKey: false, shiftKey: false}, this.selection.focus);
    }
  }

  unselectCellsByIndex(targetIndex, direction) {
    if (this.selection.type !== direction) return false;
    let cursor = (direction === DIRECTION.ROW) ? DIRECTION.ROW : DIRECTION.COL;
    let selectedCells = this.selection.cells;
    for (let i = 0; i < selectedCells.length; i += this.props.size) {
      if (selectedCells[i].props[cursor] === targetIndex) {
        selectedCells.splice(i, this.props.size).forEach(cell => {
          this.clearCellStyle(cell);
        });
        if (selectedCells.length === 0) {
          if (this.selection.focus) {
            this.handleCellSelection({ctrlKey: false, shiftKey: false}, this.selection.focus);
          } else {
            this.selection.type = SELECTION.TYPES.SINGLE;
            this.selection.cells = [];
            this.selection.position = null;
          }
        }
        return true;
      }
    }
    return false;
  }

  selectAll() {
    this.clearSelection();
    this.selection.type = SELECTION.TYPES.MULTI;
    this.selection.position = null;
    for (let row = 0; row < this.props.size; row++) {
      for (let col = 0; col < this.props.size; col++) {
        this.selectCell(this.getCell(row, col));
      }
    }
    this.selection.focus.input.focus();
  }

  clearSelection() {
    let lastSelectedCell = this.selection.focus;
    if (this.selection.type !== SELECTION.TYPES.SINGLE) {
      this.selection.cells.forEach(cell => {
        this.clearCellStyle(cell);
      })
    } else if (lastSelectedCell) {
      this.unlitRelatives(lastSelectedCell);
      let lastSelectedValue = this.getCellValue(lastSelectedCell);
      if (lastSelectedValue !== '') {
        this.uncheckConflicts();
        this.unspotMatchedCells(lastSelectedValue);
      }
    }
    this.selection.cells = [];
    // this.selection.type = SELECTION.TYPES.SINGLE;
    // this.selection.position = null;
  }

  keyNavigate(e) {
    let {key, ctrlKey, shiftKey} = e
    let targetCell = null;
    let lastSelectedCell = this.selection.focus;
    let {row, col} = lastSelectedCell.props;

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
      if ((ctrlKey || shiftKey) && isMultiSelection) {
        if (!targetCell.isSelected()) {
          this.selectCell(targetCell);
        }
        this.focusCell(targetCell)
        targetCell.input.focus();
      } else {
        this.handleCellSelection({ctrlKey, shiftKey}, targetCell);
      }
    }
  }

  litRelatives(targetCell) {
    this.litRelativeDir(targetCell, DIRECTION.ROW);
    this.litRelativeDir(targetCell, DIRECTION.COL);
    this.litRelativeSubgrid(targetCell);
    this.clearCellStyle(targetCell);
  }

  unlitRelatives(targetCell) {
    this.unlitRelativeDir(targetCell, DIRECTION.ROW);
    this.unlitRelativeDir(targetCell, DIRECTION.COL);
    this.unlitRelativeSubgrid(targetCell);
  }

  litRelativeDir(targetCell, direction) {
    let coor = {
      row: targetCell.props.row,
      col: targetCell.props.col
    }
    let cursor = (direction === DIRECTION.ROW) ? DIRECTION.COL : DIRECTION.ROW;

    let cell;
    for (coor[cursor] = 0; coor[cursor] < this.props.size; coor[cursor]++) {
      cell = this.getCell(coor.row, coor.col);
      this.setCellStyle(cell, STYLE_STATES.LIT);
    }
  }

  unlitRelativeDir(targetCell, direction) {
    let coor = {
      row: targetCell.props.row,
      col: targetCell.props.col
    }
    let cursor = (direction === DIRECTION.ROW) ? DIRECTION.COL : DIRECTION.ROW;

    let cell;
    for (coor[cursor] = 0; coor[cursor] < this.props.size; coor[cursor]++) {
      cell = this.getCell(coor.row, coor.col);
      this.clearCellStyle(cell); 
    }
  }

  litRelativeSubgrid(targetCell) {
    let cells = this.getCellsBySubgrid(targetCell.props.subgrid);
    cells.forEach((cell) => {
      this.setCellStyle(cell, STYLE_STATES.LIT);
    })
  }

  unlitRelativeSubgrid(targetCell) {
    let cells = this.getCellsBySubgrid(targetCell.props.subgrid);
    cells.forEach((cell) => {
      this.clearCellStyle(cell);
    })
  }

  spotMatchedCellsAndConflicts(targetCell) {
    let targetValue = this.getCellValue(targetCell);
    if (targetValue !== '') {
      let cells = this.getCellsByValue(targetValue);
      if (cells.length !== 0) {
        let {conflicts, otherMatches} = this.checkConflicts(targetCell, targetValue);
        if (conflicts) {
          this.conflictCells = conflicts;
          conflicts.forEach((cell) => this.setCellStyle(cell, STYLE_STATES.CONFLICTING));
        }
        if (otherMatches) {
          otherMatches.forEach((cell) => this.setCellStyle(cell, STYLE_STATES.SPOTTED));
        }
      }
    }
  }

  spotMatchedCells(targetValue) {
    if (targetValue !== '') {
      this.clearSelection();
      let cells = this.getCellsByValue(targetValue);
      cells.forEach((cell) => this.setCellStyle(cell, STYLE_STATES.SPOTTED));
      if (this.selection.focus) {
        this.setCellStyle(this.selection.focus, STYLE_STATES.SELECTED);
        this.selection.focus.input.focus();
      }
    }
  }

  checkConflicts(targetCell, targetValue) {
    let {row, col, subgrid} = targetCell.props;
    let isConflicting;
    let isSelf;
    let matchedCells = this.getCellsByValue(targetValue);
    let conflicts = [];
    let otherMatches = [];
    targetValue = (targetValue !== undefined) ? targetValue : this.getCellValue(targetCell);
    matchedCells.forEach((cell) => {
      isConflicting = (cell.props.row === row) || (cell.props.col === col || cell.props.subgrid === subgrid);
      isSelf = cell.isSameCell(targetCell);
      if (!isSelf) {
        if (isConflicting) conflicts.push(cell);
        else otherMatches.push(cell);
      }
    })
    conflicts = (conflicts.length !== 0) ? conflicts : null;
    otherMatches = (otherMatches.length !== 0) ? otherMatches : null;
    return {conflicts, otherMatches};
  }

  uncheckConflicts(relativeCell) {
    let cell, row, col, subgroup;
    if (relativeCell !== undefined) {
      row = relativeCell.props.row;
      col = relativeCell.props.col;
      subgroup = relativeCell.props.subgrid;
    } else {
      row = null;
      col = null;
      subgroup = null;
    }
    while (this.conflictCells.length !== 0) {
      cell = this.conflictCells.pop();
      if (cell.props.row === row || cell.props.col === col || cell.props.subgrid === subgroup) {
        this.setCellStyle(cell, STYLE_STATES.LIT);
      } else {
        this.clearCellStyle(cell);
      }
    }
  }

  unspotMatchedCells(targetValue) {
    this.getCellsByValue(targetValue).forEach((cell) => {
      this.clearCellStyle(cell);
    })
  }

  focusCell(targetCell) {
    if (this.selection.focus) {
      this.selection.focus.setState({focused: false});
    }
    this.selection.focus = targetCell;
    targetCell.setState({focused: true});
  }

  focus() {
    if (this.selection.focus) {
      this.selection.focus.input.focus();
    } else {
      let center = parseInt(this.props.size / 2);
      let cell = this.getCell(center, center)
      this.handleCellSelection({ctrlKey: false, shiftKey: false}, cell);
    }
  }
  isFocused() {
    if (this.selection.focus) {
      return document.activeElement.isSameNode(this.selection.focus.input);
    } else
      return false;
  }

  setCellStyle(targetCell, styleState) {
    // if (targetCell.state.styleState !== styleState)
    targetCell.setState({styleState});
  }

  clearCellStyle(targetCell) {
    targetCell.setState({styleState: null})
  }

  getCell(row, col) {
    return this.cells[row][col];
  }

  getCellValue(targetCell) {
    return targetCell.state.cellValue;
  }

  getCellsByValue(targetValue) {
    return this.valueToCellsMap.get(`${targetValue}`)
  }

  removeCellFromValueMap(targetCell, targetValue) {
    let isSelf;
    let cells = this.getCellsByValue(targetValue);
    cells = cells.filter((cell) => {
      isSelf = cell.isSameCell(targetCell);
      return !isSelf;
    });
    this.valueToCellsMap.set(`${targetValue}`, cells);
  }

  setValueToCellsMapping(targetCell, targetValue) {
    this.getCellsByValue(targetValue).push(targetCell);
  }

  getCellsBySubgrid(subgrid) {
    return this.subgridToCellsMap.get(subgrid);
  }
  
  setSubgridToCellsMapping(targetCell) {
    this.getCellsBySubgrid(targetCell.props.subgrid).push(targetCell);
  }

  getCellValues() {
    return this.cells.map(cellRow => cellRow.map(cell => this.getCellValue(cell)));
  }
  
  setCellValues(values) {
    let cell, value;
    for (let row = 0; row < this.props.size; row++) {
      for (let col = 0; col < this.props.size; col++) {
        cell = this.getCell(row, col);
        value = values[row][col];
        if (value !== '') {
          cell.setState({cellValue: value});
          this.setValueToCellsMapping(cell, value);
        }
      }
    }
  }

  static getSubgridNumber(row, col, gridSize) {
    const subgridSize = Math.sqrt(gridSize);
    const [subgridRow, subgridCol] = [Math.floor(row/subgridSize), Math.floor(col/subgridSize)];
    return subgridRow + subgridCol * subgridSize;
  }

  togglePencilMode() {
    this.pencilMode = !this.pencilMode;
  }

  render() {
    // console.log('Grid rendered!');
    let size = this.props.size;
    let cells = [];
    let subgrid;
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        subgrid = Grid.getSubgridNumber(row, col, size);
        cells.push(
          <Cell
            gridsize={this.props.size}
            ref={this.mapCellRef}
            key={`${row}-${col}`}
            row={row} col={col}
            subgrid={subgrid}
            handleCellSelection={this.handleCellSelection}
            handleKeyPress={this.handleKeyPress}
          />
        );
      }
    }
    
    return  (
      <StyledGrid rows={this.props.size} cols={this.props.size}>
        {cells}
      </StyledGrid>
    )
  }
}

export const StyledGrid = styled(({...props}) => <div {...props} />)(
  ({theme, rows, cols}) => ({
    width: '100%',
    height: '100%',
    gridArea: 'sudoku-grid',
    display: 'grid',
    justifyContent: 'center',
    gridTemplateColumns: `repeat(${cols}, 1fr)`,
    gridTemplateRows: `repeat(${rows}, 1fr)`,
    gridGap: '1px 1px',
    backgroundColor: `${theme.sudoku.color[theme.palette.type]}`,
    border: '4px solid',
    borderRadius: '3px',
    boxShadow: `1px 1px 6px ${theme.sudoku.shadow[theme.palette.type]}`,
  })
)


export default Grid;