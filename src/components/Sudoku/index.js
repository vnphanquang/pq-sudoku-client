import React, { Component } from 'react';
import {PencilMap, VALUES, KEYS_STROKES, DIRECTION, STYLE_STATES, SUBGRID_NUMBERS, GRID_SIZE, SubgridMap, ValueMap} from './utils';
// import IOHandler from './IOHandler';
import Cell from './Cell';
import {styled} from '@material-ui/styles'

class Sudoku extends Component {
  constructor(props) {
    super(props);

    this.cellValueMap = ValueMap();
    this.subgridMap = SubgridMap();
    this.conflictCells = [];
    // this.focusedCell = null;
    this.focusedCells = [null];
    this.cells = this.initGrid('blank');
    this.state = {
      isCompleted: false,
      pencilMode: false,
    }

    // Input & Navigation
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleCellValueInput = this.handleCellValueInput.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.keyNavigate = this.keyNavigate.bind(this);
    this.updateCellMaps = this.updateCellMaps.bind(this);
    
    // JSON handling
    // this.getJSONValues = this.getJSONValues.bind(this);
    // this.setValuesFromJSON = this.setValuesFromJSON.bind(this);
    
    // Play Mode Specifics
    this.getGameValue = this.getGameValue.bind(this);
    // this.checkGameCompletion = this.checkGameCompletion.bind(this);
    this.togglePencilMode = this.togglePencilMode.bind(this);
    this.pencilMode = this.pencilMode.bind(this);
  }

  initGrid(flag) {
    let cells = [];
    let cellRow, cell, gameValue, row, col;
    for (row = 0; row < GRID_SIZE; row++) {
      cellRow = [];
      for (col = 0; col < GRID_SIZE; col++) {
        if (flag === 'random') {
          gameValue = `${Math.floor(Math.random() * GRID_SIZE) + 1}`;
        } else if (flag === 'blank') {
          gameValue = ''
        }
        cell = {node: null, gameValue};
        cellRow.push(cell);
      }
      cells.push(cellRow);
    }
    return cells;
  }

  updateCellMaps(targetCell) {
    let {row, col} = targetCell.props;
    let targetValue = this.getGameValue(row, col);
    this.cells[row][col].node = targetCell;
    if (targetValue !== '') {
      this.setCellValueMapping(targetCell, targetValue);
    }
    this.setSubgridMapping(targetCell);
  }

  handleCellValueInput(targetCell) {
    let {row, col} = targetCell.props;
    let newValue = this.getCellValue(targetCell);
    let oldValue = this.getGameValue(row, col);
    if (oldValue !== '') {
      this.removeCellValueMapping(targetCell, oldValue);
      this.uncheckConflicts();
      this.unspotMatchedCells(oldValue);
    }
    this.setGameValue(row, col, newValue);
    if (newValue !== '') {
      this.setCellValueMapping(targetCell, newValue);
      this.spotMatchedCellsAndConflicts(targetCell);
    }
  }

  handleKeyPress(e, targetCell) {
    let {ctrlKey, key} = e
    if (VALUES.has(key)) {
      if (this.pencilMode()) {
        targetCell.setState((st) => {
          st.cellValue = '';
          st.pencils.set(key, !st.pencils.get(key));
          return st;
        }, () => this.handleCellValueInput(targetCell))
      } else {
        if (VALUES.get(key) !== targetCell.state.cellValue) {
          targetCell.setState({cellValue: VALUES.get(key), pencils: PencilMap()}, () => this.handleCellValueInput(targetCell));
        } else {
          targetCell.setState({cellValue: ''}, () => this.handleCellValueInput(targetCell));    
        }
      }
    } else if (KEYS_STROKES.ARROWS.includes(key)) {
      this.keyNavigate(e);
    } else if (KEYS_STROKES.DELETES.includes(key)) {
      if (targetCell.state.cellValue !== '') {
        targetCell.setState({cellValue: ''}, () => this.handleCellValueInput(targetCell));
      } else {
        targetCell.setState({pencils: PencilMap()});
      }
    } else if (ctrlKey) {
      switch(key) {
        case 'a':
          //TODO: implement selectAllCells
          break;
        case 'z':
          //TODO: implement undo
          break;
        case 'y':
          //TODO: implement redo
          break;
        default:
          break;
      }
    }
  }

  handleClick(e, targetCell) {
    let lastFocusedCell = this.focusedCells[0];
    if (!targetCell.isSameCell(lastFocusedCell)) {
      if (lastFocusedCell !== null) {
        this.clearStyleState(lastFocusedCell);
        this.unlitRelatives(lastFocusedCell);
        let lastFocusedValue = this.getCellValue(lastFocusedCell);
        let targetValue = this.getCellValue(targetCell);
        if (lastFocusedValue !== '') {
          this.uncheckConflicts();
          if (targetValue !== lastFocusedValue) {
            this.unspotMatchedCells(lastFocusedValue);
          }
        }
      }
      this.litRelatives(targetCell);
      this.spotMatchedCellsAndConflicts(targetCell);
      this.focusCell(targetCell);
    } else {
      targetCell.input.focus();
    }
  }

  keyNavigate(e) {
    let {key} = e
    let targetCell = null;
    let {row, col} = this.focusedCells[0].props;

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
    if (targetCell !== null) this.handleClick(e, targetCell);
  }

  litRelatives(targetCell) {
    this.litRelativeDir(targetCell, DIRECTION.ROW);
    this.litRelativeDir(targetCell, DIRECTION.COL);
    this.litRelativeSubgrid(targetCell);
    this.clearStyleState(targetCell);
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
      this.litCell(cell); 
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
      this.clearStyleState(cell); 
    }
  }

  litRelativeSubgrid(targetCell) {
    let cells = this.getCellsFromSubgrid(targetCell.props.row, targetCell.props.col);
    cells.forEach((cell) => {
      this.litCell(cell);
    })
  }

  unlitRelativeSubgrid(targetCell) {
    let cells = this.getCellsFromSubgrid(targetCell.props.row, targetCell.props.col);
    cells.forEach((cell) => {
      this.clearStyleState(cell);
    })
  }

  litCell(targetCell) {
    targetCell.setState({styleState: STYLE_STATES.LIT});
  }

  spotMatchedCellsAndConflicts(targetCell) {
    let targetValue = this.getCellValue(targetCell);
    if (targetValue !== '') {
      let cells = this.getCellsFromCellValue(targetValue);
      if (cells.length !== 0) {
        let {conflicts, otherMatches} = this.checkConflicts(targetCell, targetValue);
        if (conflicts !== null) {
          this.conflictCells = conflicts;
          conflicts.forEach((cell) => cell.setState({styleState: STYLE_STATES.CONFLICTING}));
        }
        if (otherMatches !== null) {
          otherMatches.forEach((cell) => cell.setState({styleState: STYLE_STATES.SPOTTED}));
        }
      }
    }
  }

  checkConflicts(targetCell, targetValue) {
    let {row, col} = targetCell.props;
    let isConflicting;
    let isSelf;
    let matchedCells = this.getCellsFromCellValue(targetValue);
    let conflicts = [];
    let otherMatches = [];
    targetValue = (targetValue !== undefined) ? targetValue : this.getCellValue(targetCell);
    matchedCells.forEach((cell) => {
      isConflicting = (cell.props.row === row) || (cell.props.col === col);
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

  uncheckConflicts() {
    let cell;
    while (this.conflictCells.length !== 0) {
      cell = this.conflictCells.pop();
      this.clearStyleState(cell);
    }
  }

  unspotMatchedCells(targetValue) {
    this.getCellsFromCellValue(targetValue).forEach((cell) => {
      this.clearStyleState(cell);
    })
  }

  focusCell(targetCell) {
    targetCell.setState({styleState: STYLE_STATES.FOCUSED});
    this.focusedCells[0] = targetCell;
    targetCell.input.focus();
  }

  clearStyleState(targetCell) {
    targetCell.setState({styleState: null})
  }

  getGameValue(row, col) {
    return this.cells[row][col].gameValue;
  }

  setGameValue(row, col, targetValue) {
    this.cells[row][col].gameValue = targetValue;
  }

  getCellValue(targetCell) {
    return targetCell.state.cellValue;
  }
  
  isCorrectValue(targetCell) {
    let cellValue = this.getCellValue(targetCell);
    let gameValue = this.getGameValue(targetCell.props.row, targetCell.props.col);
    return cellValue === gameValue;
  }

  getCell(row, col) {
    return this.cells[row][col].node;
  }

  getCellsFromCellValue(targetValue) {
    return this.cellValueMap.get(`${targetValue}`)
  }

  removeCellValueMapping(targetCell, targetValue) {
    let isSelf;
    let cells = this.getCellsFromCellValue(targetValue);
    cells = cells.filter((cell) => {
      isSelf = cell.isSameCell(targetCell);
      return !isSelf;
    });
    this.cellValueMap.set(`${targetValue}`, cells);
  }

  setCellValueMapping(targetCell, targetValue) {
    this.getCellsFromCellValue(targetValue).push(targetCell);
  }

  getCellsFromSubgrid(row, col) {
    return this.subgridMap.get(Sudoku.getSubgridNumber(row, col));
  }
  
  setSubgridMapping(targetCell) {
    this.getCellsFromSubgrid(targetCell.props.row, targetCell.props.col).push(targetCell);
  }

  static getSubgridNumber(row, col) {
    return SUBGRID_NUMBERS[Math.floor(row/3)][Math.floor(col/3)];
  }

  togglePencilMode() {
    this.setState((st) => ({pencilMode: !st.pencilMode}));
  }
  pencilMode() {
    return this.state.pencilMode;
  }

  render() {
    console.log('Sudoko rerendered!');
    let cells = [];
    let rowIndices = [];
    let colIndices = [];
    let subgrid;
    for (let row = 0; row < GRID_SIZE; row++) {
      rowIndices.push(
        // TODO: implementselectRow & selectCol
        <div key={row+1} onClick={() => this.selectRow(row)}>
          <p>{row + 1}</p>
        </div>
      )
      colIndices.push(
        <div key={row+1} onClick={() => this.selectCol(row)}>
          <p>{row + 1}</p>
        </div>
      )
      for (let col = 0; col < GRID_SIZE; col++) {
        subgrid = Sudoku.getSubgridNumber(row, col);
        cells.push(
          <Cell 
            ref={this.updateCellMaps} 
            key={`${row}-${col}`} 
            row={row} col={col} 
            subgrid={subgrid}
            // handleCellValueInput={this.handleCellValueInput} 
            handleClick={this.handleClick} 
            // navigate={this.navigate}
            getGameValue={this.getGameValue}
            // pencilMode={this.pencilMode}
            handleKeyPress={this.handleKeyPress}
          />
        );
      }
    }

    return (
      <StyleSudokuContainer>
        <StyledColIndices>{colIndices}</StyledColIndices>
        <StyledRowIndices>{rowIndices}</StyledRowIndices>
        <StyledSudokuGrid>{cells}</StyledSudokuGrid>
      </StyleSudokuContainer>
    )

    // return (
    //   <div className={`Sudoku ${this.props.inactive ? 'inactive' : ''}`} disabled>
    //     <h1>{this.props.name}</h1>
    //     <h1>{this.state.isCompleted ? 'CONGRATULATIONS. YOU DID IT!' : 'GOOD LUCK!'}</h1>
    //     <div className="Sudoku-grid">{renderedCells}</div>

    //     <IOHandler save={this.getJSONValues} load={this.setValuesFromJSON}/>

    //     <button onClick={this.checkGameCompletion}>Check Game</button>
    //     <button onClick={this.togglePencilMode}>Pencil: {`${this.state.pencilMode}`}</button>
    //   </div>
    // )
  }
}

const StyledRowIndices = styled(({...other}) => <div {...other} />)({
  gridArea: 'row-indices',
  display: 'grid',
  justifyContent: 'stretch',
  gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
  gridRowGap: '1px',
  padding: '4px 0 4px 2px',
  textAlign: 'center',
  '& div': {
    borderRadius: '10% 50% 50% 10%',
    cursor: 'pointer',
  },
  '& div:hover': {
    backgroundColor: 'rgb(218, 255, 214)'
  }
})
const StyledColIndices = styled(({...other}) => <div {...other} />)({
  gridArea: 'col-indices',
  display: 'grid',
  justifyContent: 'center',
  gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
  gridColumnGap: '1px',
  padding: '4px 2px 0 2px',
  textAlign: 'center',
  '& div': {
    borderRadius: '10% 10% 50% 50%',
    cursor: 'pointer',
  },
  '& div:hover': {
    backgroundColor: 'rgb(218, 255, 214)'
  }
})

const StyleSudokuContainer = styled(({...other}) => <div {...other} />)({
  overflow: 'hidden',
  display: 'grid',
  justifyContent: 'center',
  gridTemplateColumns: `1fr ${GRID_SIZE}fr`,
  gridTemplateRows: `1fr ${GRID_SIZE}fr`,
  gridTemplateAreas: `". col-indices" "row-indices sudoku-grid"`,
  width: '600px',
  height: '600px'
})

const StyledSudokuGrid = styled(({...other}) => <div {...other} />)({
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


export default Sudoku;