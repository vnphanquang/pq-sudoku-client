import React from 'react';
import {connect} from 'react-redux';
import {styled} from '@material-ui/styles';
import ButtonBase from '@material-ui/core/ButtonBase';

import Grid from './Grid';

import { DIRECTION, GRID_SIZE} from '../utils';
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
    let colIndices = [];
    let rowIndices = [];
    for (let row = 0; row < GRID_SIZE; row++) {
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

    let isActive = false;
    const sudokus = this.props.tabs.array.map(({id}, index) => {
      isActive = this.props.tabs.activeIndex === index;
      return (
        <SudokuContainer key={`sudoku-container-${id}}`} hidden={!isActive}>
          <ColIndices>{colIndices}</ColIndices>
          <RowIndices>{rowIndices}</RowIndices>
          <Grid {...isActive && {ref: this.updateGridRef}}/>
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

const Indices = styled(({...props}) => <div {...props}/>)(
  ({theme}) => ({
    display: 'grid',
    gridColumnGap: '1px',
    textAlign: 'center',
    justifyContent: 'stretch',
    '& :hover': {
      backgroundColor: theme.sudoku.cell.hoverBg[theme.palette.type],
    },
    '& button': {
      textShadow: `2px 2px 3px ${theme.sudoku.shadow[theme.palette.type]}`,
      fontSize: '1.2rem',
    },
  })
)

const RowIndices = styled(({...props}) => <Indices {...props} />)({
  gridArea: 'row-indices',
  gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
  gridRowGap: '1px',
  padding: '4px 0 4px 2px',
  '& button': {
    borderRadius: '10% 50% 50% 10%',
    cursor: 'pointer',
  },
  
})

const ColIndices = styled(({...props}) => <Indices {...props} />)({
  gridArea: 'col-indices',
  gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
  padding: '4px 2px 0 2px',
  '& button': {
    borderRadius: '10% 10% 50% 50%',
    cursor: 'pointer',
  },
})

const SudokuContainer = styled(({...props}) => <div {...props} />)(
  ({hidden}) => ({
    overflow: 'hidden',
    display: hidden ? 'none' : 'grid',
    justifyContent: 'center',
    gridTemplateColumns: `1fr ${GRID_SIZE}fr`,
    gridTemplateRows: `1fr ${GRID_SIZE}fr`,
    gridTemplateAreas: `". col-indices" "row-indices sudoku-grid"`,
    width: '600px',
    height: '600px'
  })
)


const mapStateToProps = (state) => {
  return {tabs: state.tabs};
}

export default connect(mapStateToProps)(Sudoku);