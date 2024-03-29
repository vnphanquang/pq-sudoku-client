import React from 'react';
import clsx from 'clsx';

import {
  Box,
  ButtonBase,
  Divider,
  Grid,
  IconButton,
  Typography,
  Tooltip,
} from '@material-ui/core';
import {
  Brightness3 as Brightness3Icon,
  WbSunny as WbSunnyIcon,
  Menu as MenuIcon
} from '@material-ui/icons';
import { styled, withStyles } from '@material-ui/styles';
import { createMuiTheme } from '@material-ui/core/styles';

import { StyledCell } from '../../Sudoku/Cell';
import { StyledGrid } from '../../Sudoku/Grid';

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
class ThemePanel extends React.PureComponent {
  constructor(props) {
    super(props);
    
    this.cellColorInputRefs = {};
    this.appBarColorInputRef = null;
    this.state = props.settings;
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
    // console.log('Appearance Panel rendered');

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

    const mockedTheme = createMuiTheme({
      ...this.state,
      palette: {
        type: this.state.type,
      },
    })

    const demoCells = [];
    let focused, selected, conflicting, spotted, lit;
    let value;
    let handleClick;

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        focused = selected = conflicting = spotted = lit = false;
        value = '';
        handleClick = (e) => this.cellColorInputRefs['baseBg'].click();
        if (row === 1 || (col >= 0 && col <=2 && row !== 3) || (row === 3 && col === 1)) {
          lit = true;
          handleClick = (e) => this.cellColorInputRefs['litBg'].click();
        }
        if (col === 1 && row !== 3) {
          selected = true;
          handleClick = (e) => this.cellColorInputRefs['selectedBg'].click();
        }
        if (row === 3 && col === 3) {
          spotted = true;
          handleClick = (e) => this.cellColorInputRefs['spottedBg'].click();
          value = 1;
        }
        else if (row === 1 && col === 1) {
          focused = true;
          handleClick = (e) => this.cellColorInputRefs['focusedBg'].click();
          value = 1;
        }
        else if (row === 0 && col === 2) {
          conflicting = true;
          handleClick = (e) => this.cellColorInputRefs['conflictingBg'].click();
          value = 1;
        }

        demoCells.push(
          <StyledCell
            key={`demo-cell-${row}-${col}`}
            theme={mockedTheme}
            row={row} col={col}
            status={{focused, selected, conflicting, spotted, lit}}
            onClick={handleClick}
          >
            <button>{value}</button>
          </StyledCell>
        )
      }
    }

    return (
      <div className={classes.root}>
        <div className={classes.theme}>
          <Typography variant="body1">Toggle theme: </Typography>
          <Tooltip title="Light mode">
            <IconButton className={clsx(classes.themeIcon, themeType !== 'light' && classes.themeTypeOff)} onClick={this.toggleThemeType}>
                  {themeTypeIcon['light']}
            </IconButton>
          </Tooltip>
          <Tooltip title="Dark mode">
            <IconButton className={clsx(classes.themeIcon, themeType !== 'dark' && classes.themeTypeOff)} onClick={this.toggleThemeType}>
                  {themeTypeIcon['dark']}
            </IconButton>
          </Tooltip>
        </div>
        <Divider className={classes.divider}/>
        <Grid container>
          <Grid className={classes.cellColorInputs} xs={6} md={3} item>
            <Typography variant="body1" component="label">
              Cell Colors
            </Typography>
            <Typography variant="body2" component="p">
              Click on cells in the preview grid to change their colors to your preferences. 
              Click on the standalone cell to change color when hovering over cell. Hover effect might not show on mobile devices.
            </Typography>
            {cellColorInputs}
          </Grid>
          <Grid className={classes.demoGridWrapper}  xs={6} md={3} item>
            <StyledGrid className={classes.demoGrid} theme={mockedTheme} rows={4} cols={4}> 
              {demoCells}
            </StyledGrid>
          </Grid>
        </Grid>
        <Divider className={classes.divider}/>
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
            <Typography variant="h5">pqSudoku</Typography>
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
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(2, 0),
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
  demoGridWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  demoGrid: {
    width: 200,
    height: 200,
    [theme.breakpoints.only('xs')]: {
      minWidth: 150,
      minHeight: 150,
      width: 180,
      height: 180,
    }
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
  divider: {
    margin: theme.spacing(2, 0),
  },
})

export default withStyles(styles)(ThemePanel);