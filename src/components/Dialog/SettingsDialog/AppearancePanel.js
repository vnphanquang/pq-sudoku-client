import React from 'react';
import clsx from 'clsx';

import {
  Box,
  ButtonBase,
  Divider,
  Grid,
  IconButton,
  Typography,
} from '@material-ui/core';
import {
  Brightness3 as Brightness3Icon,
  WbSunny as WbSunnyIcon,
  Menu as MenuIcon
} from '@material-ui/icons';
import { styled, withStyles } from '@material-ui/styles';

import { StyledCell } from '../../Sudoku/Cell';
import { StyledGrid } from '../../Sudoku/Grid';
import { STYLE_STATES } from '../../utils';

// const colorLabelVariants = {
//   baseBg: 'Base',
//   hoveredBg: 'Hovered ',
//   focusedBg: 'Focused',
//   selectedBg: 'Selected',
//   conflictingBg: 'Conflicting',
//   spottedBg: 'Spotted',
//   litBg: 'Lit',
// }

const themeTypeIcon = {
  light: <WbSunnyIcon />,
  dark: <Brightness3Icon />
}

//TODO: pull display texts from lang
class AppearancePanel extends React.Component {
  constructor(props) {
    super(props);
    
    this.cellColorInputRefs = {};
    this.appBarColorInputRef = null;
    this.state = props.theme;
    this.handleCellColorInput = this.handleCellColorInput.bind(this);
    this.handleOtherColorInput = this.handleOtherColorInput.bind(this);
    this.toggleThemeType = this.toggleThemeType.bind(this);
  }

  handleCellColorInput(e) {
    const {name, value} = e.target;
    const colorInstance = this.state.sudoku.cell[name];
    this.setState({
      sudoku: {
        ...this.state.sudoku,
        cell: {
          ...this.state.sudoku.cell,
          [name]: {
            ...colorInstance,
            [this.state.type]: value
          }
        }
      }
    })
  }

  handleOtherColorInput(e) {
    const {name, value} = e.target;
    this.setState({
      colors: {
        ...this.state.colors,
        [name]: {
          ...this.state.colors[name],
          [this.state.type]: value
        }
      }
    })
  }
  
  toggleThemeType(e) {
    this.setState({
      type: this.state.type === 'light' ? 'dark' : 'light'
    })
  }

  render() {
    console.log('Appearance Panel rendered');

    const classes = this.props.classes;
    const themeType = this.state.type;
    const cellColorInputs = [];
    let id;
    Object.entries(this.state.sudoku.cell).forEach(([key, value]) => {
      id = `theme-input-${key}`;
      cellColorInputs.push(
        <div key={id} className={clsx(classes.colorInput, key !== 'hoveredBg' && classes.hidden)}>
          <input
            ref={(node) => this.cellColorInputRefs[key] = node}
            type="color"
            name={key}
            value={value[themeType]}
            onChange={this.handleCellColorInput}
          />
          {
            key === 'hoveredBg' &&
            <Typography variant="body2">
              {'Cell color when hovered'}
            </Typography>
          }
        </div>
      )
    })

    const mockedTheme = {
      ...this.state,
      palette: {
        type: this.state.type,
      },
    }

    const demoCells = [];
    let styleState;
    let focused;
    let value;
    let handleClick;

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        styleState = null;
        focused = false;
        value = '';
        handleClick = (e) => this.cellColorInputRefs['baseBg'].click();
        if (row === 1 || (col >= 0 && col <=2 && row !== 3) || (row === 3 && col === 1)) {
          styleState = STYLE_STATES.LIT
          handleClick = (e) => this.cellColorInputRefs['litBg'].click();
        }
        if (col === 1 && row !== 3) {
          styleState = STYLE_STATES.SELECTED;
          handleClick = (e) => this.cellColorInputRefs['selectedBg'].click();
        }
        if (row === 3 && col === 3) {
          styleState = STYLE_STATES.SPOTTED;
          handleClick = (e) => this.cellColorInputRefs['spottedBg'].click();
          value = 1;
        }
        else if (row === 1 && col === 1) {
          focused = true;
          handleClick = (e) => this.cellColorInputRefs['focusedBg'].click();
          value = 1;
        }
        else if (row === 0 && col === 2) {
          styleState = STYLE_STATES.CONFLICTING;
          handleClick = (e) => this.cellColorInputRefs['conflictingBg'].click();
          value = 1;
        }

        demoCells.push(
          <StyledCell
            key={`demo-cell-${row}-${col}`}
            theme={mockedTheme}
            row={row} col={col}
            styleState={styleState}
            focused={focused}
            onClick={handleClick}
          >
            <button>{value}</button>
          </StyledCell>
        )
      }
    }

    return (
      <div className={classes.root} hidden={this.props.hidden} theme={mockedTheme}>
        <Box my={2} className={classes.theme}>
          <Typography variant="body1">Toggle theme: </Typography>
          <IconButton className={clsx(classes.themeIcon, themeType !== 'light' && classes.themeTypeOff)} onClick={this.toggleThemeType}>
                {themeTypeIcon['light']}
          </IconButton>
          <IconButton className={clsx(classes.themeIcon, themeType !== 'dark' && classes.themeTypeOff)} onClick={this.toggleThemeType}>
                {themeTypeIcon['dark']}
          </IconButton>
        </Box>
        <Divider/>
        <Grid container>
          <Grid className={classes.cellColorInputs} xs={12} sm={6} md={3} item>
            <Typography variant="body1" component="label">
              Cell Colors
            </Typography>
            <Typography variant="body2" component="p">
              Click on cells in the preview grid to change their colors to your preferences. 
              Click on the standalone cell to change color when hovering over cell. Hover effect might not show on mobile devices.
            </Typography>
            {cellColorInputs}
          </Grid>
          <Grid className={classes.demoGrid} xs={12} sm={6} md={3} item>
            <Box width={200} height={200} >
              <StyledGrid theme={mockedTheme} rows={4} cols={4}> 
                {demoCells}
              </StyledGrid>
            </Box>
          </Grid>
        </Grid>
        <Divider />
        <Typography variant="body1" component="label">
          Navigation Bar
        </Typography>
        <Grid item xs={12} sm={6}>
          <input
              className={classes.hidden}
              ref={(node) => this.appBarColorInputRef = node}
              type="color"
              name={'appBar'}
              value={this.state.colors.appBar[themeType]}
              onChange={this.handleOtherColorInput}
          />
          <Typography variant="body2">
            Click to change color
          </Typography>
          <AppBarDemo 
            bg={this.state.colors.appBar[themeType]}
            onClick={() => this.appBarColorInputRef.click()}
          >
            <Box mx={2}><MenuIcon/></Box>
            <Typography variant="h5">SudokuPQ</Typography>
          </AppBarDemo>
        </Grid>
      </div>
    )
  }
}

const AppBarDemo = styled((props) => <ButtonBase {...props} />)(
  ({theme, bg}) => ({
    justifyContent: 'start',
    height: 50,
    width: '100%',
    backgroundColor: bg,
  })
)

const styles = theme => ({
  root: {
    display: ({hidden}) => hidden ? 'none' : 'flex',
    flexDirection: 'column',
  },
  colorInput: {
    display: 'flex',
    alignItems: 'center',
    '& input': {
      width: '50px',
      height: '50px',
      border: 'none',
      backgroundColor: 'transparent',
      cursor: 'pointer',
      margin: 0,
      padding: 0,
      '&:focus': {
        outline: 'none'
      },
    }
  },
  cellColorInputs: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  demoGrid: {
    display: 'flex',
    justifyContent: 'center',
  },
  hidden: {
    display: 'none'
  },
  theme: {
    display: 'flex',
    alignItems: 'center',
  },
  themeIcon: {
    marginLeft: theme.spacing(1),
  },
  themeTypeOff: {
    opacity: '.25',
  },
})

export default withStyles(styles)(AppearancePanel);