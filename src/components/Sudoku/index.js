import React from 'react';
import {connect} from 'react-redux';
import {SudokuPencilToggle} from '../../redux/actions/sudokus';

import {styled} from '@material-ui/styles';

// import {
//   Button,
//   Typography,
//   Tooltip,
// } from '@material-ui/core';

// import {
//   Create as CreateIcon,
//   DeleteSweep as DeleteSweepIcon,
// } from '@material-ui/icons';

import {APPBAR_HEIGHT} from '../utils';
// import SudokuGrid, {valueKeyStrokes} from './Grid';
import SudokuGrid from './Grid';
import Pad from './Pad';

class Sudoku extends React.Component {
  constructor(props) {
    super(props);
    this.grid = null;
    this.updateGridRef = this.updateGridRef.bind(this);
    this.clearCells = this.clearCells.bind(this);
    this.inputValue = this.inputValue.bind(this);
  }

  componentDidMount() {
    window.sudoku = {
      ...window.sudoku,
      getCellsData: () => this.grid.getCellsData(),
    }
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
    this.grid.clear();
  }
  
  inputValue(key) {
    this.grid.input(key);
  }

  render() {
    console.log('Sudoku rendered');
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
      // const values = array[activeIndex].values;
      // pad = (
      //   <PadContainer>
      //       <PadButtons>
      //         <Tooltip title="Toggle pencil">
      //           <Button
      //             variant="outlined" 
      //             onClick={togglePencilMode}
      //           >
      //             <CreateIcon/>
      //             <Typography 
      //               color={pencil ? "primary" : "secondary"} 
      //               paragraph 
      //               align="right"
      //               style={{whiteSpace: 'pre'}}
      //             >
      //               {pencil ? `ON  ` : 'OFF'}
      //             </Typography>
      //           </Button>
      //         </Tooltip>
      //         <Tooltip title="Clear cell(s)">
      //           <Button 
      //             variant="outlined" 
      //             onClick={this.clearCells}
      //           >
      //             <DeleteSweepIcon/>
      //           </Button>
      //         </Tooltip>
      //       </PadButtons>

      //       <PadValues size={values.length} >
      //         {values.map((value, index) => (
      //           <Button 
      //             key={`valuePad-${value}`}
      //             variant="outlined"
      //             onClick={(e) => this.grid.input(valueKeyStrokes[index])}
      //           >
      //             <Typography variant="h4" style={{textTransform: 'none'}}>
      //               {value}
      //             </Typography>
      //           </Button>
      //         ))}
      //       </PadValues>
      //   </PadContainer>
      // )
      
      let isActive;
      sudokuArray = array.map(({id, size, values, cellsData}, index) => {
        isActive = activeIndex === index;
        return (
          <SudokuContainer 
            hidden={!isActive} 
            key={`${id}-container}`}
          >
            {/* <ColIndices size={size}>{colIndices}</ColIndices>
            <RowIndices size={size}>{rowIndices}</RowIndices> */}
            <SudokuGrid 
              {...isActive && {ref: this.updateGridRef}} 
              size={size} 
              values={values}
              initCellsData={cellsData}
            />
          </SudokuContainer>
        )
      })

    }
    
    return (
      <RootContainer >
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
// const PadContainer = styled((props) => <div {...props}/>)(
//   ({theme}) => ({
//     width: '100%',
//     display: 'flex',
//     flexDirection: 'column',
//     justifyContent: 'center',
//     marginTop: theme.spacing(2),
//     [theme.breakpoints.up('lg')]: {
//       width: 300,
//       marginTop: 0,
//       marginLeft: theme.spacing(2),
//     },
//     '& button': {
//       [theme.breakpoints.down('md')]: {
//         border: 'none',
//         height: 'auto',
//       },
//     },
//   })
// )

// const PadButtons = styled((props) => <div {...props}/>)(
//   ({theme}) => ({
//     display: 'flex',
//     fontSize: theme.typography.h5.fontSize,
//     '& button': {
//       width: '50%',
//       '& svg': {
//         fontSize: '1.75rem',
//       },
//       [theme.breakpoints.up('lg')]: {
//         height: 80,
//       },
//     },
//   })
// )

// const PadValues = styled((props) => <div {...props}/>)(
//   ({theme, size}) => ({
//     display: 'flex',
//     justifyContent: 'space-around',
//     marginTop: theme.spacing(2),
//     '& button': {
//       [theme.breakpoints.down('md')]: {
//         minWidth: 0,
//         padding: 0,
//       },
//     },
//     [theme.breakpoints.up('lg')]: {
//       marginTop: 0,
//       height: 300,
//       display: 'grid',
//       gridTemplateRows: `repeat(${Math.sqrt(size)}, 1fr)`,
//       gridTemplateColumns: `repeat(${Math.sqrt(size)}, 1fr)`,
//     }
//   })
// )
// TODO: dynamic sizing for font size to fit cell
const SudokuContainer = styled(({...props}) => <div {...props} />)(
  ({theme, hidden}) => ({
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
      width: `calc(100vh - ${APPBAR_HEIGHT}px - 10px)`,
      height: `calc(100vh - ${APPBAR_HEIGHT}px - 10px)`,
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