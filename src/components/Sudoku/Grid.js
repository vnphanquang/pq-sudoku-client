import React from 'react';
import {PencilMap, SELECTION, VALUES, KEYS_STROKES, DIRECTION, STYLE_STATES, SUBGRID_NUMBERS, GRID_SIZE, SubgridMap, ValueMap} from '../utils';
import Cell from './Cell';
import {styled} from '@material-ui/styles'

class Grid extends React.PureComponent {
  constructor(props) {
    super(props);

    this.cellValueMap = ValueMap();
    this.subgridMap = SubgridMap();
    this.conflictCells = [];
    this.selectedCells = [null];
    this.selection = {
      type: SELECTION.TYPES.SINGLE,
      position: null,
      cells: [],
      focus: null
    }
    // this.state = {
    //   isCompleted: false,
    // }
    this.pencilMode = false;

    // Input & Navigation
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleCellSelection = this.handleCellSelection.bind(this);
    this.mapCellRef = this.mapCellRef.bind(this);
    this.focus = this.focus.bind(this);
    this.isFocused = this.isFocused.bind(this);
    
    // JSON handling
    // this.getJSONValues = this.getJSONValues.bind(this);
    // this.setValuesFromJSON = this.setValuesFromJSON.bind(this);
    
    // Play Mode Specifics
    // this.getGameValue = this.getGameValue.bind(this);
    // this.checkGameCompletion = this.checkGameCompletion.bind(this);
    this.cells = this.initGrid();
  }

  initGrid() {
    let refs = [];
    let cellRow, cell;
    // let gameValue;
    for (let row = 0; row < GRID_SIZE; row++) {
      cellRow = [];
      // if (flag === 'random') {
      //   gameValue = `${Math.floor(Math.random() * GRID_SIZE) + 1}`;
      // } else if (flag === 'blank') {
      //   gameValue = ''
      // }
      for (let col = 0; col < GRID_SIZE; col++) {
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
      // let targetValue = this.getGameValue(row, col);
      this.cells[row][col] = targetCell;
      // if (targetValue !== '') {
      //   this.setCellValueMapping(targetCell, targetValue);
      // }
      this.setSubgridMapping(targetCell);
    }
  }

  updateCellValue(targetCell, newValue) {
    let oldValue = this.getCellValue(targetCell);
    if (newValue !== oldValue) {
      targetCell.setState({cellValue: newValue}, () => {
        if (oldValue !== '') {
          this.removeCellValueMapping(targetCell, oldValue);
          // if (this.selectedCells.length === 1) {
          if (this.selection.type === SELECTION.TYPES.SINGLE) {
            this.unspotMatchedCells(oldValue);
            this.uncheckConflicts(targetCell);
          }
        }  
        if (newValue !== '') {
          this.setCellValueMapping(targetCell, newValue);
          // if (this.selectedCells.length === 1) {
          if (this.selection.type === SELECTION.TYPES.SINGLE) {
            this.spotMatchedCellsAndConflicts(targetCell);
          }
        }
      });  
    }
  }

  handleKeyPress(e, targetCell) {
    let {ctrlKey, shiftkey, altKey, key} = e
    if (VALUES.has(key)) {
      if (this.pencilMode) {
        targetCell.setState((st) => {
          st.cellValue = '';
          st.pencils.set(key, !st.pencils.get(key));
          return st;
        })
      } else {
        let inputValue = VALUES.get(key);
        this.selection.cells.forEach(cell => {
          if (inputValue !== cell.state.cellValue) {
            this.updateCellValue(cell, inputValue); 
            // cell.setState({cellValue: VALUES.get(key), pencils: PencilMap()});
          } else {
            this.updateCellValue(cell, '');
          }
        })

      }
    } else if (KEYS_STROKES.ARROWS.includes(key)) {
      this.keyNavigate(e);
    } else if (KEYS_STROKES.DELETES.includes(key)) {
      if (this.pencilMode) {
        targetCell.setState({pencils: PencilMap()});
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
    for (coor[cursor] = 0; coor[cursor] < GRID_SIZE; coor[cursor]++) {
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
    for (let i = 0; i < selectedCells.length; i += GRID_SIZE) {
      if (selectedCells[i].props[cursor] === targetIndex) {
        selectedCells.splice(i, GRID_SIZE).forEach(cell => {
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
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
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
        if (col + 1 < GRID_SIZE) {
          targetCell = this.getCell(row, col + 1);
        }
        break;
      case 'ArrowDown':
        if (row + 1 < GRID_SIZE) {
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
    for (coor[cursor] = 0; coor[cursor] < GRID_SIZE; coor[cursor]++) {
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
    for (coor[cursor] = 0; coor[cursor] < GRID_SIZE; coor[cursor]++) {
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
      let center = parseInt(GRID_SIZE / 2);
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

  // getGameValue(row, col) {
  //   return this.cells[row][col].gameValue;
  // }

  // setGameValue(row, col, targetValue) {
  //   this.cells[row][col].gameValue = targetValue;
  // }

  // isCorrectValue(targetCell) {
  //   let cellValue = this.getCellValue(targetCell);
  //   let gameValue = this.getGameValue(targetCell.props.row, targetCell.props.col);
  //   return cellValue === gameValue;
  // }

  getCell(row, col) {
    return this.cells[row][col];
  }

  getCellValue(targetCell) {
    return targetCell.state.cellValue;
  }

  getCellsByValue(targetValue) {
    return this.cellValueMap.get(`${targetValue}`)
  }

  removeCellValueMapping(targetCell, targetValue) {
    let isSelf;
    let cells = this.getCellsByValue(targetValue);
    cells = cells.filter((cell) => {
      isSelf = cell.isSameCell(targetCell);
      return !isSelf;
    });
    this.cellValueMap.set(`${targetValue}`, cells);
  }

  setCellValueMapping(targetCell, targetValue) {
    this.getCellsByValue(targetValue).push(targetCell);
  }

  getCellsBySubgrid(subgrid) {
    return this.subgridMap.get(subgrid);
  }
  
  setSubgridMapping(targetCell) {
    this.getCellsBySubgrid(targetCell.props.subgrid).push(targetCell);
  }

  getCellValues() {
    return this.cells.map(cellRow => cellRow.map(cell => this.getCellValue(cell)));
  }

  static getSubgridNumber(row, col) {
    return SUBGRID_NUMBERS[Math.floor(row/3)][Math.floor(col/3)];
  }

  togglePencilMode() {
    this.pencilMode = !this.pencilMode;
  }

  render() {
    console.log('Grid rendered!');

    let cells = [];
    let subgrid;
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        subgrid = Grid.getSubgridNumber(row, col);
        cells.push(
          <Cell
            ref={this.mapCellRef}
            key={`${row}-${col}`}
            row={row} col={col}
            subgrid={subgrid}
            // handleCellValueInput={this.handleCellValueInput} 
            handleCellSelection={this.handleCellSelection}
            // navigate={this.navigate}
            // getGameValue={this.getGameValue}
            // pencilMode={this.pencilMode}
            handleKeyPress={this.handleKeyPress}
          />
        );
      }
    }

    
    return <StyledGrid>{cells}</StyledGrid>
  }
}

const StyledGrid = styled(({...other}) => <div {...other} />)(
  ({theme}) => ({
  gridArea: 'sudoku-grid',
  display: 'grid',
  justifyContent: 'center',
  gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
  gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
  gridGap: '1px 1px',
  backgroundColor: '#212121',
  border: '4px solid',
  borderRadius: '3px',
  })
)


export default Grid;