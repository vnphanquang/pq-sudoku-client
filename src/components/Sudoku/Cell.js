import React from 'react';
import PropTypes from 'prop-types'
import PencilLayer from './PencilLayer'
import {STYLE_STATES, PencilMap} from '../utils';
import {styled} from '@material-ui/styles';

class Cell extends React.PureComponent {
  
  static propTypes = {
    // ref: PropTypes.func.isRequired,
    // key: PropTypes.string.isRequired,
    row: PropTypes.number.isRequired,
    col: PropTypes.number.isRequired,
    subgrid: PropTypes.number.isRequired,
    handleCellSelection: PropTypes.func.isRequired,
    handleKeyPress: PropTypes.func.isRequired
  }

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
    this.props.handleCellSelection(e, this);
  }
  
  handleKeyPress(e) {
    this.props.handleKeyPress(e, this)
  }

  render() {
    // console.log('Cell rendered');
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
        <button ref={this.inputRef}>
          {this.state.cellValue}
        </button>
      </StyledCell>
    )
  }
}


export const StyledCell = styled(({focused, styleState, row, col, ...other}) => <div {...other} />)(
  ({theme, row, col, focused, styleState}) => ({
    backgroundColor: getBgColor(focused, styleState, theme),
    borderColor: `${theme.sudoku.color[theme.palette.type]}`,
    borderStyle: 'solid',
    borderWidth: getBorderWidth(row, col),
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
      backgroundColor: 'transparent'
    },
    '& button:focus': {
      outline: 'none'
    }
  }),
)

function getBgColor(focused, styleState, {sudoku: {cell}, palette: {type}}) {
  switch(styleState) {
    case STYLE_STATES.LIT:
      return cell.litBg[type];
    case STYLE_STATES.SPOTTED:
      return cell.spottedBg[type];
    case STYLE_STATES.CONFLICTING:
      return cell.conflictingBg[type];
    case STYLE_STATES.SELECTED:
      if (focused) return cell.focusedBg[type];
      else         return cell.selectedBg[type];
    default:
      return cell.baseBg[type];
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