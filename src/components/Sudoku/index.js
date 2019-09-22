import React from 'react';
import {connect} from 'react-redux';
import {styled} from '@material-ui/styles';
import ButtonBase from '@material-ui/core/ButtonBase';

import Grid from './Grid';

import { DIRECTION } from '../utils';
class Sudoku extends React.Component {
  constructor(props) {
    super(props)
    this.activeGrid = null;
    this.updateGridRef = this.updateGridRef.bind(this);
    this.getActiveCellValues = this.getActiveCellValues.bind(this);
  }

  componentDidMount() {
    window.sudoku = {
      ...window.sudoku,
      getCellValues: this.getActiveCellValues
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

  render() {
    // console.log('Sudoku rendered');

    let isActive = false;
    const sudokus = this.props.tabs.array.map(({id, size, values}, index) => {
      const colIndices = [];
      const rowIndices = [];
      for (let row = 0; row < size; row++) {
        rowIndices.push(
          <ButtonBase 
            key={`row-index-${row+1}`} 
            onClick={(e) => this.activeGrid.handleCellSelectionByIndex(e, row, DIRECTION.ROW)}
          >
            {row+1}
          </ButtonBase>
        )
        colIndices.push(
          <ButtonBase 
            key={`col-index-${row+1}`} 
            onClick={(e) => this.activeGrid.handleCellSelectionByIndex(e, row, DIRECTION.COL)}
          >
            {row+1}
          </ButtonBase>
        )
      }

      isActive = this.props.tabs.activeIndex === index;
      return (
        <SudokuContainer 
          key={`sudoku-container-${id}}`} 
          hidden={!isActive} 
          size={size}
        >
          <ColIndices size={size}>{colIndices}</ColIndices>
          <RowIndices size={size}>{rowIndices}</RowIndices>
          <Grid {...isActive && {ref: this.updateGridRef}} size={size} values={values}/>
        </SudokuContainer>
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

//TODO: dynamic sizing for font size to fit cell
const Indices = styled(({...props}) => <div {...props}/>)(
  ({theme}) => ({
    display: 'grid',
    gridColumnGap: '1px',
    textAlign: 'center',
    justifyContent: 'stretch',
    '& :hover': {
      backgroundColor: theme.sudoku.cell.hoveredBg[theme.palette.type],
    },
    '& button': {
      textShadow: `2px 2px 3px ${theme.sudoku.shadow[theme.palette.type]}`,
      fontSize: '1.2rem',
    },
  })
)

const RowIndices = styled(({...props}) => <Indices {...props} />)(
  ({size}) => ({
    gridArea: 'row-indices',
    gridTemplateRows: `repeat(${size}, 1fr)`,
    gridRowGap: '1px',
    padding: '4px 0 4px 2px',
    '& button': {
      borderRadius: '10% 50% 50% 10%',
      cursor: 'pointer',
    },
    
  })
)

const ColIndices = styled(({...props}) => <Indices {...props} />)(
  ({size}) => ({
    gridArea: 'col-indices',
    gridTemplateColumns: `repeat(${size}, 1fr)`,
    padding: '4px 2px 0 2px',
    '& button': {
      borderRadius: '10% 10% 50% 50%',
      cursor: 'pointer',
    },
  })
)
const SudokuContainer = styled(({...props}) => <div {...props} />)(
  ({hidden, size}) => ({
    overflow: 'hidden',
    display: hidden ? 'none' : 'grid',
    justifyContent: 'center',
    gridTemplateColumns: `1fr ${size}fr`,
    gridTemplateRows: `1fr ${size}fr`,
    gridTemplateAreas: `". col-indices" "row-indices sudoku-grid"`,
    width: '600px',
    height: '600px'
  })
)


const mapStateToProps = (state) => {
  return {tabs: state.tabs};
}

export default connect(mapStateToProps)(Sudoku);