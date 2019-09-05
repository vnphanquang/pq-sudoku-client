import React, {useCallback} from 'react';
import clsx from 'clsx';
import {useSelector, useDispatch} from 'react-redux';
import {ToggleDrawer} from '../redux/actions'

import {makeStyles} from '@material-ui/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import ArrowUp from '@material-ui/icons/KeyboardArrowUp';
import MenuIcon from '@material-ui/icons/Menu';

import {APPBAR_HEIGHT} from './utils'

function SudokuAppBar() {
  const drawerOpen = useSelector(state => state.navigation.drawerOpen);
  const dispatch = useDispatch();
  const toggleDrawer = useCallback(
    () => dispatch(ToggleDrawer()),
    [dispatch]
  );

  const classes = useStyles();
  return (
    <AppBar className={classes.root}>
      <Toolbar disableGutters>
        <IconButton
          aria-label="Toggle drawer"
          onClick={toggleDrawer}
          className={classes.drawerBtn}
        >
          {drawerOpen ? <ArrowUp/> : <MenuIcon/>}
        </IconButton>

        <Typography variant="h5" className={classes.brand}>
          Sudoku PQ
        </Typography>
      </Toolbar>
    </AppBar>
  )
}

const useStyles = makeStyles(theme => ({
  root: {
    zIndex: theme.zIndex.drawer,
    height: APPBAR_HEIGHT
  },
  brand: {
    whiteSpace: 'nowrap'
  },
  drawerBtn: {
    marginLeft: 12,
    marginRight: 12
  },
}))

export default SudokuAppBar;
