import React from 'react';
import { connect, batch } from 'react-redux';
import { SudokuPencilToggle, SudokuFetchApply, SudokuFetchStart, SudokuFetchEnd } from '../../redux/actions/sudokus';

import CircularProgress from '@material-ui/core/CircularProgress';
import { styled } from '@material-ui/styles';

import { APPBAR_HEIGHT } from '../utils';
import SudokuGrid from './Grid';
import Pad from './Pad';
import { SnackbarGenericInfo, SnackbarGenericSuccess, SnackbarGenericError } from '../../redux/actions/snackbar';
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
    this.fetch = this.fetch.bind(this);
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

  async fetch(type) {
    const targetGrid = this.grid;
    const targetGridIndex = this.props.sudokus.activeIndex;
    try {
      let cellValues = targetGrid.getCellValues();
      this.props.startFetch(cellValues);
      let res, error;
      if (type === 'solution') {
        res = await fetch('/api/solver/sudoku/classic', {
          method: 'POST',
          credentials: 'same-origin',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            algorithm: 'backtracking',
            values: targetGrid.props.values,
            cellValues,
            timeout: 5,
          })
        });

        ({ solution: cellValues, error } = await res.json());
      } else if (type === 'generation') {
        res = await fetch('/api/generator/sudoku/classic', {
          method: 'POST',
          credentials: 'same-origin',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            values: targetGrid.props.values,
            cellValues,
          })
        });
        
        ({ clues: cellValues, error } = await res.json());
      }
      switch(res.status) {
        case 200:
          targetGrid.updateCellValues(cellValues);
          this.props.applyFetch(targetGridIndex, cellValues);
          break;
        case 209:
          this.props.endFetch(targetGridIndex, {
            message: snackbarMessages.alreadySolved
          });
          break;
        case 400:
          if (error) {
            if (error.conflicts) {
              this.props.endFetch(targetGridIndex, { 
                message: snackbarMessages.cellConflicts 
              });
            } else {
              this.props.endFetch(targetGridIndex, { 
                message: error.message || snackbarMessages.genericError 
              });
            }
          }
          break;
        case 408:
          this.props.endFetch(targetGridIndex, { 
            message: snackbarMessages.fetchTimeout 
          });
          break;
        default:
          this.props.endFetch(targetGridIndex, { 
            message: (error && error.message) || snackbarMessages.genericError 
          });
      }
    } catch (error) {
      console.log(error);
      this.props.endFetch(targetGridIndex, { 
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
          onSolve={() => this.fetch('solution')}
          onGenerate={() => this.fetch('generation')}
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
  startFetch: async (cellValues) => batch(() => {
    dispatch(SnackbarGenericInfo({ message: snackbarMessages.fetching }));
    dispatch(SudokuFetchStart(cellValues));
  }),
  applyFetch: (cellValues) => batch(() => {
    dispatch(SnackbarGenericSuccess({ message: snackbarMessages.fetchSuccess }));
    dispatch(SudokuFetchApply(cellValues));
  }),
  endFetch: (index, error) => batch(() => {
    dispatch(SudokuFetchEnd(index));
    if (error) {
      dispatch(SnackbarGenericError(error));
    }
  }),
})

export default connect(mapStateToProps, mapDispatchToProps)(Sudoku);
