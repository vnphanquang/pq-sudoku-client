import React, { Component } from 'react';
import PropTypes from 'prop-types'
import PencilLayer from './PencilLayer'
import {STYLE_STATES, PencilMap} from '../utils';
import {styled} from '@material-ui/styles';

class Cell extends Component {

  constructor(props) {
    super(props)
    this.input = null;
    this.state = {
      // cellValue: this.props.getGameValue(this.props.row, this.props.col),
      cellValue: '',
      pencils: PencilMap(),
      styleState: null,
      focused: false
    }
    this.inputRef = this.inputRef.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  isSameCell(otherCell) {
    if (otherCell == null) return false;
    else return (
      this.props.row === otherCell.props.row &&
      this.props.col === otherCell.props.col
    )
  }
  isSelected() {
    return this.state.styleState === STYLE_STATES.SELECTED;
  }

  inputRef(node) {
    this.input = node;
  }

  handleClick(e) {
    this.props.handleClick(e, this);
  }
  
  handleKeyPress(e) {
    this.props.handleKeyPress(e, this)
  }

  render() {
    console.log('Cell rendered');
    return (
      <StyledCell
        row={this.props.row}
        col={this.props.col}
        styleState={this.state.styleState}
        onClick={this.handleClick}
        onKeyDown={this.handleKeyPress}
        focused={this.state.focused}
      >
        <PencilLayer pencils={this.state.pencils} />
        <input
          ref={this.inputRef}
          value={this.state.cellValue}
          readOnly
        />
      </StyledCell>
    )
  }
}

Cell.propTypes = {
  // ref: PropTypes.func.isRequired,
  // key: PropTypes.string.isRequired,
  row: PropTypes.number.isRequired,
  col: PropTypes.number.isRequired,
  subgrid: PropTypes.number.isRequired,
  handleClick: PropTypes.func.isRequired,
  handleKeyPress: PropTypes.func.isRequired
}

const StyledCell = styled(({focused, styleState, row, col, ...other}) => <div {...other} />)(
  ({theme, row, col, focused, styleState}) => ({
    backgroundColor: getBgColor(focused, styleState, theme.cell),
    borderColor: '#212121',
    borderStyle: 'solid',
    borderWidth: getBorderWidth(row, col),
    position: 'relative',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: theme.cell.hoverBg
    },
    '& input': {
      margin: '0',
      padding: '0',
      border: 'none',
      width: '100%',
      height: '100%',
      textAlign: 'center',
      fontSize: '1.5rem',
      backgroundColor: 'transparent'
    },
    '& input:focus': {
      outline: 'none'
    }
  }),
  {withTheme: true}
)

function getBgColor(focused, styleState, cell) {
  switch(styleState) {
    case STYLE_STATES.LIT:
      return cell.litBg;
    case STYLE_STATES.SPOTTED:
      return cell.spottedBg;
    case STYLE_STATES.CONFLICTING:
      return cell.conflictingBg;
    case STYLE_STATES.SELECTED:
      if (focused) return cell.focusedBg;
      else         return cell.selectedBg;
    default:
      return 'white'
  }
}

function getBorderWidth(row, col) {
  let [top, right, bottom, left] = [0, 0, 0, 0]
  
  if (row === 3 || row === 6) {
    top = '1px'
  }
  if (col === 2 || col === 5) {
    right = '1px'
  }
  if (row === 2 || row === 5) {
    bottom = '1px'
  }
  if (col === 3 || col === 6) {
    left = '1px'
  }
  return `${top} ${right} ${bottom} ${left}`
}

export default Cell