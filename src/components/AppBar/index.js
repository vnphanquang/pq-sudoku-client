import React from 'react';

import {connect} from 'react-redux';
import {ThemeTypeToggle} from '../../redux/actions';

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

const themeTypeIcon = {
  light: <WbSunnyIcon />,
  dark: <Brightness3Icon />
}

class AppBarPQS extends React.PureComponent {
  
  render() {
    // console.log('AppBar rendered')
    const {classes, themeType, toggleThemeType} = this.props;
    return (
      <AppBar className={classes.root}>
        <Toolbar disableGutters>

          <DrawerIcon className={classes.drawerBtn} />

          <Typography variant="h5" className={classes.brand}>
            Sudoku PQ
          </Typography>

          <Tabs />

          <Tooltip title="Toggle light/dark theme">
            <IconButton className={classes.themeTypeToggle} onClick={toggleThemeType}>
              {themeTypeIcon[themeType]}
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>
    )
  }
}

const styles = theme => ({
  root: {
    zIndex: theme.zIndex.drawer,
    height: APPBAR_HEIGHT,
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
  themeType: state.theme.type,
})

const mapDispatchToProps = dispatch => ({
  toggleThemeType: () => dispatch(ThemeTypeToggle()),
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(AppBarPQS));
