import React, { Component } from 'react';
import PencilLayer from './PencilLayer'
import {STYLE_STATES, PencilMap} from './utils';
import {styled} from '@material-ui/styles';

class Cell extends Component {

  constructor(props) {
    super(props)
    this.input = null;
    this.state = {
      // cellValue: this.props.getGameValue(this.props.row, this.props.col),
      cellValue: '',
      pencils: PencilMap(),
      styleState: null
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
    console.log('Cell rerendered');
    return (
      <StyledCell
        row={this.props.row}
        col={this.props.col}
        styleState={this.state.styleState}
        onClick={this.handleClick}
        onKeyDown={this.handleKeyPress}
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

const StyledCell = styled(({styleState, row, col, ...other}) => <div {...other} />)({
  backgroundColor: ({styleState}) => getBgColor(styleState),
  borderColor: '#212121',
  borderStyle: 'solid',
  borderWidth: ({row, col}) => getBorderWidth(row, col),
  position: 'relative',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: 'rgb(218, 255, 214)'
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
})

function getBgColor(styleState) {
  switch(styleState) {
    case STYLE_STATES.LIT:
      return 'rgb(216, 216, 216)';
    case STYLE_STATES.SPOTTED:
      return 'rgb(153, 153, 153)';
    case STYLE_STATES.CONFLICTING:
      return 'rgb(255, 117, 117)';
    case STYLE_STATES.SELECTED:
      return 'rgb(168, 168, 255)';
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