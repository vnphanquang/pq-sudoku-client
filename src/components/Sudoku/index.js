import React from 'react';
import {connect} from 'react-redux';
import {styled} from '@material-ui/styles';

import Grid from './Grid';

import {COLLAPSED_DRAWER_WIDTH, APPBAR_HEIGHT, DIRECTION, GRID_SIZE} from '../utils';
class Sudoku extends React.Component {
  constructor(props) {
    super(props)
    this.activeGrid = null;
    this.updateGridRef = this.updateGridRef.bind(this);
  }

  componentDidUpdate() {
    if (this.activeGrid) {
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
    console.log('Sudoku rendered');
    let colIndices = [];
    let rowIndices = [];
    for (let row = 0; row < GRID_SIZE; row++) {
      rowIndices.push(
        <div key={row+1} onClick={(e) => this.activeGrid.handleCellSelectionByIndex(e, row, DIRECTION.ROW)}>
          <input type="button" readOnly value={row+1} />
      </div>
      )
      colIndices.push(
        <div key={row+1} onClick={(e) => this.activeGrid.handleCellSelectionByIndex(e, row, DIRECTION.COL)}>
          <input type="button" readOnly value={row+1} />
        </div>
      )
    }

    let isActive = false;
    let id;
    const sudokus = this.props.tabs.array.map(({id}, index) => {
      isActive = this.props.tabs.activeIndex === index;
      id = `sudoku-container-${id}}`
      return (
        <SudokuContainer key={id} hidden={!isActive}>
          <ColIndices>{colIndices}</ColIndices>
          <RowIndices>{rowIndices}</RowIndices>
          <Grid {...isActive && {ref: this.updateGridRef}}/>
        </SudokuContainer>
      )
    });

    return (
      <React.Fragment>
        {sudokus}
        <button onClick={() => console.log(this.getActiveCellValues())}>CellValue</button>
      </React.Fragment>
    )
  }
}

const Indices = styled(({...props}) => <div {...props}/>)({
  display: 'grid',
  gridColumnGap: '1px',
  textAlign: 'center',
  justifyContent: 'stretch',
  '& div:hover': {
    backgroundColor: 'rgb(218, 255, 214)'
  },
  '& input': {
    margin: '0',
    padding: '0',
    border: 'none',
    width: '100%',
    height: '100%',
    textAlign: 'center',
    fontSize: '1.2rem',
    backgroundColor: 'transparent'
  },
  '& input:focus': {
    outline: 'none'
  }
})

const RowIndices = styled(({...props}) => <Indices {...props} />)({
  gridArea: 'row-indices',
  gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
  gridRowGap: '1px',
  padding: '4px 0 4px 2px',
  '& div': {
    borderRadius: '10% 50% 50% 10%',
    cursor: 'pointer',
  },
  
})

const ColIndices = styled(({...props}) => <Indices {...props} />)({
  gridArea: 'col-indices',
  gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
  padding: '4px 2px 0 2px',
  '& div': {
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