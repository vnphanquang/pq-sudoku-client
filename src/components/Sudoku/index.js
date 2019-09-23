import React from 'react';
import {connect} from 'react-redux';
import {styled} from '@material-ui/styles';
import {
  ButtonBase,
  Box,
  Grid,
  Button,
  Badge,
  Typography,
} from '@material-ui/core';
import {
  Create as CreateIcon,
  DeleteSweep as DeleteSweepIcon,
} from '@material-ui/icons';

import SudokuGrid from './Grid';

import { DIRECTION } from '../utils';
class Sudoku extends React.Component {
  constructor(props) {
    super(props)
    this.activeGrid = null;
    this.updateGridRef = this.updateGridRef.bind(this);
    this.getActiveCellValues = this.getActiveCellValues.bind(this);
    this.togglePencilMode = this.togglePencilMode.bind(this);
    this.clearCells = this.clearCells.bind(this);
  }

  componentDidMount() {
    window.sudoku = {
      ...window.sudoku,
      getCellValues: this.getActiveCellValues,
    }
  }

  componentDidUpdate() {
    if (this.activeGrid) {
      if (window.sudoku.loadedValues) {
        this.activeGrid.setCellValues(window.sudoku.loadedValues);
        window.sudoku.loadedValues = null;
      }
      setTimeout(this.activeGrid.focus, 50);
    }
  }
  
  updateGridRef(grid) {
    this.activeGrid = grid;
  }

  getActiveCellValues() {
    return this.activeGrid.getCellValues();
  }

  togglePencilMode() {
    this.activeGrid.togglePencilMode();
    this.activeGrid.focus();
  }

  clearCells() {
    this.activeGrid.clear();
  }

  render() {
    // console.log('Sudoku rendered');

    let isActive = false;
    const sudokus = this.props.tabs.array.map(({id, size, values}, index) => {
      // const colIndices = [];
      // const rowIndices = [];
      // for (let row = 0; row < size; row++) {
      //   rowIndices.push(
      //     <ButtonBase 
      //       key={`${id}-row-index-${row+1}`} 
      //       onClick={(e) => this.activeGrid.handleCellSelectionByIndex(e, row, DIRECTION.ROW)}
      //     >
      //       {row+1}
      //     </ButtonBase>
      //   )
      //   colIndices.push(
      //     <ButtonBase 
      //       key={`${id}-col-index-${row+1}`} 
      //       onClick={(e) => this.activeGrid.handleCellSelectionByIndex(e, row, DIRECTION.COL)}
      //     >
      //       {row+1}
      //     </ButtonBase>
      //   )
      // }

      isActive = this.props.tabs.activeIndex === index;
      return (
        <RootContainer key={`${id}-container}`} >
          <SudokuContainer 
            hidden={!isActive} 
            size={size}
          >
            {/* <ColIndices size={size}>{colIndices}</ColIndices>
            <RowIndices size={size}>{rowIndices}</RowIndices> */}
            <SudokuGrid {...isActive && {ref: this.updateGridRef}} size={size} values={values}/>
          </SudokuContainer>

          <PadContainer>
            <PadButtons>
              <Button variant="outlined" onClick={this.togglePencilMode}>
                <CreateIcon/>
              </Button>
              <Button variant="outlined" onClick={this.clearCells}>
                <DeleteSweepIcon/>
              </Button>
            </PadButtons>

            <PadValues xs={8} size={values.length} >
              {values.map((value, index) => (
                <Button 
                  key={`${id}-valuePad-${value}`}
                  variant="outlined"
                  onClick={(e) => this.activeGrid.input(parseInt(index+1))}
                >
                  <Typography variant="h4">
                    {value}
                  </Typography>
                </Button>
              ))}
            </PadValues>
          </PadContainer>
        </RootContainer>
      )
    });
    
    return (
      <React.Fragment>
        {sudokus}
        {/* <button onClick={() => console.log(this.getActiveCellValues())}>CellValue</button> */}
      </React.Fragment>
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
const PadContainer = styled((props) => <div {...props}/>)(
  ({theme}) => ({
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    marginTop: theme.spacing(2),
    [theme.breakpoints.up('lg')]: {
      width: 300,
      marginTop: 0,
      marginLeft: theme.spacing(2),
    },
    '& button': {
      [theme.breakpoints.down('md')]: {
        border: 'none',
        height: 'auto',
      },
    },
  })
)

const PadButtons = styled((props) => <div {...props}/>)(
  ({theme}) => ({
    display: 'flex',
    fontSize: theme.typography.h5.fontSize,
    '& button': {
      width: '50%',
      '& svg': {
        fontSize: '1.75rem',
      },
      [theme.breakpoints.up('lg')]: {
        height: 80,
      },
    },
  })
)

const PadValues = styled((props) => <div {...props}/>)(
  ({theme, size}) => ({
      display: 'flex',
      justifyContent: 'space-around',
      marginTop: theme.spacing(2),
    '& button': {
      [theme.breakpoints.down('sm')]: {
        minWidth: 0,
        padding: 0,
      },
    },
    [theme.breakpoints.up('lg')]: {
      marginTop: 0,
      height: 300,
      display: 'grid',
      gridTemplateRows: `repeat(${Math.sqrt(size)}, 1fr)`,
      gridTemplateColumns: `repeat(${Math.sqrt(size)}, 1fr)`,
    }
  })
)

//TODO: dynamic sizing for font size to fit cell
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

const SudokuContainer = styled(({...props}) => <div {...props} />)(
  ({theme, hidden, size}) => ({
    // overflow: 'hidden',
    display: hidden ? 'none' : 'flex',
    justifyContent: 'center',
    width: `calc(100vw - 10px)`,
    height: `calc(100vw - 10px)`,
    [theme.breakpoints.up('sm')]: {
      // display: hidden ? 'none' : 'grid',
      width: '550px',
      height: '550px',
      // gridTemplateColumns: `1fr ${size}fr`,
      // gridTemplateRows: `1fr ${size}fr`,
      // gridTemplateAreas: `". col-indices" "row-indices sudoku-grid"`,
    },
    [theme.breakpoints.up('lg')]: {
      width: '700px',
      height: '700px',
    },
  })
)


const mapStateToProps = (state) => {
  return {tabs: state.tabs};
}

export default connect(mapStateToProps)(Sudoku);