import React from 'react';
import PropTypes from 'prop-types';
import PencilLayer from './PencilLayer'
import {styled} from '@material-ui/styles';
import {
  ButtonBase,
} from '@material-ui/core';

import { mixColors } from '../utils';

class Cell extends React.PureComponent {
  
  static propTypes = {
    // ref: PropTypes.func.isRequired,
    // key: PropTypes.string.isRequired,
    gridsize: PropTypes.number.isRequired,
    row: PropTypes.number.isRequired,
    col: PropTypes.number.isRequired,
    subgrid: PropTypes.number.isRequired,
    initValue: PropTypes.string,
    handleCellClick: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props)

    this.conflicts = [];

    this.input = null;
    this.state = {
      cellValue: this.props.initValue || '',
      pencils: new Array(this.props.gridsize).fill(false),
      showPencils: false,
      status: {
        focused: false,
        selected: false,
        conflicting: false,
        spotted: false,
        lit: false,
      },
      selected: false,
    }
    this.inputRef = this.inputRef.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  addConflict(cell) {
    if (this.conflicts.findIndex((c) => c.isSameCell(cell)) === -1) {
      this.conflicts.push(cell);
      // cell.status = { conflicting: true };
    }
  }

  removeConflict(cell) {
    this.conflicts = this.conflicts.filter((c) => !c.isSameCell(cell));
    if (this.conflicts.length === 0) {
      this.status = { conflicting: false };
    }
    // cell.status = { conflicting: false };
  }

  set status(status) {
    this.setState(st => ({
      status: {
        ...st.status,
        ...status
      }
    }))
  }

  get selected() {
    return this.state.status.selected;
  }

  isSameCell(otherCell) {
    if (otherCell == null) return false;
    else return (
      this.props.row === otherCell.props.row &&
      this.props.col === otherCell.props.col
    )
  }

  inputRef(node) {
    this.input = node;
  }

  handleClick(e) {
    this.props.handleCellClick(e, this);
  }
  
  render() {
    // console.log('Cell rendered');
    return (
      <StyledCell
        gridsize={this.props.gridsize}
        row={this.props.row}
        col={this.props.col}
        status={this.state.status}
        onMouseUp={this.handleClick}
      >
        { this.state.showPencils && <PencilLayer pencils={this.state.pencils} />}
        <ButtonBase buttonRef={this.inputRef}>
          {this.state.cellValue}
        </ButtonBase>
      </StyledCell>
    )
  }
}

export const StyledCell = styled((props) => <div {...props} />)(
  ({theme, row, col, gridsize, status}) => ({
    backgroundColor: getBgColor(status, theme),
    borderColor: `${theme.sudoku.color[theme.palette.type]}`,
    borderStyle: 'solid',
    borderWidth: getBorderWidth(row, col, gridsize),
    position: 'relative',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: theme.sudoku.cell.hoveredBg[theme.palette.type]
    },
    '& button': {
      cursor: 'pointer',
      color: `${theme.sudoku.color[theme.palette.type]}`,
      margin: '0',
      padding: '0',
      border: 'none',
      width: '100%',
      height: '100%',
      textAlign: 'center',
      textShadow: `1.5px 1.5px 2.5px ${theme.sudoku.shadow[theme.palette.type]}`,
      fontSize: '1.2rem',
      [theme.breakpoints.down('md')]: {
        fontSize: '1rem',
      },
      backgroundColor: 'transparent'
    },
    '& button:focus': {
      outline: 'none'
    }
  }),
)

function getBgColor(status, theme) {
  const {focused, selected, conflicting, spotted, lit} = status;
  const {
    sudoku: {
      cell: {
        litBg, spottedBg, conflictingBg, selectedBg, focusedBg, baseBg
      }
    }, 
    palette: {type}
  } = theme;

  if (conflicting) {
    if (focused) {
      return mixColors(
        [conflictingBg[type], 2], 
        [focusedBg[type], 5]
      );
    } else if (selected) {
      return mixColors(
        [conflictingBg[type], 2], 
        [selectedBg[type], 5]
      );
    } else {
      return conflictingBg[type];
    }
  } else if (focused) {
    return focusedBg[type];
  } else if (selected) {
    return selectedBg[type];
  } else if (spotted) {
    return spottedBg[type];
  } else if (lit) {
    return litBg[type];
  } else {
    return baseBg[type];
  }

}

function getBorderWidth(row, col, gridSize) {
  let [top, right, bottom, left] = [0, 0, 0, 0]
  const subgridSize = Math.sqrt(gridSize)
  if (row !== 0 && row % subgridSize === 0) {
    top = '1px'
  }
  if (col !== gridSize - 1 && (col + 1) % subgridSize === 0) {
    right = '1px'
  }
  if (row !== gridSize - 1 && (row + 1) % subgridSize === 0) {
    bottom = '1px'
  }
  if (col !== 0 && col % subgridSize === 0) {
    left = '1px'
  }
  return `${top} ${right} ${bottom} ${left}`
}

export default Cell