import React from 'react';

import {connect} from 'react-redux';
import {ThemeTypeToggle, DrawerToggle, TabChange, TabRemoval} from '../../redux/actions';
import {DialogAction} from '../../redux/actions/dialogs';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import WbSunnyIcon from '@material-ui/icons/WbSunny';
import Brightness3Icon from '@material-ui/icons/Brightness3';
import { APPBAR_HEIGHT } from '../utils';
import Tooltip from '@material-ui/core/Tooltip';
import {withStyles} from '@material-ui/styles'

import Tabs from './Tabs';
import DrawerIcon from './DrawerIcon';
import Drawer from './Drawer';

const themeTypeIcon = {
  light: <WbSunnyIcon />,
  dark: <Brightness3Icon />
}

class Navigator extends React.PureComponent {
  
  render() {
    // console.log('AppBar rendered')
    const { 
      classes, 
      theme: {palette: {type: themeType}}, 
      toggleThemeType, 
      drawerOpen, toggleDrawer, 
      tabs, removeTab, changeTab,
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

            <Typography variant="h5" className={classes.brand}>
              Sudoku PQ
            </Typography>

            <Tabs 
              tabs={tabs}
              removeTab={removeTab}
              changeTab={changeTab}
            />

            <Tooltip title="Toggle light/dark theme">
              <IconButton className={classes.themeTypeToggle} onClick={toggleThemeType}>
                {themeTypeIcon[themeType]}
              </IconButton>
            </Tooltip>
          </Toolbar>
        </AppBar>

        <Drawer
          sudokuActive={(tabs.activeIndex || tabs.activeIndex === 0) && true}
          drawerOpen={drawerOpen}
          dispatchDialog={dispatchDialog}
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

  brand: {
    whiteSpace: 'nowrap'
  },

  drawerBtn: {
    margin: theme.spacing(0, 1),
  },

  themeTypeToggle: {
    margin: theme.spacing(0, 2),
    color: theme.palette.type === 'light' ? 'white' : 'black',
  }
})


const mapStateToProps = state => ({
  drawerOpen: state.navigation.drawerOpen,
  tabs: state.tabs,
})

const mapDispatchToProps = dispatch => ({
  toggleThemeType: () => dispatch(ThemeTypeToggle()),
  toggleDrawer: () => dispatch(DrawerToggle()),
  changeTab: (index) => dispatch(TabChange(index)),
  removeTab: (index) => dispatch(TabRemoval(index)),
  dispatchDialog: (type) => dispatch(DialogAction(type)),
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, {withTheme: true})(Navigator));

// export default withStyles(styles)(Navigator);
