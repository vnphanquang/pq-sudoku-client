import React from 'react';
import { connect, batch } from 'react-redux';
import { SudokuPencilToggle, SudokuSolutionApply, SudokuSolutionRequest, SudokuSolutionDiscard } from '../../redux/actions/sudokus';

import CircularProgress from '@material-ui/core/CircularProgress';
import { styled } from '@material-ui/styles';

import { APPBAR_HEIGHT } from '../utils';
import SudokuGrid from './Grid';
import Pad from './Pad';
import { SnackbarSudokuSolutionRequest, SnackbarSudokuSolutionSuccess, SnackbarGenericError } from '../../redux/actions/snackbar';
import { snackbarMessages } from '../../lang';

class Sudoku extends React.Component {
  constructor(props) {
    super(props);
    this.grid = null;
    this.fetching = false;
    this.updateGridRef = this.updateGridRef.bind(this);
    this.clearCells = this.clearCells.bind(this);
    this.inputValue = this.inputValue.bind(this);
    this.handleKeyInput = this.handleKeyInput.bind(this);
    this.requestSolution = this.requestSolution.bind(this);
  }

  componentDidMount() {
    window.sudokus = {
      ...window.sudokus,
      getCellValues: () => this.grid.getCellValues(),
      // getCellsData: () => this.grid.getCellsData(),
      // getConflicts: () => this.grid.conflicts,
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
    if (this.grid && !this.fetching) {
      this.grid.clearCellsValue();
    }
  }
  
  inputValue(key) {
    if (this.grid && !this.fetching) {
      this.grid.inputCellsValue(key);
    }
  }

  handleKeyInput(e) {
    if (this.grid && !this.fetching) {
      e.preventDefault();
      e.stopPropagation();
      this.grid.handleKeyInput(e);
    }
  }

  updateGrid(cellValues) {
    if (this.grid) {
      this.grid.updateCellValues(cellValues);
    }
  }

  async requestSolution() {
    const targetGrid = this.grid;
    const targetGridIndex = this.props.sudokus.activeIndex;
    try {
      this.props.requestSolution();
      const res = await fetch('/api/solution/sudoku/classic', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          algorithm: 'backtracking',
          values: targetGrid.props.values,
          cellValues: targetGrid.getCellValues(),
          timeout: 5,
        })
      })
      const {error, solution} = await res.json();
      switch(res.status) {
        case 200:
          targetGrid.updateCellValues(solution);
          this.props.applySolution(targetGridIndex, solution);
          break;
        case 209:
          this.props.discardSolution(targetGridIndex, {
            message: snackbarMessages.alreadySolved
          });
          break;
        case 400:
          if (error) {
            if (error.conflicts) {
              this.props.discardSolution(targetGridIndex, { 
                message: snackbarMessages.cellConflicts 
              });
            } else {
              this.props.discardSolution(targetGridIndex, { 
                message: error.message || snackbarMessages.genericError 
              });
            }
          }
          break;
        case 408:
          this.props.discardSolution(targetGridIndex, { 
            message: snackbarMessages.solutionTimeout 
          });
          break;
        default:
          this.props.discardSolution(targetGridIndex, { 
            message: (error && error.message) || snackbarMessages.genericError 
          });
      }
    } catch (error) {
      console.log(error);
      this.props.discardSolution(targetGridIndex, { 
        message: snackbarMessages.genericError 
      });
    }
  }

  render() {
    // console.log('Sudoku rendered');
    const {sudokus: {array, pencil, activeIndex},  togglePencilMode} = this.props;
    let pad = null;
    let sudokuArray = null;
    if (activeIndex !== null) {
      let isActive;
      this.fetching = false;
      sudokuArray = array.map(({id, size, values, cellValues, fetching}, index) => {
        isActive = activeIndex === index;
        if (isActive && fetching) this.fetching = true;
        return (
          <SudokuContainer 
            hidden={!isActive} 
            key={`${id}-container}`}
          >
            {fetching && <CircularProgress/>}
            <SudokuGrid 
              hidden={fetching}
              {...isActive && {ref: this.updateGridRef}} 
              size={size} 
              values={values}
              initCellValues={cellValues}
            />
          </SudokuContainer>
        )
      })

      pad = (
        <Pad 
          pencil={pencil}
          values={array[activeIndex].values}
          inputValue={this.inputValue}
          onPencil={togglePencilMode}
          onClear={this.clearCells}
          onSolve={this.requestSolution}
          onGenerate={() => console.log('generate...')}
          fetching={this.fetching}
        />
      )

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
    alignItems: 'center',
    width: `calc(100vw - 10px)`,
    height: `calc(100vw - 10px)`,
    [theme.breakpoints.up('sm')]: {
      width: `calc(100vh - ${APPBAR_HEIGHT}px - 125px)`,
      height: `calc(100vh - ${APPBAR_HEIGHT}px - 125px)`,
      maxWidth: '550px',
      maxHeight: '550px',
    },
    [theme.breakpoints.up('lg')]: {
      maxHeight: 800,
      maxWidth: 800,
    },
  })
)

const mapStateToProps = (state) => ({
  sudokus: state.sudokus,
})

const mapDispatchToProps = dispatch => ({
  togglePencilMode: () => dispatch(SudokuPencilToggle()),
  requestSolution: async () => batch(() => {
    dispatch(SnackbarSudokuSolutionRequest());
    dispatch(SudokuSolutionRequest());
  }),
  applySolution: (cellsValue) => batch(() => {
    dispatch(SnackbarSudokuSolutionSuccess());
    dispatch(SudokuSolutionApply(cellsValue));
  }),
  discardSolution: (index, error) => batch(() => {
    dispatch(SudokuSolutionDiscard(index));
    if (error) {
      dispatch(SnackbarGenericError(error));
    }
  }),
})

export default connect(mapStateToProps, mapDispatchToProps)(Sudoku);
