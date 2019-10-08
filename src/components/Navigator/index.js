import React from 'react';
import { connect, batch } from 'react-redux';

import {
  AppBar,
  IconButton,
  Toolbar,
  Tooltip,
} from '@material-ui/core';
import {
  Brightness3 as Brightness3Icon,
  WbSunny as WbSunnyIcon,
} from '@material-ui/icons'
import { withStyles } from '@material-ui/styles';

import { ThemeTypeToggle } from '../../redux/actions/theme';
import { DrawerToggle } from '../../redux/actions/general';
import { SudokuTabChange, SudokuClose, SudokuSave } from '../../redux/actions/sudokus';
import { DialogAction, DialogSaveAsOnTabClose } from '../../redux/actions/dialogs';
import { APPBAR_HEIGHT } from '../utils';
import Drawer from './Drawer';
import DrawerIcon from './DrawerIcon';
import Tabs from './Tabs';
import { ReactComponent as LogoIcon} from './navbrand.svg';
import { ReactComponent as LogoText} from './pqSudoku.svg';
import { tooltips } from '../../lang';

const themeTypeIcon = {
  light: <WbSunnyIcon />,
  dark: <Brightness3Icon />
}

class Navigator extends React.PureComponent {
  constructor(props) {
    super(props);
    this.closeTab = this.closeTab.bind(this);

    this.hotkeyHandlers = {
      TOGGLE_DRAWER: this.props.toggleDrawer,
    }
  }
  
  closeTab(index) {
    const {saveAsPromptOnTabClose, drawerToggle, closeTab, dispatch} = this.props;
    if (saveAsPromptOnTabClose) {
      batch(() => { 
        if (drawerToggle) dispatch(DrawerToggle());
        dispatch(DialogSaveAsOnTabClose(index)); 
      })
    } else {
      closeTab(index);
    }
  }
  
  render() {
    // console.log('AppBar rendered')
    const { 
      classes, 
      theme: {palette: {type: themeType}}, 
      toggleThemeType, 
      drawerOpen, toggleDrawer, saveCurrentSudoku,
      sudokus, changeTab,
      dispatchDialog
    } = this.props;
    return (
      <React.Fragment>
        <AppBar className={classes.appBar}>
          <Toolbar disableGutters>

            <DrawerIcon 
              className={classes.drawerBtn} 
              drawerOpen={drawerOpen} 
              onClick={toggleDrawer}
            />

            <LogoIcon
              className={classes.logoIcon}
            />
            <LogoText 
              className={classes.logoText}
            />
            <Tabs 
              tabs={sudokus}
              closeTab={this.closeTab}
              changeTab={changeTab}
            />

            <Tooltip title={tooltips.toggleThemeType} classes={{tooltip: classes.tooltip}}>
              <IconButton className={classes.themeTypeToggle} onClick={toggleThemeType}>
                {themeTypeIcon[themeType]}
              </IconButton>
            </Tooltip>
          </Toolbar>
        </AppBar>

        <Drawer
          sudokuActive={(sudokus.activeIndex || sudokus.activeIndex === 0) && true}
          drawerOpen={drawerOpen}
          toggleDrawer={toggleDrawer}
          dispatchDialog={dispatchDialog}
          saveCurrentSudoku={saveCurrentSudoku}
        />
      </React.Fragment>
    )
  }
}

const styles = theme => ({
  appBar: {
    zIndex: theme.zIndex.drawer,
    height: APPBAR_HEIGHT,
    backgroundColor: theme.colors.appBar[theme.palette.type],
  },
  logoText: {
    height: 30,
    [theme.breakpoints.down('xs')]: {
      display: 'none',
    },
    marginLeft: theme.spacing(2),
  },
  logoIcon: {
    height: 45,
  },
  drawerBtn: {
    margin: theme.spacing(0, 1),
  },
  themeTypeToggle: {
    margin: theme.spacing(0, 2),
    color: theme.palette.type === 'light' ? 'white' : 'black',
  },
  tooltip: {
    ...theme.typography.body2
  }
})


const mapStateToProps = state => ({
  drawerOpen: state.general.drawerOpen,
  saveAsPromptOnTabClose: state.general.saveAsPromptOnTabClose,
  sudokus: state.sudokus,
})

const mapDispatchToProps = dispatch => ({
  toggleThemeType: () => dispatch(ThemeTypeToggle()),
  toggleDrawer: () => dispatch(DrawerToggle()),
  changeTab: (index) => dispatch(SudokuTabChange(index)),
  closeTab: (index) => dispatch(SudokuClose(index)),
  dispatchDialog: (type, toggle) => batch(() => { 
    if (toggle) dispatch(DrawerToggle());
    dispatch(DialogAction(type)); 
  }),
  saveCurrentSudoku: (toggle) => batch(() => { 
    if (toggle) dispatch(DrawerToggle());
    dispatch(SudokuSave()); 
  }),
  dispatch,
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, {withTheme: true})(Navigator));

// export default withStyles(styles)(Navigator);
