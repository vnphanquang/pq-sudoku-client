import React from 'react';
import {connect} from 'react-redux';
import {SudokuPencilToggle} from '../../redux/actions/sudokus';

import {styled} from '@material-ui/styles';

import {APPBAR_HEIGHT} from '../utils';
import SudokuGrid from './Grid';
import Pad from './Pad';

class Sudoku extends React.Component {
  constructor(props) {
    super(props);
    this.grid = null;
    this.updateGridRef = this.updateGridRef.bind(this);
    this.clearCells = this.clearCells.bind(this);
    this.inputValue = this.inputValue.bind(this);
    this.handleKeyInput = this.handleKeyInput.bind(this);
  }

  componentDidMount() {
    window.sudokus = {
      ...window.sudokus,
      getCellValues: () => this.grid.getCellValues(),
      getCellsData: () => this.grid.getCellsData(),
      getConflicts: () => this.grid.conflicts,
    }
    this.componentDidUpdate();
  }

  componentDidUpdate() {
    if (this.grid) {
      this.grid.togglePencilMode(this.props.sudokus.pencil);
      setTimeout(this.grid.focus, 50);
    }
  }
  
  updateGridRef(grid) {
    this.grid = grid;
  }

  clearCells() {
    this.grid.clearCellsValue();
  }
  
  inputValue(key) {
    this.grid.inputCellsValue(key);
  }

  handleKeyInput(e) {
    e.preventDefault();
    e.stopPropagation();
    this.grid.handleKeyInput(e);
  }

  render() {
    // console.log('Sudoku rendered');
    const {sudokus: {array, pencil, activeIndex}, togglePencilMode} = this.props;
    let pad = null;
    let sudokuArray = null;
    if (activeIndex !== null) {
      pad = (
        <Pad 
          togglePencilMode={togglePencilMode}
          pencil={pencil}
          values={array[activeIndex].values}
          inputValue={this.inputValue}
          clearCells={this.clearCells}
        />
      )
      
      let isActive;
      sudokuArray = array.map(({id, size, values, cellValues}, index) => {
        isActive = activeIndex === index;
        return (
          <SudokuContainer 
            hidden={!isActive} 
            key={`${id}-container}`}
          >
            <SudokuGrid 
              {...isActive && {ref: this.updateGridRef}} 
              size={size} 
              values={values}
              initCellValues={cellValues}
            />
          </SudokuContainer>
        )
      })

    }
    
    return (
      <RootContainer onKeyDown={this.handleKeyInput}>
        {sudokuArray}
        {pad}
      </RootContainer>
    )
  }
}

const RootContainer = styled((props) => <div {...props}/>)(
  ({theme}) => ({
    // maxHeight: '700px',
    // height: `calc(100vw - 10px)`,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    [theme.breakpoints.up('lg')]: {
      flexDirection: 'row',
    },
  })
)

const SudokuContainer = styled(({...props}) => <div {...props} />)(
  ({theme, hidden}) => ({
    // overflow: 'hidden',
    display: hidden ? 'none' : 'flex',
    justifyContent: 'center',
    width: `calc(100vw - 10px)`,
    height: `calc(100vw - 10px)`,
    [theme.breakpoints.up('sm')]: {
      // display: hidden ? 'none' : 'grid',
      width: `calc(100vh - ${APPBAR_HEIGHT}px - 125px)`,
      height: `calc(100vh - ${APPBAR_HEIGHT}px - 125px)`,
      maxWidth: '550px',
      maxHeight: '550px',
      // gridTemplateColumns: `1fr ${size}fr`,
      // gridTemplateRows: `1fr ${size}fr`,
      // gridTemplateAreas: `". col-indices" "row-indices sudoku-grid"`,
    },
    [theme.breakpoints.up('lg')]: {
      maxHeight: 800,
      maxWidth: 800,
    },
  })
)

const mapStateToProps = (state) => ({
  sudokus: state.sudokus,
  // sudoku: state.sudokus.activeIndex !== null ? state.sudokus.array[state.sudokus.activeIndex] : null,
  // pencil: state.sudokus.pencil,
})

const mapDispatchToProps = dispatch => ({
  togglePencilMode: () => dispatch(SudokuPencilToggle())
})

export default connect(mapStateToProps, mapDispatchToProps)(Sudoku);


// const Indices = styled(({...props}) => <div {...props}/>)(
//   ({theme}) => ({
//     display: 'grid',
//     gridColumnGap: '1px',
//     textAlign: 'center',
//     justifyContent: 'stretch',
//     '& :hover': {
//       backgroundColor: theme.sudoku.cell.hoveredBg[theme.palette.type],
//     },
//     '& button': {
//       textShadow: `2px 2px 3px ${theme.sudoku.shadow[theme.palette.type]}`,
//       fontSize: '1.2rem',
//     },
//     [theme.breakpoints.down('xs')]: {
//       display: 'none'
//     },
//   })
// )

// const RowIndices = styled(({...props}) => <Indices {...props} />)(
//   ({size}) => ({
//     gridArea: 'row-indices',
//     gridTemplateRows: `repeat(${size}, 1fr)`,
//     gridRowGap: '1px',
//     padding: '4px 0 4px 2px',
//     '& button': {
//       borderRadius: '10% 50% 50% 10%',
//       cursor: 'pointer',
//     },
//   })
// )

// const ColIndices = styled(({...props}) => <Indices {...props} />)(
//   ({size}) => ({
//     gridArea: 'col-indices',
//     gridTemplateColumns: `repeat(${size}, 1fr)`,
//     padding: '4px 2px 0 2px',
//     '& button': {
//       borderRadius: '10% 10% 50% 50%',
//       cursor: 'pointer',
//     },
//   })
// )


    // const sudokusArray = sudokus.array.map(({id, size, values}, index) => {
      // const colIndices = [];
      // const rowIndices = [];
      // for (let row = 0; row < size; row++) {
      //   rowIndices.push(
      //     <ButtonBase 
      //       key={`${id}-row-index-${row+1}`} 
      //       onClick={(e) => this.grid.handleCellSelectionByIndex(e, row, DIRECTION.ROW)}
      //     >
      //       {row+1}
      //     </ButtonBase>
      //   )
      //   colIndices.push(
      //     <ButtonBase 
      //       key={`${id}-col-index-${row+1}`} 
      //       onClick={(e) => this.grid.handleCellSelectionByIndex(e, row, DIRECTION.COL)}
      //     >
      //       {row+1}
      //     </ButtonBase>
      //   )
      // }


    // });