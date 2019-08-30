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
    // TODO: separate lastSelectedCell ??
    this.selectedCells = [null];
    this.cells = this.initGrid();
    this.state = {
      isCompleted: false,
      pencilMode: false,
    }

    // Input & Navigation
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.mapCellRef = this.mapCellRef.bind(this);
    
    // JSON handling
    // this.getJSONValues = this.getJSONValues.bind(this);
    // this.setValuesFromJSON = this.setValuesFromJSON.bind(this);
    
    // Play Mode Specifics
    // this.getGameValue = this.getGameValue.bind(this);
    // this.checkGameCompletion = this.checkGameCompletion.bind(this);
  }

  initGrid() {
    let cells = [];
    let cellRow, cell, row, col;
    // let gameValue;
    for (row = 0; row < GRID_SIZE; row++) {
      cellRow = [];
      for (col = 0; col < GRID_SIZE; col++) {
        // if (flag === 'random') {
        //   gameValue = `${Math.floor(Math.random() * GRID_SIZE) + 1}`;
        // } else if (flag === 'blank') {
        //   gameValue = ''
        // }
        cell = null;
        cellRow.push(cell);
      }
      cells.push(cellRow);
    }
    return cells;
  }

  mapCellRef(targetCell) {
    let {row, col} = targetCell.props;
    // let targetValue = this.getGameValue(row, col);
    this.cells[row][col] = targetCell;
    // if (targetValue !== '') {
    //   this.setCellValueMapping(targetCell, targetValue);
    // }
    this.setSubgridMapping(targetCell);
  }

  // updateCellValue(targetCell) {
  //   let {row, col} = targetCell.props;
  //   let newValue = this.getCellValue(targetCell);
  //   let oldValue = this.getGameValue(row, col);
  //   if (oldValue !== '') {
  //     this.removeCellValueMapping(targetCell, oldValue);
  //     this.uncheckConflicts();
  //     this.unspotMatchedCells(oldValue);
  //   }
  //   this.setGameValue(row, col, newValue);
  //   if (newValue !== '') {
  //     this.setCellValueMapping(targetCell, newValue);
  //     this.spotMatchedCellsAndConflicts(targetCell);
  //   }
  // }

  updateCellValue(targetCell, newValue) {
    let oldValue = this.getCellValue(targetCell);
    targetCell.setState({cellValue: newValue}, () => {
      if (oldValue !== '') {
        this.removeCellValueMapping(targetCell, oldValue);
        if (this.selectedCells.length === 1) {
          this.unspotMatchedCells(oldValue);
          this.uncheckConflicts(targetCell);
        }
      }  
      if (newValue !== '') {
        this.setCellValueMapping(targetCell, newValue);
        if (this.selectedCells.length === 1) {
          this.spotMatchedCellsAndConflicts(targetCell);
        }
      }
    });  
  }

  handleKeyPress(e, targetCell) {
    let {ctrlKey, key} = e
    if (VALUES.has(key)) {
      if (this.pencilMode()) {
        targetCell.setState((st) => {
          st.cellValue = '';
          st.pencils.set(key, !st.pencils.get(key));
          return st;
        })
      } else {
        let inputValue = VALUES.get(key);
        this.selectedCells.forEach(cell => {
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
      if (this.pencilMode()) {
        targetCell.setState({pencils: PencilMap()});
      } else {
        this.selectedCells.forEach(cell => {
          if (cell.state.cellValue !== '') {
            this.updateCellValue(cell, '');
          }
        })
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

  handleClick({ctrlKey, shiftKey}, targetCell) {
    if (this.selectedCells.length === 1) {
      this.singleSelectCell(targetCell);
    } else {
      this.selectedCells.forEach(cell => {
        this.clearCellStyle(cell);
      })
      this.litRelatives(targetCell);
      this.spotMatchedCellsAndConflicts(targetCell);
      this.selectCell(targetCell);
    }
  }

  singleSelectCell(targetCell) {
    let lastSelectedCell = this.selectedCells[0];
    if (!targetCell.isSameCell(lastSelectedCell)) {
      if (lastSelectedCell !== null) {
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
      this.litRelatives(targetCell);
      this.spotMatchedCellsAndConflicts(targetCell);
      this.selectCell(targetCell);
    } else {
      targetCell.input.focus();
    }
  }

  // multiSelectCell(targetCell) {

  // }

  selectCell(targetCell) {
    this.setCellStyle(targetCell, STYLE_STATES.SELECTED);
    this.selectedCells = [targetCell]
    targetCell.input.focus();
  }

  selectDir(targetIndex, direction) {
    // TODO: Check conflicts within col/row
    let lastSelectedCell = this.selectedCells[0];
    if (this.selectedCells > 1) {
      this.selectedCells.forEach(cell => {
        this.clearCellStyle(cell);
      })
    } else if (lastSelectedCell !== null) {
      this.clearCellStyle(lastSelectedCell);
      this.unlitRelatives(lastSelectedCell);
      let lastSelectedValue = this.getCellValue(lastSelectedCell);
      if (lastSelectedValue !== '') {
        this.uncheckConflicts();
        this.unspotMatchedCells(lastSelectedValue);
      }
    }
    this.selectedCells = [];

    let coor = {
      row: targetIndex,
      col: targetIndex
    }
    let cursor = (direction === DIRECTION.ROW) ? DIRECTION.COL : DIRECTION.ROW;
    let cell;
    for (coor[cursor] = 0; coor[cursor] < GRID_SIZE; coor[cursor]++) {
      cell = this.getCell(coor.row, coor.col);
      this.setCellStyle(cell, STYLE_STATES.SELECTED);
      this.selectedCells.push(cell);
    }
    this.selectedCells[0].input.focus();
  }

  keyNavigate(e) {
    let {key} = e
    let targetCell = null;
    let {row, col} = this.selectedCells[0].props;

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
    let cells = this.getCellsBySubgrid(targetCell.props.row, targetCell.props.col);
    cells.forEach((cell) => {
      this.setCellStyle(cell, STYLE_STATES.LIT);
    })
  }

  unlitRelativeSubgrid(targetCell) {
    let cells = this.getCellsBySubgrid(targetCell.props.row, targetCell.props.col);
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
        if (conflicts !== null) {
          this.conflictCells = conflicts;
          conflicts.forEach((cell) => this.setCellStyle(cell, STYLE_STATES.CONFLICTING));
        }
        if (otherMatches !== null) {
          otherMatches.forEach((cell) => this.setCellStyle(cell, STYLE_STATES.SPOTTED));
        }
      }
    }
  }

  checkConflicts(targetCell, targetValue) {
    let {row, col} = targetCell.props;
    let isConflicting;
    let isSelf;
    let matchedCells = this.getCellsByValue(targetValue);
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

  uncheckConflicts(relativeCell) {
    let cell, row, col;
    if (relativeCell !== undefined) {
      row = relativeCell.props.row;
      col = relativeCell.props.col;
    } else {
      row = -1;
      col = -1;
    }
    while (this.conflictCells.length !== 0) {
      cell = this.conflictCells.pop();
      if (cell.props.row === row || cell.props.col === col) {
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

  getCellsBySubgrid(row, col) {
    return this.subgridMap.get(Sudoku.getSubgridNumber(row, col));
  }
  
  setSubgridMapping(targetCell) {
    this.getCellsBySubgrid(targetCell.props.row, targetCell.props.col).push(targetCell);
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
        <div key={row+1} onClick={() => this.selectDir(row, DIRECTION.ROW)}>
          <p>{row + 1}</p>
        </div>
      )
      colIndices.push(
        <div key={row+1} onClick={() => this.selectDir(row, DIRECTION.COL)}>
          <p>{row + 1}</p>
        </div>
      )
      for (let col = 0; col < GRID_SIZE; col++) {
        subgrid = Sudoku.getSubgridNumber(row, col);
        cells.push(
          <Cell 
            ref={this.mapCellRef} 
            key={`${row}-${col}`} 
            row={row} col={col} 
            subgrid={subgrid}
            // handleCellValueInput={this.handleCellValueInput} 
            handleClick={this.handleClick} 
            // navigate={this.navigate}
            // getGameValue={this.getGameValue}
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